'use client';

import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { useAuthStore } from '@/lib/apis/auth/auth.store';

// Instance internal (tidak diexport)
const client = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true, // ok diset ON meski pakai Bearer
});

// Request interceptor — inject Bearer token
client.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		const headers: AxiosRequestHeaders = (config.headers ?? {}) as AxiosRequestHeaders;
		headers.Authorization = `Bearer ${token}`;
		config.headers = headers;
	}
	return config;
});

// Response interceptor — auto-clear store saat 401
client.interceptors.response.use(
	(res) => res,
	(error) => {
		const status = error?.response?.status;
		if (status === 401) {
			const store = useAuthStore.getState();
			if (typeof store.clear === 'function') store.clear(); // pastikan ada clear() di store
		}
		return Promise.reject(error);
	}
);

// Helper fetch-like: selalu return .data
export async function apiFetch<T = unknown>(path: string, init?: AxiosRequestConfig): Promise<T> {
	const res = await client.request<T>({ url: path, ...(init || {}) });
	return res.data as T;
}
