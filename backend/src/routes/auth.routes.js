const express = require("express");
const {
  registerUser,
  login,
  getMe
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login",login);

// Get Me
router.get("/me", protect, getMe);

module.exports = router;
