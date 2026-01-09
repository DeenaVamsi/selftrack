const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },

  startTime: {
    type: String, // "04:30"
  },

  endTime: {
    type: String, // "06:00"
  },

  plannedDuration: {
    type: Number, // hours (1.5, 2, etc.)
  },

  frequency: {
    type: String,
    enum: ["Daily", "Weekly"],
    required: true,
  },

  days: {
    type: [String],
    // ["Monday", "Tuesday", ...]
  },

  metadata: {
    type: Object,
    /*
      For Gym:
      {
        Monday: "Chest",
        Tuesday: "Triceps",
        Wednesday: "Shoulder",
        Thursday: "Back",
        Friday: "Biceps",
        Saturday: "Legs"
      }

      For Content Creation:
      {
        platforms: ["YouTube", "Instagram"],
        goal: "1 reel per week"
      }
    */
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
