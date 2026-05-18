import axios from "./axios";

export const contentAPI = {
  // Public: returns map { section: data, ... }
  getAll: () => axios.get("/content"),
  // Admin: returns array of full documents
  getAllAdmin: () => axios.get("/content/admin"),
  getOne: (section) => axios.get(`/content/${section}`),
  upsert: (section, payload) => axios.put(`/content/${section}`, payload),
  delete: (section) => axios.delete(`/content/${section}`),
};
