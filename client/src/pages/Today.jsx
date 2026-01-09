import { useEffect, useState } from "react";
import { getTodayTasks, saveDailyLog } from "../services/api";

function Today() {
  const [data, setData] = useState(null);
  const [entries, setEntries] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load today's tasks
  useEffect(() => {
    getTodayTasks()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle checkbox & hours
  const handleChange = (activityId, field, value) => {
    setEntries((prev) => {
      const prevEntry = prev[activityId] || {
        completed: false,
        actualDuration: 0,
      };

      return {
        ...prev,
        [activityId]: {
          ...prevEntry,
          [field]: value,
          // auto-complete if hours > 0
          completed:
            field === "actualDuration"
              ? Number(value) > 0
              : field === "completed"
              ? value
              : prevEntry.completed,
        },
      };
    });
  };

  // Save today's log
  const handleSubmit = async () => {
    if (!data || saved) return;

    try {
      for (let task of data.tasks) {
        const entry = entries[task.activityId];
        if (!entry) continue;

        await saveDailyLog({
          date: data.date,
          activityId: task.activityId,
          plannedDuration: task.plannedDuration,
          actualDuration: Number(entry.actualDuration) || 0,
          completed: entry.completed,
        });
      }

      setSaved(true);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (!data) {
    return <h2 style={{ padding: 40 }}>Loading your day...</h2>;
  }

  // Progress calculation
  let totalPlannedTime = 0;
  let totalCompletedTime = 0;

  data.tasks.forEach((task) => {
    const planned = task.plannedDuration || 0;
    totalPlannedTime += planned;

    const entry = entries[task.activityId];
    if (entry && entry.completed) {
      const actual = Number(entry.actualDuration) || 0;
      totalCompletedTime += Math.min(actual, planned);
    }
  });

  const progressPercent =
    totalPlannedTime === 0
      ? 0
      : Math.round((totalCompletedTime / totalPlannedTime) * 100);

  return (
    <div className="app-wrapper">
      {/* HERO */}
      <div className="hero hero-flex">
        <div className="hero-left">
          <h1>Have a Nice Day Deena ☀️</h1>
          <h3>
            {data.day}, {data.date}
          </h3>
        </div>

        <div className="hero-right">
          <div
            className="progress-ring large-ring"
            style={{ "--progress": `${progressPercent}%` }}
          >
            <div className="progress-inner large-inner">
              <span>{progressPercent}%</span>
              <small>Today</small>
            </div>
          </div>

          <p className="time-text">
            ⏱ {totalCompletedTime.toFixed(2)} / {totalPlannedTime.toFixed(2)}{" "}
            hrs
          </p>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="task-grid">
        {data.tasks.map((task) => {
          const entry = entries[task.activityId] || {};

          return (
            <div className="task-card" key={task.activityId}>
              <h3>{task.activityName}</h3>
              <div className="category">{task.category}</div>

              {task.metadata?.[data.day] && (
                <div className="meta">🏋️ {task.metadata[data.day]}</div>
              )}

              <div className="meta">
                Planned: {task.plannedDuration || "—"} hrs
              </div>

              <div className="input-row">
                <input
                  type="checkbox"
                  disabled={saved}
                  checked={entry.completed || false}
                  onChange={(e) =>
                    handleChange(task.activityId, "completed", e.target.checked)
                  }
                />

                <input
                  type="number"
                  step="0.25"
                  disabled={saved}
                  value={entry.actualDuration || ""}
                  placeholder="Actual hours"
                  onChange={(e) =>
                    handleChange(
                      task.activityId,
                      "actualDuration",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* SAVE BUTTON */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          className="save-btn"
          onClick={handleSubmit}
          disabled={saved}
          style={{ opacity: saved ? 0.6 : 1 }}
        >
          {saved ? "SAVED FOR TODAY ✅" : "SAVE TODAY"}
        </button>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>🔥 Hustle Saved!</h2>
            <p>Hustle saved for this day 💪</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Today;
