import axios from "./axios";

export const productAPI = {
  getAll: (category) =>
    axios.get("/products", { params: category ? { category } : {} }),
  getAllAdmin: (category) =>
    axios.get("/products/admin", { params: category ? { category } : {} }),
  getOne: (id) => axios.get(`/products/${id}`),
  create: (data) => axios.post("/products", data),
  update: (id, data) => axios.put(`/products/${id}`, data),
  delete: (id) => axios.delete(`/products/${id}`),
};
