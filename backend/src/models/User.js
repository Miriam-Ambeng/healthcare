const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const scheduleSchema = new mongoose.Schema(
  {
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
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
    slotDurationMinutes: {
      type: Number,
      default: 30,
      min: 10,
      max: 240
    },
    breaks: {
      type: [
        {
          startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/
          },
          endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/
          }
        }
      ],
      default: []
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    preferredLanguage: {
      type: String,
      enum: ["en", "fr"],
      default: "en"
    },
    specialization: {
      type: String,
      trim: true
    },
    onmcNumber: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      unique: true,
      match: /^\d{4}\/\d{4}$/
    },
    schedule: {
      type: [scheduleSchema],
      default: []
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
