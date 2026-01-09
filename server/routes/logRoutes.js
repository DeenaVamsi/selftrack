const express = require("express");
const router = express.Router();
const DailyLog = require("../models/DailyLog");

// Save daily log
router.post("/", async (req, res) => {
  try {
    const { date, activityId } = req.body;

    const log = await DailyLog.findOneAndUpdate(
      { date, activityId }, // 🔍 search condition
      req.body, // 📝 new data
      { new: true, upsert: true } // 🔄 update or insert
    );

    res.status(200).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get logs by date
router.get("/:date", async (req, res) => {
  try {
    const logs = await DailyLog.find({ date: req.params.date });
    res.json(logs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
