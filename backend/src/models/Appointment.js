const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["email", "sms", "whatsapp"],
      required: true
    },
    sendAt: {
      type: Date,
      required: true
    },
    sentAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending"
    },
    error: {
      type: String
    }
  },
  { _id: true }
);

const medicalReportSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      trim: true
    },
    mimeType: {
      type: String,
      trim: true
    },
    size: {
      type: Number,
      min: 0
    },
    data: {
      type: String
    },
    details: {
      age: {
        type: String,
        trim: true
      },
      bloodPressure: {
        type: String,
        trim: true
      },
      height: {
        type: String,
        trim: true
      },
      temperature: {
        type: String,
        trim: true
      },
      pressure: {
        type: String,
        trim: true
      },
      weight: {
        type: String,
        trim: true
      },
      allergies: {
        type: String,
        trim: true
      },
      otherMedicalInfo: {
        type: String,
        trim: true
      }
    }
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    appointmentDate: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    reason: {
      type: String,
      trim: true
    },
    previousMedicalReport: {
      type: medicalReportSchema
    },
    reminderSchedule: {
      type: [reminderSchema],
      default: []
    },
    reminderFeeTotal: {
      type: Number,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed"] }
    }
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
