const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");

// Add activity
router.post("/", async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
