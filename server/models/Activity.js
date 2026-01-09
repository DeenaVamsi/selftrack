const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Study", "Health", "Spiritual", "Skill"],
    required: true,
  },
  description: {
    type: String,
  },
  color: {
    type: String, // for UI (example: "#4CAF50")
    default: "#2196F3",
  },
  active: {
    type: Boolean,
    default: true,
  },
  plannedDuration: {
    type: Number,
    default: 1,
  },
  scheduleDays: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Activity", activitySchema);
