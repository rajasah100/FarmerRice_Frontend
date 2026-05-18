import axios from "./axios";

export const leaderAPI = {
  getAll: () => axios.get("/leaders"),
  getAllAdmin: () => axios.get("/leaders/admin"),
  getOne: (id) => axios.get(`/leaders/${id}`),
  create: (data) => axios.post("/leaders", data),
  update: (id, data) => axios.put(`/leaders/${id}`, data),
  delete: (id) => axios.delete(`/leaders/${id}`),
};
