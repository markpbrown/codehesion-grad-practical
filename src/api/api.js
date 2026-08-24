import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const publicApi = axios.create({
  baseURL: API_URL,
});

export const privateApi = axios.create({
  baseURL: API_URL,
});

privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);