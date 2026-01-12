const express = require("express");
const {
  registerUser,
  login,
  getMe
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();


router.post("/register", registerUser);


router.post("/login",login);


router.get("/me", protect, getMe);

module.exports = router;
