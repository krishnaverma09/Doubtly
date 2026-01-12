const mongoose = require("mongoose");

const connectDB = async () => {

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
  
    throw error;
  }
};

module.exports = connectDB;
