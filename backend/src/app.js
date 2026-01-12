const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");


dotenv.config();
require("./config/passport");


connectDB();

const app = express();


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
