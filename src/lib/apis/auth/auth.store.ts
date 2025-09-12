'use client';
import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { User } from './auth.api';

type AuthState = {
	token: string | null;
	user: User | null;
	setToken: (t: string | null) => void;
	setUser: (u: User | null) => void;
	clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	token: typeof window !== 'undefined' ? Cookies.get('token') ?? null : null,
	user: null,

	setToken: (token) => {
		if (token) {
			Cookies.set('token', token, { expires: 7, path: '/' });
		} else {
			Cookies.remove('token', { path: '/' });
		}
		set({ token });
	},

	setUser: (user) => set({ user }),

	clear: () => {
		Cookies.remove('token', { path: '/' });
		set({ token: null, user: null });
	},
}));
