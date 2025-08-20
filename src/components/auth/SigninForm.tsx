"use client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/lib/apis/auth/auth.hooks";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

type FormValues = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "john@gmail.com", password: "password" }, // seed
  });

  const { mutate: login, isPending, error } = useLogin();

  const deviceInfo = useMemo(
    () => ({
      deviceName: navigator.platform || "Unknown",
      deviceType: /Mobi|Android/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop",
      deviceOs: navigator.userAgent,
    }),
    []
  );

  function onSubmit(values: FormValues) {
    login(
      { ...values, deviceInfo },
      { onSuccess: () => router.push("/profile") }
    );
  }

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gap: 12, width: 320 }}
      >
        <h1>Sign In</h1>
        <input placeholder="Email" {...register("email")} />
        {errors.email && (
          <small style={{ color: "red" }}>{errors.email.message}</small>
        )}
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <small style={{ color: "red" }}>{errors.password.message}</small>
        )}
        <button className="bg-blue-600 hover:bg-blue-300 text-white cursor-pointer" type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>Login gagal</p>}
      </form>
    </main>
  );
}
