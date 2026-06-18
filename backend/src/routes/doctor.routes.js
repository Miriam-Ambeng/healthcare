const express = require("express");
const { body } = require("express-validator");
const {
  listDoctors,
  getPublicStats,
  updateMySchedule,
  getAvailability
} = require("../controllers/doctor.controller");
const { protect, allowRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/public/stats", getPublicStats);
router.get("/", protect, listDoctors);
router.get("/:doctorId/availability", protect, getAvailability);

router.patch(
  "/me/schedule",
  protect,
  allowRoles("doctor"),
  [
    body("specialization").optional().trim().notEmpty(),
    body("schedule").isArray(),
    body("schedule.*.dayOfWeek").isInt({ min: 0, max: 6 }),
    body("schedule.*.startTime").matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("schedule.*.endTime").matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("schedule.*.slotDurationMinutes").optional().isInt({ min: 10, max: 240 }),
    body("schedule.*.breaks").optional().isArray({ max: 4 }),
    body("schedule.*.breaks.*.startTime").optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    body("schedule.*.breaks.*.endTime").optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  ],
  updateMySchedule
);

module.exports = router;
