const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId;
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: String,

    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
  },
  { timestamps: true }
);

// 🔐 Hash password safely
userSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
