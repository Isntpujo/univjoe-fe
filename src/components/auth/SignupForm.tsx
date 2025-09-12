'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/lib/apis/auth/auth.hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAxiosError } from 'axios';

const registerSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		email: z.string().email('Invalid email'),
		password: z.string().min(6, 'Min 6 characters'),
		confirmPassword: z.string().min(6, 'Min 6 characters'),
	})
	.refine((v) => v.password === v.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	});

type FormValues = z.infer<typeof registerSchema>;

export default function SignUpPage() {
	const router = useRouter();
	const { mutate: registerUser, isPending } = useRegister();
	const [formError, setFormError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<FormValues>({
		resolver: zodResolver(registerSchema),
		mode: 'onChange',
		defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
	});

	function onSubmit(values: FormValues) {
		const { name, email, password } = values;
		setFormError(null);
		registerUser(
			{ name, email, password },
			{
				onSuccess: () => router.push('/profile'),
				onError: (err) => {
					if (isAxiosError(err)) {
						const msg = (err.response?.data as any)?.message ?? (err.response?.status ? `Error ${err.response.status}. Register failed.` : 'Register failed.');
						setFormError(msg);
					} else {
						setFormError('Register failed.');
					}
				},
			}
		);
	}

	return (
		<main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
			<form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12, width: 320 }}>
				<h1>Sign Up</h1>

				<input placeholder="Name" {...register('name')} />
				{errors.name && <small style={{ color: 'red' }}>{errors.name.message}</small>}

				<input placeholder="Email" type="email" {...register('email')} />
				{errors.email && <small style={{ color: 'red' }}>{errors.email.message}</small>}

				<input placeholder="Password" type="password" {...register('password')} />
				{errors.password && <small style={{ color: 'red' }}>{errors.password.message}</small>}

				<input placeholder="Confirm Password" type="password" {...register('confirmPassword')} />
				{errors.confirmPassword && <small style={{ color: 'red' }}>{errors.confirmPassword.message}</small>}

				{formError && <p style={{ color: 'red' }}>{formError}</p>}

				<button className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer disabled:opacity-60" type="submit" disabled={isPending || !isValid}>
					{isPending ? 'Creating...' : 'Create account'}
				</button>

				<Link href="/signin">Signin</Link>
			</form>
		</main>
	);
}
