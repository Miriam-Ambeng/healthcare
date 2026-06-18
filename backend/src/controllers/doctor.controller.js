const { validationResult } = require("express-validator");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { addMinutes, hasOverlap, isTimeInsideSchedule } = require("../utils/time");
const { translate } = require("../i18n/translator");

function weekBounds(referenceDate = new Date()) {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

function isInsideBreak(startTime, endTime, schedule) {
  return (schedule.breaks || []).some((breakTime) =>
    hasOverlap(startTime, endTime, breakTime.startTime, breakTime.endTime)
  );
}

async function listDoctors(req, res, next) {
  try {
    const doctors = await User.find({ role: "doctor" }).select("name email phone specialization schedule");
    res.json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
}

async function getPublicStats(req, res, next) {
  try {
    const { start, end } = weekBounds();
    const [weeklyAppointments, activeSpecialists, weeklyReminderReady] = await Promise.all([
      Appointment.countDocuments({
        appointmentDate: { $gte: start, $lt: end },
        status: { $in: ["pending", "confirmed", "completed"] }
      }),
      User.countDocuments({
        role: "doctor",
        "schedule.0": { $exists: true }
      }),
      Appointment.countDocuments({
        appointmentDate: { $gte: start, $lt: end },
        status: { $in: ["pending", "confirmed", "completed"] },
        "reminderSchedule.0": { $exists: true }
      })
    ]);

    return res.json({
      success: true,
      data: {
        weeklyAppointments,
        activeSpecialists,
        reminderReadyPercent: weeklyAppointments
          ? Math.round((weeklyReminderReady / weeklyAppointments) * 100)
          : 0,
        languagesSupported: 2
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function updateMySchedule(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    req.user.specialization = req.body.specialization || req.user.specialization;
    req.user.schedule = req.body.schedule || req.user.schedule;
    await req.user.save();

    return res.json({
      success: true,
      message: translate(req.language, "scheduleUpdated"),
      data: req.user
    });
  } catch (error) {
    return next(error);
  }
}

async function getAvailability(req, res, next) {
  try {
    const doctor = await User.findOne({ _id: req.params.doctorId, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: translate(req.language, "notFound")
      });
    }

    const date = new Date(req.query.date);
    if (Number.isNaN(date.getTime())) {
      return res.status(422).json({
        success: false,
        message: "A valid date query is required. Example: ?date=2026-05-01"
      });
    }

    const daySchedule = doctor.schedule.find((item) => item.dayOfWeek === date.getDay());

    if (!daySchedule) {
      return res.json({ success: true, data: [] });
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
      appointmentDate: {
        $gte: new Date(date.toDateString()),
        $lt: new Date(new Date(date.toDateString()).getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $in: ["pending", "confirmed"] }
    });

    const slots = [];
    let cursor = daySchedule.startTime;

    while (isTimeInsideSchedule(cursor, addMinutes(cursor, daySchedule.slotDurationMinutes), daySchedule)) {
      const endTime = addMinutes(cursor, daySchedule.slotDurationMinutes);
      const booked = appointments.some((appointment) => appointment.startTime === cursor);
      const onBreak = isInsideBreak(cursor, endTime, daySchedule);

      slots.push({
        startTime: cursor,
        endTime,
        available: !booked && !onBreak
      });

      cursor = endTime;
    }

    return res.json({ success: true, data: slots });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listDoctors,
  getPublicStats,
  updateMySchedule,
  getAvailability
};
