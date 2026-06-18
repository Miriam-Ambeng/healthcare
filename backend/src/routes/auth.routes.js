const express = require("express");
const { body } = require("express-validator");
const { register, login, me } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["patient", "doctor", "admin"]),
    body("onmcNumber")
      .if(body("role").equals("doctor"))
      .trim()
      .matches(/^\d{4}\/\d{4}$/)
      .withMessage("Invalid ONMC matricule."),
    body("preferredLanguage").optional().isIn(["en", "fr"])
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty()
  ],
  login
);

router.get("/me", protect, me);

module.exports = router;
