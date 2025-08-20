import { api } from "@/services/api";

export type LoginInput = {
  email: string;
  password: string;
  deviceInfo: { deviceName: string; deviceType: string; deviceOs: string };
};

export const authApi = {
  login: (payload: LoginInput) => api.post("/api/v1/auth/login", payload),
  me: () => api.get("/api/v1/auth/me"),
  logout: () => api.post("/api/v1/auth/logout", {}),
};
