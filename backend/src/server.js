const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const passport = require("passport");

dotenv.config();
require("./config/passport");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Doubtly API is running 🚀");
});

// 🔐 auth routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/doubts", require("./routes/doubt.routes"));
app.use("/auth", require("./routes/authOAuthRoutes"));


const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
