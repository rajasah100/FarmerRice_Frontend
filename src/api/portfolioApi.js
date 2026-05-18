import axios from "./axios";

export const portfolioAPI = {
  getAll: (params) => axios.get("/portfolios", { params }),
  getAllAdmin: () => axios.get("/portfolios/admin"),
  getOne: (id) => axios.get(`/portfolios/${id}`),
  create: (data) => axios.post("/portfolios", data),
  update: (id, data) => axios.put(`/portfolios/${id}`, data),
  delete: (id) => axios.delete(`/portfolios/${id}`),
};
