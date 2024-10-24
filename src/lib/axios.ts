import axios from "axios";
import { getCookie, getCookies } from "cookies-next";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

axiosInstance.interceptors.request.use((config) => {
  console.log("All cookies:", getCookies());
  console.log("XSRF-TOKEN cookie:", getCookie("XSRF-TOKEN"));

  return config;
});
