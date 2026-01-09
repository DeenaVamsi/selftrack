import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function Heatmap({ data, year }) {
  const values = data.map((d) => ({
    date: d.date,
    count: d.count,
  }));

  return (
    <div className="heatmap-wrapper">
      <CalendarHeatmap
        startDate={new Date(`${year}-01-01`)}
        endDate={new Date(`${year}-12-31`)}
        values={values}
        gutterSize={4}
        showWeekdayLabels={false}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count <= 2) return "color-scale-1";
          if (value.count <= 4) return "color-scale-2";
          return "color-scale-3";
        }}
        tooltipDataAttrs={(value) =>
          value
            ? { "data-tip": `${value.date}: ${value.count} activities` }
            : null
        }
      />

      {/* COLOR LEGEND */}
      <div className="heatmap-legend">
        <span>Less</span>

        <div className="legend-item">
          <span className="legend-box color-empty"></span>
          <small>0</small>
        </div>

        <div className="legend-item">
          <span className="legend-box color-scale-1"></span>
          <small>1–2</small>
        </div>

        <div className="legend-item">
          <span className="legend-box color-scale-2"></span>
          <small>3–4</small>
        </div>

        <div className="legend-item">
          <span className="legend-box color-scale-3"></span>
          <small>5+</small>
        </div>

        <span>More</span>
      </div>
    </div>
  );
}

export default Heatmap;
