const Appointment = require("../models/Appointment");
const User = require("../models/User");

function getWeekRange() {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

async function getStats(req, res, next) {
  try {
    const { weekStart, weekEnd } = getWeekRange();

    const totalDoctors = await User.countDocuments({ role: "doctor" });

    const appointments = await Appointment.find({
      appointmentDate: {
        $gte: weekStart,
        $lte: weekEnd
      },
      status: { $in: ["pending", "confirmed"] }
    }).select("doctor");

    const appointmentsThisWeek = appointments.length;
    const availableSpecialists = totalDoctors;

    return res.json({
      success: true,
      data: {
        appointmentsThisWeek,
        availableSpecialists,
        totalDoctors
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getStats
};
