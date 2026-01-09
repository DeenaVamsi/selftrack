const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  date: String,
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
  plannedDuration: Number,
  actualDuration: Number,
  completed: Boolean,
});

module.exports = mongoose.model("DailyLog", dailyLogSchema);
