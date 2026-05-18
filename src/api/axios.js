import axios from "axios";

const API_URL = "https://farmerrice-backend-1.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ONLY if using cookies
});

// Attach token (localStorage JWT method)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("farmer_rice_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auto logout on 401
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("farmer_rice_token");
      localStorage.removeItem("farmer_rice_user");

      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;