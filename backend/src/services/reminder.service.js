const Appointment = require("../models/Appointment");
require("../models/User");
const { sendAppointmentReminder } = require("./email.service");

async function processDueReminders(now = new Date()) {
  const appointments = await Appointment.find({
    status: "confirmed",
    reminderSchedule: {
      $elemMatch: {
        sendAt: { $lte: now },
        status: "pending"
      }
    }
  })
    .populate("patient", "name email phone")
    .populate("doctor", "name email phone specialization");

  let sentCount = 0;
  let failedCount = 0;

  for (const appointment of appointments) {
    for (const reminder of appointment.reminderSchedule) {
      if (reminder.status !== "pending" || reminder.sendAt > now) {
        continue;
      }

      try {
        await sendAppointmentReminder(appointment, reminder.method);
        reminder.status = "sent";
        reminder.sentAt = new Date();
        reminder.error = undefined;
        sentCount += 1;
      } catch (error) {
        reminder.status = "pending";
        reminder.error = error.message;
        failedCount += 1;
        console.error(`Reminder failed for appointment ${appointment._id}:`, error.message);
      }
    }

    await appointment.save();
  }

  return {
    appointments: appointments.length,
    sent: sentCount,
    failed: failedCount
  };
}

module.exports = {
  processDueReminders
};
