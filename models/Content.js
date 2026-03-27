const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["reel", "youtube"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // ✅ NEW FIELD
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);