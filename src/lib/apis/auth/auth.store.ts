"use client";
import { create } from "zustand";
import Cookies from "js-cookie";

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? Cookies.get("token") ?? null : null,
  setToken: (token) => {
    if (token) Cookies.set("token", token, { expires: 7 });
    else Cookies.remove("token");
    set({ token });
  },
  clear: () => {
    Cookies.remove("token");
    set({ token: null });
  },
}));
