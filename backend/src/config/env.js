require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/healthcare_appointments",
  jwtSecret: process.env.JWT_SECRET || "development-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  appName: process.env.APP_NAME || "Automated Health Care Appointment System",
  appEmail: process.env.APP_EMAIL || "no-reply@example.com",
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    smsFrom: process.env.TWILIO_SMS_FROM,
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM
  }
};
