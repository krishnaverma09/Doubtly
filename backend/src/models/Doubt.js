const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["open", "answered", "resolved"],
      default: "open",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [
      {
        text: { type: String, required: true },
        media: [
          {
            url: { type: String, required: true },
            mediaType: {
              type: String,
              enum: ["image", "audio", "video"],
              required: true,
            },
          },
        ],
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now }
      }
    ],

    media: [
  {
    url: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["image", "audio", "video"],
      required: true,
    },
  },
],

  },
  { timestamps: true },
);
 

module.exports = mongoose.model("Doubt", doubtSchema);
