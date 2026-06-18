const nodemailer = require("nodemailer");
const twilio = require("twilio");
const env = require("../config/env");

function hasSmtpConfig() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function createTransporter() {
  if (!hasSmtpConfig()) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  });
}

async function sendMail({ to, subject, text, required = false }) {
  const transporter = createTransporter();

  if (!transporter) {
    if (required) {
      throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.");
    }
    console.log("Email skipped because SMTP is not configured:", { to, subject, text });
    return;
  }

  await transporter.sendMail({
    from: `"${env.appName}" <${env.appEmail}>`,
    to,
    subject,
    text
  });
}

function normalizePhoneNumber(phone) {
  if (!phone || typeof phone !== "string") {
    return "";
  }

  return phone.replace(/\D/g, "");
}

function createTwilioClient() {
  if (!env.twilio.accountSid || !env.twilio.authToken) {
    return null;
  }

  return twilio(env.twilio.accountSid, env.twilio.authToken);
}

async function sendSms({ to, text }) {
  const client = createTwilioClient();
  const from = env.twilio.smsFrom;
  const normalizedTo = normalizePhoneNumber(to);

  if (!client || !from || !normalizedTo) {
    throw new Error("Twilio SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_SMS_FROM in .env.");
  }

  await client.messages.create({
    from,
    to: `+${normalizedTo}`,
    body: text
  });
}

async function sendWhatsApp({ to, appointment }) {
  const client = createTwilioClient();
  const from = env.twilio.whatsappFrom;
  const normalizedTo = normalizePhoneNumber(to);

  if (!client || !from || !normalizedTo) {
    throw new Error("Twilio WhatsApp is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM in .env.");
  }

  await client.messages.create({
    from,
    to: `whatsapp:+${normalizedTo}`,
    body: appointmentReminderText(appointment)
  });
}

function appointmentReminderText(appointment) {
  const patient = appointment.patient;
  const doctor = appointment.doctor;
  const date = appointment.appointmentDate.toISOString().slice(0, 10);

  return `Dear ${patient.name}, this is a reminder for your appointment with Dr. ${doctor.name} on ${date} at ${appointment.startTime}.`;
}

async function sendAppointmentConfirmation(appointment) {
  const patient = appointment.patient;
  const doctor = appointment.doctor;
  const date = appointment.appointmentDate.toISOString().slice(0, 10);

  await sendMail({
    to: patient.email,
    subject: "Appointment Confirmation",
    text: `Dear ${patient.name}, your appointment with Dr. ${doctor.name} is confirmed for ${date} at ${appointment.startTime}.`
  });
}

async function sendAppointmentStatusUpdate(appointment) {
  const patient = appointment.patient;
  const doctor = appointment.doctor;
  const date = appointment.appointmentDate.toISOString().slice(0, 10);

  await sendMail({
    to: patient.email,
    subject: "Appointment Update",
    text: `Dear ${patient.name}, your appointment with Dr. ${doctor.name} on ${date} at ${appointment.startTime} is now ${appointment.status}.`
  });
}

async function sendAppointmentReminder(appointment, method = "email") {
  const patient = appointment.patient;
  const text = appointmentReminderText(appointment);

  if (method === "sms") {
    await sendSms({ to: patient.phone, text });
    return;
  }

  if (method === "whatsapp") {
    await sendWhatsApp({ to: patient.phone, appointment });
    return;
  }

  await sendMail({
    to: patient.email,
    subject: "Appointment Reminder",
    text,
    required: true
  });
}

module.exports = {
  sendMail,
  sendSms,
  sendWhatsApp,
  sendAppointmentConfirmation,
  sendAppointmentStatusUpdate,
  sendAppointmentReminder
};
