import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const xsrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  console.log("xsrfToken", xsrfToken);

  if (xsrfToken) {
    config.headers["X-XSRF-TOKEN"] = xsrfToken;
  }
  return config;
});
