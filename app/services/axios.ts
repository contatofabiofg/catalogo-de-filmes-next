import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVIDOR,
    timeout: 5000,
    
  });

  api.interceptors.request.use((config) => {
    const token = process.env.NEXT_PUBLIC_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

