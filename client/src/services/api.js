import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// get today's tasks
export const getTodayTasks = () => API.get("/today");

// save daily log

export const saveDailyLog = (data) => API.post("/logs", data);

// get monthly dashboard data
export const getMonthlyDashboard = (month, year) =>
  API.get(`/dashboard/monthly?month=${month}&year=${year}`);

// get yearly heatmap data
export const getYearHeatmap = (year) => API.get(`/heatmap?year=${year}`);
