import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("farmer_rice_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("farmer_rice_token");
      localStorage.removeItem("farmer_rice_user");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
