import { useEffect, useState } from "react";
import { getMonthlyDashboard, getYearHeatmap } from "../services/api";
import Heatmap from "../components/Heatmap";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function Dashboard() {
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(2026);
  const [summary, setSummary] = useState(null);
  const [heatmap, setHeatmap] = useState([]);

  useEffect(() => {
    getMonthlyDashboard(month, year).then((res) => setSummary(res.data));
    getYearHeatmap(year).then((res) => setHeatmap(res.data));
  }, [month, year]);

  if (!summary) return <h2 style={{ padding: 40 }}>Loading...</h2>;

  const monthName = MONTHS.find((m) => m.value === month).label;

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">{monthName} Dashboard</h1>

        {/* MONTH + YEAR SELECT */}
        <div style={{ display: "flex", gap: "12px" }}>
          <select
            className="month-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            className="year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* OVERALL CARD */}
      <div className="overall-card overall-flex">
        <div>
          <h2>Overall Performance</h2>
          <h5>Planned: {summary.overall.plannedHours} hours</h5>
          <h5>Completed: {summary.overall.completedHours} hours</h5>
        </div>

        <div
          className="progress-ring"
          style={{ "--progress": `${summary.overall.percentage}%` }}
        >
          <div className="progress-inner">
            <span>{summary.overall.percentage}%</span>
            <small>This Month</small>
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <h2 className="section-title">Activity-wise Performance</h2>

      <div className="task-grid">
        {summary.activityStats
          .filter((a) => a.activityName !== "Content Creation")
          .map((a) => (
            <div key={a.activityId} className="task-card activity-flex">
              {/* LEFT CONTENT */}
              <div>
                <h3>{a.activityName}</h3>
                <p>
                  {a.completedHours} / {a.plannedHours} hrs
                </p>
              </div>

              {/* RIGHT – SMALL PROGRESS RING */}
              <div
                className="progress-ring small-ring"
                style={{ "--progress": `${a.percentage}%` }}
              >
                <div className="progress-inner small-inner">
                  <span>{a.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* HEATMAP */}
      <div className="heatmap-box">
        <h2 className="section-title">Yearly Activity Heatmap</h2>
        <Heatmap data={heatmap} year={year} />
      </div>
    </div>
  );
}

export default Dashboard;
