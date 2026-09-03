"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebase";

function friendlyError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return `Something went wrong (${error.code}). Please try again.`;
    }
  }
  return "Something went wrong. Please try again.";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setSubmitting(true);
    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-tint/50 px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-extrabold text-brand">
          Admin Login
        </h1>
        <p className="mt-1 text-center text-sm text-foreground/60">
          Hi-Look&apos;s Letters
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground/80"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground/80"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-black/20 text-brand focus:ring-brand"
            />
            <label
              htmlFor="remember"
              className="text-sm text-foreground/70"
            >
              Remember me on this device
            </label>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-sm text-foreground/60 hover:text-brand"
        >
          &larr; Back to website
        </a>
      </div>
    </div>
  );
}
