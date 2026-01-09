const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

const getTodayName = () => {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
};

router.get("/", async (req, res) => {
  try {
    const today = getTodayName(); // Monday, Tuesday...

    const schedules = await Schedule.find({
      days: today,
    }).populate("activityId");

    const todayTasks = schedules.map((s) => ({
      activityId: s.activityId._id,
      activityName: s.activityId.name,
      category: s.activityId.category,
      color: s.activityId.color,
      startTime: s.startTime,
      endTime: s.endTime,
      plannedDuration: s.plannedDuration,
      metadata: s.metadata || {},
    }));

    res.json({
      date: new Date().toISOString().split("T")[0],
      day: today,
      tasks: todayTasks,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
