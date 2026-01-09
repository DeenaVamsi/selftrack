const express = require("express");
const router = express.Router();
const DailyLog = require("../models/DailyLog");

// GET yearly heatmap data
// /heatmap?year=2026
router.get("/", async (req, res) => {
  try {
    const year = req.query.year;
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    // Fetch logs of the year
    const logs = await DailyLog.find({
      date: { $gte: start, $lte: end },
    });

    // Map date -> completed count
    const map = {};
    logs.forEach((log) => {
      if (!map[log.date]) map[log.date] = 0;
      if (log.completed) map[log.date]++;
    });

    // Generate full year (important)
    const result = [];
    const date = new Date(start);
    const endDate = new Date(end);

    while (date <= endDate) {
      const d = date.toISOString().split("T")[0];
      result.push({
        date: d,
        count: map[d] || 0,
      });
      date.setDate(date.getDate() + 1);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
