import axios from "./axios";

export const contactAPI = {
  submit: (data) => axios.post("/contacts", data),
  getAll: (status) => axios.get("/contacts", { params: status ? { status } : {} }),
  getOne: (id) => axios.get(`/contacts/${id}`),
  update: (id, data) => axios.put(`/contacts/${id}`, data),
  delete: (id) => axios.delete(`/contacts/${id}`),
};
