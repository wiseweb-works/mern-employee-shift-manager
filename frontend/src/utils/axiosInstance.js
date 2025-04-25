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
        toast.error("Serverfehler. Bitte versuchen Sie es später erneut.");
      }
    } else if (error.code === "ECONNABORTED") {
      toast.error(
        "Zeitüberschreitung der Anfrage. Bitte versuchen Sie es erneut."
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
