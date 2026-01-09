const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const path = require("path");

// Serve static frontend (simple fallback UI)
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

// Routes
const activityRoutes = require("./routes/activityRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const todayRoutes = require("./routes/todayRoutes");

app.use("/activities", activityRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/today", todayRoutes);

// Log routes
const logRoutes = require("./routes/logRoutes");
app.use("/logs", logRoutes);

// Dashboard routes
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/dashboard", dashboardRoutes);

// Heatmap routes
const heatmapRoutes = require("./routes/heatmapRoutes");
app.use("/heatmap", heatmapRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
