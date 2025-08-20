"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/apis/auth/auth.store";
import { useLogout, useMe } from "@/lib/apis/auth/auth.hooks";

export default function ProfilePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { data, isLoading, error } = useMe(!!token);
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    if (!token) router.push("/signin");
  }, [token, router]);

  if (!token) return null;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error. Silakan login ulang.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button
        className="bg-red-600 hover:bg-red-300 text-white cursor-pointer"
        onClick={() =>
          logout(undefined, { onSuccess: () => router.replace("/signin") })
        }
        disabled={isPending}
      >
        {isPending ? "..." : "Logout"}
      </button>
    </div>
  );
}
