const {
  sendMail,
  sendSms,
  sendWhatsApp
} = require("../services/email.service");

async function testNotification() {
  const method = process.argv[2];
  const recipient = process.argv[3];

  if (!method || !recipient) {
    console.log("Usage:");
    console.log("  npm run test-notification -- email your@email.com");
    console.log("  npm run test-notification -- sms +237670940984");
    console.log("  npm run test-notification -- whatsapp +237670940984");
    process.exit(1);
  }

  const text = "HealthCare+ test notification. Your appointment reminder setup is working.";

  if (method === "email") {
    await sendMail({
      to: recipient,
      subject: "HealthCare+ Test Email",
      text,
      required: true
    });
  } else if (method === "sms") {
    await sendSms({ to: recipient, text });
  } else if (method === "whatsapp") {
    const appointment = {
      patient: { name: "Test Patient", phone: recipient },
      doctor: { name: "Test Doctor" },
      appointmentDate: new Date(),
      startTime: "09:00"
    };

    await sendWhatsApp({ to: recipient, appointment });
  } else {
    throw new Error("Method must be email, sms, or whatsapp.");
  }

  console.log(`${method} test notification sent to ${recipient}`);
}

testNotification().catch((error) => {
  console.error("Notification test failed:", error.message);
  process.exit(1);
});
