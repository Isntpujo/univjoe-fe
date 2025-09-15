'use client';

import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function getCookieValue(name: string) {
	if (typeof document === 'undefined') return null;
	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [key, value] = cookie.trim().split('=');
		if (key === name) {
			return decodeURIComponent(value);
		}
	}
	return null;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	useEffect(() => {
		const token = getCookieValue('token');
		if (!token) {
			router.replace('/signin');
		} else {
			setIsCheckingAuth(false);
		}
	}, [router]);

	if (isCheckingAuth) return null;

	return (
		<>
			<main className="w-full h-dvh">{children}</main>
			<Toaster position="top-right" />
		</>
	);
}
