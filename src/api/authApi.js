import axios from "./axios";

export const authAPI = {
  login: (credentials) => axios.post("/auth/login", credentials),
  register: (data) => axios.post("/auth/register", data),
  getMe: () => axios.get("/auth/me"),
  logout: () => axios.post("/auth/logout"),
};
