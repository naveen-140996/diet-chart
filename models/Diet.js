const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetWeight: Number,

    entries: [
      {
        day: Number,
        morning: String,
        lunch: String,
        dinner: String,
        weight: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diet", dietSchema);