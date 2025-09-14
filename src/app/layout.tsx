import './globals.css';

import { Outfit } from 'next/font/google';
import Providers from '../providers/Providers';
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
	subsets: ['latin'],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={outfit.className}>
				<Providers>{children}</Providers>
				<Toaster position="top-right" />
			</body>
		</html>
	);
}
