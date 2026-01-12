const router = require("express").Router();
const passport = require("passport");
const generateToken = require("../utils/generateToken");

router.get("/google", (req, res, next) => {
  const role = req.query.role || "student";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: role,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    
    const userInfo = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    }));
    res.redirect(`${frontendUrl}/oauth-success?token=${token}&user=${userInfo}`);
  }
);

module.exports = router;
