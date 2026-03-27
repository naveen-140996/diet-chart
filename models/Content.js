const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["reel", "youtube"],
  },
  url: String,
});

module.exports = mongoose.model("Content", contentSchema);