// src/lib/apis/auth/auth.api.ts
import { apiFetch } from '@/services/api';

/** ====== Types ====== */
export type User = {
	id: number;
	email: string;
	name: string;
	createdAt: string;
	updatedAt?: string;
};

export type LoginBody = {
	email: string;
	password: string;
	deviceInfo?: {
		deviceName: string;
		deviceType: string;
		deviceOs: string;
	};
};

export type RegisterBody = {
	name: string;
	email: string;
	password: string;
};

export type LoginResponse = { token: string; user: User };
export type RegisterResponse = { token: string; user: User };

/** ====== Auth APIs ====== */
export async function login(body: LoginBody) {
	// NOTE: pakai api (axios instance) langsung juga boleh;
	// di bawah ini tetap konsisten pakai apiFetch supaya selalu return .data
	return apiFetch<LoginResponse>('/api/v1/auth/login', {
		method: 'POST',
		data: body, // axios: pakai 'data' bukan 'body'
	});
}

export async function register(body: RegisterBody) {
	return apiFetch<RegisterResponse>('/api/v1/auth/register', {
		method: 'POST',
		data: body,
	});
}

export async function me() {
	// BE: pastikan /me baca req.user.id (sudah kita betulkan di BE)
	return apiFetch<User>('/api/v1/auth/me', {
		method: 'GET',
	});
}

export async function logout() {
	// ga perlu data; BE kamu return { ok: true }
	return apiFetch<{ ok: true }>('/api/v1/auth/logout', {
		method: 'POST',
	});
}

/** ====== Profile update ====== */
export async function updateMyName(name: string) {
	return apiFetch<User>('/api/v1/users/me', {
		method: 'PATCH',
		data: { name },
	});
}

/** ====== (Opsional) helper kalau butuh axios langsung ======
 * export const authApi = {
 *   login: (body: LoginBody) => api.post<LoginResponse>('/api/v1/auth/login', body).then(r => r.data),
 *   register: (body: RegisterBody) => api.post<RegisterResponse>('/api/v1/auth/register', body).then(r => r.data),
 *   me: () => api.get<User>('/api/v1/auth/me').then(r => r.data),
 *   logout: () => api.post<{ok:true}>('/api/v1/auth/logout').then(r => r.data),
 *   updateMyName: (name: string) => api.patch<User>('/api/v1/users/me', { name }).then(r => r.data),
 * };
 */
