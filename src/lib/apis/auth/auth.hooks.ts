"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginInput } from "./auth.api";
import { useAuthStore } from "./auth.store";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  return useMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
    onSuccess: (res) => setToken(res.data.token),
  });
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me().then((r) => r.data),
    enabled,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const clear = useAuthStore((s) => s.clear);
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clear();
      qc.clear();
    },
  });
}
