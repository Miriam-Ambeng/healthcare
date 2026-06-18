const express = require("express");
const { body } = require("express-validator");
const {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment
} = require("../controllers/appointment.controller");
const { protect, allowRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("patient"),
  [
    body("doctorId").isMongoId(),
    body("appointmentDate").isISO8601(),
    body("startTime").matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("slotDurationMinutes").optional().isInt({ min: 10, max: 240 }),
    body("reminderSchedule").optional().isArray({ max: 3 }),
    body("reminderSchedule.*.method").optional().isIn(["email", "sms", "whatsapp"]),
    body("reminderSchedule.*.sendAt").optional().isISO8601(),
    body("previousMedicalReport").isObject(),
    body("previousMedicalReport.fileName").isString().notEmpty().isLength({ max: 180 }),
    body("previousMedicalReport.mimeType").isString().matches(/^image\/(png|jpe?g|webp)$/).isLength({ max: 120 }),
    body("previousMedicalReport.size").isInt({ min: 1, max: 3145728 }),
    body("previousMedicalReport.data").isString().notEmpty().isLength({ max: 4500000 }),
    body("previousMedicalReport.details").isObject(),
    body("previousMedicalReport.details.age").trim().notEmpty().isLength({ max: 20 }),
    body("previousMedicalReport.details.bloodPressure").trim().notEmpty().isLength({ max: 40 }),
    body("previousMedicalReport.details.height").trim().notEmpty().isLength({ max: 40 }),
    body("previousMedicalReport.details.temperature").trim().notEmpty().isLength({ max: 40 }),
    body("previousMedicalReport.details.pressure").trim().notEmpty().isLength({ max: 80 }),
    body("previousMedicalReport.details.weight").optional().trim().isLength({ max: 40 }),
    body("previousMedicalReport.details.allergies").optional().trim().isLength({ max: 500 }),
    body("reason").optional().trim()
  ],
  createAppointment
);

router.get("/", protect, listAppointments);
router.get("/:appointmentId", protect, getAppointment);

router.patch(
  "/:appointmentId/status",
  protect,
  allowRoles("doctor", "admin"),
  [body("status").isIn(["pending", "confirmed", "cancelled", "completed"])],
  updateAppointmentStatus
);

router.delete("/:appointmentId", protect, cancelAppointment);

module.exports = router;
