'use client';
import { ReactNode, useEffect } from 'react';

export default function Modal({ open, onClose, title = 'Edit Profile', children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
	// ESC untuk close
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[1000] flex items-center justify-center" aria-modal="true" role="dialog" aria-labelledby="modal-title">
			{/* overlay */}
			<button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
			{/* panel */}
			<div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
				<header className="mb-4 flex items-center justify-between">
					<h3 id="modal-title" className="text-base font-semibold">
						{title}
					</h3>
					<button onClick={onClose} className="rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer" aria-label="Close">
						✕
					</button>
				</header>
				<div>{children}</div>
			</div>
		</div>
	);
}
