const mongoose = require("mongoose");
const connectDatabase = require("../config/database");
const { processDueReminders } = require("../services/reminder.service");

async function sendReminders() {
  await connectDatabase();
  const result = await processDueReminders();
  console.log(`Processed ${result.appointments} appointment(s), sent ${result.sent} reminder(s), failed ${result.failed} reminder(s).`);
}

if (require.main === module) {
  sendReminders()
    .then(async () => {
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error("Failed to send reminders:", error.message);
      await mongoose.connection.close();
      process.exit(1);
    });
}

module.exports = {
  sendReminders
};
