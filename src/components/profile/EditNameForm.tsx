// src/components/profile/EditNameForm.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMe, useUpdateName, toApiErrorShape } from '@/lib/apis/auth/auth.hooks';
import toast from 'react-hot-toast';

const schema = z.object({
	name: z.string().trim().min(1, 'Required').max(25, 'Max 25 chars'),
});
type Form = z.infer<typeof schema>;

export default function EditNameForm({ onSuccess }: { onSuccess?: () => void }) {
	const { data: me } = useMe(true);
	const m = useUpdateName();
	const [justSaved, setJustSaved] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		setError,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm<Form>({ resolver: zodResolver(schema), mode: 'onChange', defaultValues: { name: '' } });

	useEffect(() => {
		if (me?.name != null) {
			reset({ name: me.name });
			setJustSaved(false);
		}
	}, [me?.name, reset]);

	const nameVal = watch('name');
	const normalizedName = useMemo(() => nameVal?.trim() ?? '', [nameVal]);

	const unchanged = (me?.name ?? '') === normalizedName;
	const saving = isSubmitting || m.isPending;
	const canSubmit = isValid && !unchanged && !saving;

	const onSubmit = async (v: Form) => {
		setJustSaved(false);
		try {
			await m.mutateAsync(v.name.trim());
			toast.success('Name update successfully');
			setJustSaved(true);
			reset({ name: v.name.trim() }, { keepDirty: false });
			onSuccess?.(); // ⬅️ tutup modal kalau dikirim dari modal
		} catch (e) {
			const err = toApiErrorShape(e);
			const fieldError = err.errors?.name?.[0];
			if (fieldError) setError('name', { type: 'server', message: fieldError });
			if (!fieldError && err.message) setError('name', { type: 'server', message: err.message });
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-sm">
			<label htmlFor="name" className="block text-sm font-medium">
				Name
			</label>
			<input
				id="name"
				{...register('name')}
				className="w-full rounded-lg border px-3 py-2"
				placeholder="Your name"
				autoComplete="off"
				aria-invalid={Boolean(errors.name) || undefined}
				aria-describedby={errors.name ? 'name-error' : undefined}
			/>
			{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

			<div className="flex items-center gap-2">
				<button type="submit" disabled={!canSubmit} className={`rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 ${canSubmit ? 'cursor-pointer' : 'cursor-not-allowed'}`} aria-busy={saving || undefined}>
					{saving ? 'Saving…' : 'Save'}
				</button>

				{justSaved && <span className="text-xs text-green-600">Saved ✔</span>}
			</div>
		</form>
	);
}
