'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { login, logout, me, register, updateMyName, type LoginBody, type RegisterBody, type User } from './auth.api';
import { useAuthStore } from './auth.store';
import type { AxiosError } from 'axios';

/* ===================== Error helpers (type-safe) ===================== */

type ServerFieldErrors = Record<string, string[] | undefined>;
export type ApiErrorShape = {
	status?: number;
	message?: string;
	errors?: ServerFieldErrors;
};

function isAxiosErrorLike<T = unknown>(e: unknown): e is AxiosError<T> {
	return typeof e === 'object' && e !== null && 'isAxiosError' in (e as Record<string, unknown>);
}

function toApiErrorShape(e: unknown): ApiErrorShape {
	if (isAxiosErrorLike(e)) {
		const data = e.response?.data as Partial<ApiErrorShape> | undefined;
		return {
			status: e.response?.status,
			message: data?.message ?? e.message,
			errors: data?.errors,
		};
	}
	if (e instanceof Error) return { message: e.message };
	return { message: 'Unknown error' };
}

/* ===================== Queries & Mutations ===================== */

export function useMe(enabled = true) {
	return useQuery<User, ApiErrorShape>({
		queryKey: ['me'],
		queryFn: me,
		enabled,
		staleTime: 60_000,
		retry: (failureCount, error) => (error.status === 401 ? false : failureCount < 2),
		select: (data) => data,
	});
}

export function useLogin() {
	const setToken = useAuthStore((s) => s.setToken);
	const setUser = useAuthStore((s) => s.setUser);

	return useMutation<
		{ token: string; user: User }, // TData
		ApiErrorShape, // TError
		LoginBody // TVariables
	>({
		mutationFn: (body) => login(body),
		onSuccess: (data) => {
			setToken(data.token);
			setUser(data.user);
		},
		onError: (e) => {
			toApiErrorShape(e); // optional: pakai buat toast/log; tidak menyisakan variable unused
		},
	});
}

export function useRegister() {
	const setToken = useAuthStore((s) => s.setToken);
	const setUser = useAuthStore((s) => s.setUser);

	return useMutation<{ token: string; user: User }, ApiErrorShape, RegisterBody>({
		mutationFn: (body) => register(body),
		onSuccess: (data) => {
			setToken(data.token);
			setUser(data.user);
		},
		onError: (e) => {
			toApiErrorShape(e);
		},
	});
}

export function useLogout() {
	const clear = useAuthStore((s) => s.clear);

	return useMutation<{ ok: true }, ApiErrorShape, void>({
		mutationFn: logout,
		onSuccess: () => clear(),
		onError: () => clear(),
	});
}

export function useUpdateName() {
	const qc = useQueryClient();

	return useMutation<User, ApiErrorShape, string>({
		mutationFn: (name) => updateMyName(name),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['me'] });
		},
		// onError optional; mapping field error dilakukan di komponen via setError
	});
}

/* (Optional) export helper kalau mau dipakai di komponen */
export { toApiErrorShape, isAxiosErrorLike };
