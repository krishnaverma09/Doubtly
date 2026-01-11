const mongoose = require("mongoose");

const connectDB = async () => {
  // Reuse connection across serverless invocations to avoid overload
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Basic guard for missing URI to avoid hard crash
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
    // Don't exit in serverless; bubble the error to let platform handle
    throw error;
  }
};

module.exports = connectDB;
