'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/apis/auth/auth.store';
import { useLogout, useMe } from '@/lib/apis/auth/auth.hooks';
import EditNameForm from '@/components/profile/EditNameForm';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';

export default function ProfilePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  const { data: me, isLoading, error } = useMe(Boolean(token));
  const { mutate: logout, isPending: loggingOut } = useLogout();

  const [open, setOpen] = useState(false);

  // useEffect(() => {
  // 	if (!token) router.replace('/signin');
  // }, [token, router]);

  if (!token) return null;
  if (isLoading) return <div className='p-6'>Loading…</div>;

  if (error) {
    return (
      <div className='p-6 space-y-4'>
        <p className='text-red-600'>Session expired / unauthorized.</p>
        <button
          className='rounded bg-black px-3 py-2 text-white'
          onClick={() =>
            logout(undefined, { onSuccess: () => router.replace('/signin') })
          }
          disabled={loggingOut}
        >
          {loggingOut ? 'Signing out…' : 'Go to Sign in'}
        </button>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      <header>
        <h1 className='text-xl font-semibold'>Profile</h1>
        <p className='text-sm text-gray-500'>Manage your account details.</p>
      </header>

      <section>
        <h2 className='mb-2 text-sm font-medium text-gray-700'>
          Current Profile JSON
        </h2>
        <pre className='text-xs bg-gray-50 p-3 rounded border'>
          {JSON.stringify(me, null, 2)}
        </pre>
      </section>

      {/* Tombol tunggal */}
      <section className='flex items-center gap-3'>
        <Button variant='secondary' onClick={() => setOpen(true)}>
          Edit Profile
        </Button>

        <Button
          variant='outline'
          onClick={() =>
            logout(undefined, { onSuccess: () => router.replace('/signin') })
          }
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out…' : 'Logout'}
        </Button>
      </section>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title='Edit Profile'>
        {/* saat submit sukses, modal ditutup */}
        <EditNameForm />
      </Modal>
    </div>
  );
}
