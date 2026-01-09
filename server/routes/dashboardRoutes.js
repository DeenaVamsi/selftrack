const express = require("express");
const router = express.Router();

const DailyLog = require("../models/DailyLog");
const Schedule = require("../models/Schedule");

// GET monthly dashboard data
// /dashboard/monthly?month=01&year=2026
router.get("/monthly", async (req, res) => {
  try {
    const { month, year } = req.query;

    const daysInMonth = new Date(year, month, 0).getDate();

    let totalPlanned = 0;
    let totalCompleted = 0;

    const activityMap = {};

    // helper: count matching days in month
    const countDaysInMonth = (year, month, days) => {
      let count = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month - 1, d);
        const day = date.toLocaleString("en-US", { weekday: "long" });
        if (days.includes(day)) count++;
      }
      return count;
    };

    // 1️⃣ PLANNED HOURS (FROM SCHEDULE)
    const schedules = await Schedule.find().populate("activityId");

    schedules.forEach((sch) => {
      const activeDays = countDaysInMonth(year, month, sch.days);
      const planned = (Number(sch.plannedDuration) || 0) * activeDays;

      const actId = sch.activityId._id.toString();

      if (!activityMap[actId]) {
        activityMap[actId] = {
          activityId: actId,
          activityName: sch.activityId.name,
          plannedHours: 0,
          completedHours: 0,
        };
      }

      activityMap[actId].plannedHours += planned;
      totalPlanned += planned;
    });

    // 2️⃣ COMPLETED HOURS (FROM DAILY LOG)
    const logs = await DailyLog.find({
      date: { $regex: `^${year}-${month}` },
    });

    logs.forEach((log) => {
      if (!log.completed) return;

      const actId = log.activityId.toString();
      const actual = Number(log.actualDuration) || 0;

      if (activityMap[actId]) {
        activityMap[actId].completedHours += actual;
        totalCompleted += actual;
      }
    });

    // 3️⃣ FINAL STATS
    const activityStats = Object.values(activityMap).map((a) => ({
      ...a,
      percentage:
        a.plannedHours === 0
          ? 0
          : Math.round((a.completedHours / a.plannedHours) * 100),
    }));

    res.json({
      overall: {
        plannedHours: Number(totalPlanned.toFixed(2)),
        completedHours: Number(totalCompleted.toFixed(2)),
        percentage:
          totalPlanned === 0
            ? 0
            : Math.round((totalCompleted / totalPlanned) * 100),
      },
      activityStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
