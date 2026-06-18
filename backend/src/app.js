const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const doctorRoutes = require("./routes/doctor.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const statsRoutes = require("./routes/stats.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const { attachLanguage } = require("./middleware/language.middleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(attachLanguage);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Automated Health Care Appointment System API"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
