import axios from "./axios";

export const dashboardAPI = {
  getStats: () => axios.get("/dashboard/stats"),
};
