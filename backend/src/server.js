const app = require("./app");
const connectDatabase = require("./config/database");
const env = require("./config/env");
const { startReminderScheduler } = require("./jobs/reminderScheduler");

connectDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      startReminderScheduler();
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
