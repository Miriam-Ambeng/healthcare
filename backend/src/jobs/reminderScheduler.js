const { processDueReminders } = require("../services/reminder.service");

function startReminderScheduler() {
  const intervalMs = Number(process.env.REMINDER_INTERVAL_MS || 60000);
  let running = false;

  async function tick() {
    if (running) {
      return;
    }

    running = true;
    try {
      const result = await processDueReminders();
      if (result.sent > 0 || result.failed > 0) {
        console.log(`Reminder scheduler: sent ${result.sent}, failed ${result.failed}.`);
      }
    } catch (error) {
      console.error("Reminder scheduler failed:", error.message);
    } finally {
      running = false;
    }
  }

  setTimeout(tick, 5000);
  const timer = setInterval(tick, intervalMs);
  console.log(`Reminder scheduler running every ${intervalMs / 1000}s.`);

  return timer;
}

module.exports = {
  startReminderScheduler
};
