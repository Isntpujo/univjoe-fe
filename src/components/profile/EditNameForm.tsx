// src/components/profile/EditNameForm.tsx
'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMe, useUpdateName, toApiErrorShape } from '@/lib/apis/auth/auth.hooks';

const schema = z.object({
	name: z.string().trim().min(1, 'Required').max(100, 'Max 100 chars'),
});
type Form = z.infer<typeof schema>;

export default function EditNameForm() {
	const { data: me } = useMe(true);
	const m = useUpdateName();

	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { name: '' } });

	useEffect(() => {
		if (me?.name) reset({ name: me.name });
	}, [me, reset]);

	const onSubmit = async (v: Form) => {
		try {
			await m.mutateAsync(v.name);
			// invalidateQueries(['me']) sudah di hook
		} catch (e) {
			// ← defaultnya `unknown`, aman untuk ESLint
			const err = toApiErrorShape(e); // { status?, message?, errors? }
			const fieldError = err.errors?.name?.[0];
			if (fieldError) {
				setError('name', { type: 'server', message: fieldError });
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-sm">
			<label className="block text-sm font-medium">Name</label>
			<input {...register('name')} className="w-full rounded-lg border px-3 py-2" placeholder="Your name" />
			{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

			<button disabled={isSubmitting || m.isPending} className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50">
				{isSubmitting || m.isPending ? 'Saving…' : 'Save'}
			</button>
		</form>
	);
}
