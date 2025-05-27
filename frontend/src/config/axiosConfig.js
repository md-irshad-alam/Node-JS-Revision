// src/utils/api.js
import axios from "axios";
// baseURL: "https://node-js-revision.onrender.com/api",
const apiClient = axios.create({
  baseURL: "https://node-js-revision.onrender.com/api", // change to your API base
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token from sessionStorage on each request
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
