const { validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { addMinutes, hasOverlap, isTimeInsideSchedule } = require("../utils/time");
const { translate } = require("../i18n/translator");
const {
  sendAppointmentConfirmation,
  sendAppointmentStatusUpdate
} = require("../services/email.service");

const PAID_REMINDER_FEE = 25;

function normalizeReminderSchedule(reminders) {
  if (!Array.isArray(reminders) || reminders.length === 0) {
    return [];
  }

  return reminders.slice(0, 3).map((reminder) => ({
    method: reminder.method,
    sendAt: new Date(reminder.sendAt),
    status: "pending"
  }));
}

function calculateReminderFee(reminders) {
  if (!Array.isArray(reminders)) {
    return 0;
  }

  return reminders.filter((reminder) => reminder.method !== "email").length * PAID_REMINDER_FEE;
}

function normalizeMedicalReport(report) {
  if (!report || !report.details) {
    return undefined;
  }

  return {
    fileName: report.fileName,
    mimeType: report.mimeType,
    size: report.size,
    data: report.data,
    details: report.details
  };
}

function dayBounds(date) {
  const start = new Date(date.toDateString());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

function appointmentStartDateTime(appointment) {
  const dateText = appointment.appointmentDate.toISOString().slice(0, 10);
  return new Date(`${dateText}T${appointment.startTime}:00`);
}

async function validateSlot({ doctor, appointmentDate, startTime, slotDurationMinutes }) {
  const schedule = doctor.schedule.find((item) => item.dayOfWeek === appointmentDate.getDay());

  if (!schedule) {
    return { valid: false, reason: "doctorUnavailable" };
  }

  const endTime = addMinutes(startTime, slotDurationMinutes || schedule.slotDurationMinutes);

  if (!isTimeInsideSchedule(startTime, endTime, schedule)) {
    return { valid: false, reason: "doctorUnavailable" };
  }

  const bounds = dayBounds(appointmentDate);
  const appointments = await Appointment.find({
    doctor: doctor._id,
    appointmentDate: { $gte: bounds.start, $lt: bounds.end },
    status: { $in: ["pending", "confirmed"] }
  });

  const isBooked = appointments.some((appointment) =>
    hasOverlap(startTime, endTime, appointment.startTime, appointment.endTime)
  );

  if (isBooked) {
    return { valid: false, reason: "slotAlreadyBooked" };
  }

  return { valid: true, endTime };
}

async function createAppointment(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const doctor = await User.findOne({ _id: req.body.doctorId, role: "doctor" });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: translate(req.language, "notFound")
      });
    }

    const appointmentDate = new Date(req.body.appointmentDate);
    const slot = await validateSlot({
      doctor,
      appointmentDate,
      startTime: req.body.startTime,
      slotDurationMinutes: req.body.slotDurationMinutes
    });

    if (!slot.valid) {
      return res.status(409).json({
        success: false,
        message: translate(req.language, slot.reason)
      });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      appointmentDate,
      startTime: req.body.startTime,
      endTime: slot.endTime,
      reason: req.body.reason || "Consultation",
      previousMedicalReport: normalizeMedicalReport(req.body.previousMedicalReport),
      reminderSchedule: normalizeReminderSchedule(req.body.reminderSchedule),
      reminderFeeTotal: calculateReminderFee(req.body.reminderSchedule),
      status: "confirmed"
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("patient", "name email phone preferredLanguage")
      .populate("doctor", "name email phone specialization");

    await sendAppointmentConfirmation(populated);

    return res.status(201).json({
      success: true,
      message: translate(req.language, "appointmentBooked"),
      data: populated
    });
  } catch (error) {
    return next(error);
  }
}

async function listAppointments(req, res, next) {
  try {
    const query = {};

    if (req.user.role === "patient") {
      query.patient = req.user._id;
    }

    if (req.user.role === "doctor") {
      query.doctor = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, startTime: 1 })
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization");

    return res.json({ success: true, data: appointments });
  } catch (error) {
    return next(error);
  }
}

async function getAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: translate(req.language, "notFound")
      });
    }

    const ownsAppointment =
      req.user.role === "admin" ||
      appointment.patient._id.equals(req.user._id) ||
      appointment.doctor._id.equals(req.user._id);

    if (!ownsAppointment) {
      return res.status(403).json({
        success: false,
        message: translate(req.language, "forbidden")
      });
    }

    return res.json({ success: true, data: appointment });
  } catch (error) {
    return next(error);
  }
}

async function updateAppointmentStatus(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: translate(req.language, "notFound")
      });
    }

    if (req.user.role !== "admin" && !appointment.doctor._id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: translate(req.language, "forbidden")
      });
    }

    appointment.status = req.body.status;
    await appointment.save();
    await sendAppointmentStatusUpdate(appointment);

    return res.json({
      success: true,
      message: translate(req.language, "appointmentUpdated"),
      data: appointment
    });
  } catch (error) {
    return next(error);
  }
}

async function cancelAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate("patient", "name email phone")
      .populate("doctor", "name email specialization");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: translate(req.language, "notFound")
      });
    }

    const canCancel =
      req.user.role === "admin" ||
      appointment.patient._id.equals(req.user._id) ||
      appointment.doctor._id.equals(req.user._id);

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: translate(req.language, "forbidden")
      });
    }

    if (
      req.user.role === "patient" &&
      appointmentStartDateTime(appointment).getTime() - Date.now() < 24 * 60 * 60 * 1000
    ) {
      return res.status(409).json({
        success: false,
        message: translate(req.language, "cancelWindowClosed")
      });
    }

    appointment.status = "cancelled";
    await appointment.save();
    await sendAppointmentStatusUpdate(appointment);

    return res.json({
      success: true,
      message: translate(req.language, "appointmentCancelled"),
      data: appointment
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment
};
