import axios from "axios";
import { BASE_URL } from "./apiPath";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        toast.error("Server Error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
