async function fetchToday() {
  const res = await fetch("/today");
  if (!res.ok) throw new Error("Failed to load /today");
  return res.json();
}

function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  });
  children.flat().forEach((c) => {
    e.append(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

let todayData = null;
let entries = {};

function renderTasks() {
  const container = document.getElementById("tasks");
  container.innerHTML = "";
  document.getElementById(
    "today-meta"
  ).textContent = `${todayData.day}, ${todayData.date}`;

  todayData.tasks.forEach((t) => {
    const card = el("div", { class: "task-card" });
    card.append(el("h3", {}, t.activityName));
    card.append(el("div", { class: "meta" }, t.category));
    if (t.metadata && t.metadata[todayData.day]) {
      card.append(
        el("div", { class: "meta" }, `Note: ${t.metadata[todayData.day]}`)
      );
    }
    card.append(
      el("div", { class: "meta" }, `Planned: ${t.plannedDuration || "—"} hrs`)
    );

    const checkbox = el("input", { type: "checkbox" });
    checkbox.addEventListener("change", (e) => {
      entries[t.activityId] = entries[t.activityId] || {};
      entries[t.activityId].completed = e.target.checked;
    });

    const hours = el("input", {
      type: "number",
      step: "0.25",
      placeholder: "Actual hours",
    });
    hours.addEventListener("input", (e) => {
      entries[t.activityId] = entries[t.activityId] || {};
      entries[t.activityId].actualDuration = e.target.value;
    });

    const row = el("div", { class: "input-row" }, checkbox, hours);
    card.append(row);
    container.append(card);
  });
}

async function handleSave() {
  if (!todayData) return;
  document.getElementById("status").textContent = "Saving...";

  try {
    for (const task of todayData.tasks) {
      const entry = entries[task.activityId];
      if (!entry) continue;
      const payload = {
        date: todayData.date,
        activityId: task.activityId,
        plannedDuration: task.plannedDuration,
        actualDuration: Number(entry.actualDuration) || 0,
        completed: !!entry.completed,
      };
      await fetch("/logs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    document.getElementById("status").textContent = "Saved ✔️";
    setTimeout(
      () => (document.getElementById("status").textContent = ""),
      2000
    );
  } catch (err) {
    console.error(err);
    document.getElementById("status").textContent = "Save failed";
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    todayData = await fetchToday();
    renderTasks();
    document.getElementById("saveBtn").addEventListener("click", handleSave);
  } catch (err) {
    console.error(err);
    document.getElementById("today-meta").textContent = "Failed to load data";
  }
});
