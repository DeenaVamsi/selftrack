const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   MONGODB
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* =======================
   API ROUTES
======================= */
app.use("/activities", require("./routes/activityRoutes"));
app.use("/schedules", require("./routes/scheduleRoutes"));
app.use("/today", require("./routes/todayRoutes"));
app.use("/logs", require("./routes/logRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));
app.use("/heatmap", require("./routes/heatmapRoutes"));

/* =======================
   SERVE FRONTEND
======================= */

// ONLY in production (Render)
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/build");

  app.use(express.static(clientBuildPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
