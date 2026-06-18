# Automated Health Care Appointment System Backend

Node.js backend for booking patient appointments, helping doctors manage schedules, validating time slots, sending email confirmations, and returning multilingual messages.

## Features

- Patient and doctor registration/login
- JWT authentication and role-based access
- Doctor schedule management
- Appointment booking, listing, status updates, and cancellation
- Time slot validation to prevent double booking
- Email confirmation/reminder service hook
- Multilingual API messages using `Accept-Language`

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Update `.env` with your MongoDB connection string, JWT secret, and SMTP credentials.

## Sending Appointment Reminders

When the backend server is running, it automatically checks for due reminders every minute.

You can also run this command manually to send reminders that are due:

```bash
npm run send-reminders
```

In production, schedule that command with Windows Task Scheduler, cron, Render Cron Jobs, or another scheduler. It should run repeatedly, for example every 5 minutes.
The current implementation supports up to three scheduled reminders per appointment. Email reminders use SMTP. SMS and WhatsApp reminders use Twilio.

To enable SMS/WhatsApp, add these values to `.env`:

```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_SMS_FROM=+19086416894
TWILIO_WHATSAPP_FROM=whatsapp:+19086416894
```

Reminders are sent only when their selected date/time is due. Patient phone numbers should use the international format, for example `+237670940984`.

You can test notification providers directly:

```bash
npm run test-notification -- email your@email.com
npm run test-notification -- sms +237670940984
npm run test-notification -- whatsapp +237670940984
```

If a provider is not configured, the command prints the missing configuration instead of silently passing.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Doctors

- `GET /api/doctors`
- `GET /api/doctors/:doctorId/availability?date=2026-05-01`
- `PATCH /api/doctors/me/schedule`

### Appointments

- `POST /api/appointments`
- `GET /api/appointments`
- `GET /api/appointments/:appointmentId`
- `PATCH /api/appointments/:appointmentId/status`
- `DELETE /api/appointments/:appointmentId`

## Example Register Request

```json
{
  "name": "Amina Yusuf",
  "email": "amina@example.com",
  "password": "password123",
  "role": "patient",
  "phone": "+2348000000000",
  "preferredLanguage": "en"
}
```

## Example Doctor Schedule

```json
{
  "specialization": "Cardiology",
  "schedule": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "15:00",
      "slotDurationMinutes": 30
    },
    {
      "dayOfWeek": 3,
      "startTime": "10:00",
      "endTime": "14:00",
      "slotDurationMinutes": 30
    }
  ]
}
```

`dayOfWeek` uses JavaScript values: Sunday is `0`, Monday is `1`, and Saturday is `6`.

## Multilingual Support

Pass an `Accept-Language` header:

```http
Accept-Language: en
Accept-Language: fr
```

Currently included languages are English and French. More can be added in `src/i18n/messages.js`.
