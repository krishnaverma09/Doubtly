const router = require("express").Router();
const passport = require("passport");
const generateToken = require("../utils/generateToken");

router.get("/google", (req, res, next) => {
  if (req.query.role=="student") {
  const state = req.query.role || "student";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res, next);
}
else{
   const state = req.query.role || "teacher";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res, next);
}});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
  }
);

module.exports = router;
