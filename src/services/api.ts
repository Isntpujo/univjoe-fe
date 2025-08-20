"use client";
import axios from "axios";
import { useAuthStore } from "@/lib/apis/auth/auth.store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// auto inject Bearer token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // token invalid/expired → kosongkan
      useAuthStore.getState().clear();
      // biar komponen tahu ini error, terusin reject
    }
    return Promise.reject(error);
  }
);
