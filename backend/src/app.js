const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");

// Load env vars early for serverless/runtime
dotenv.config();
require("./config/passport");

// Connect to database once per cold start
connectDB();

const app = express();

// Allow configurable frontend origins (comma-separated) or default to * for local dev
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : "*";
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Doubtly API is running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/doubts", require("./routes/doubt.routes"));
app.use("/auth", require("./routes/authOAuthRoutes"));

module.exports = { app };
