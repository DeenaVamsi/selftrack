const express = require("express");
const router = express.Router();
const Schedule = require("../models/Schedule");

// Add schedule
router.post("/", async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all schedules
router.get("/", async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("activityId");
    res.json(schedules);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
