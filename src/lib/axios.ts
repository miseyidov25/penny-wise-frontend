import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const xsrfToken = Cookies.get("XSRF-TOKEN");
  console.log("xsrfToken", xsrfToken);
  if (xsrfToken) {
    config.headers["X-XSRF-TOKEN"] = xsrfToken;
  }
  return config;
});
