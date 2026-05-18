import axios from "./axios";

export const faqAPI = {
  // Public
  getAll: (category) => axios.get("/faqs", { params: category ? { category } : {} }),
  getOne: (id) => axios.get(`/faqs/${id}`),

  // Admin
  getAllAdmin: () => axios.get("/faqs/admin"),
  create: (data) => axios.post("/faqs", data),
  update: (id, data) => axios.put(`/faqs/${id}`, data),
  delete: (id) => axios.delete(`/faqs/${id}`),
};
