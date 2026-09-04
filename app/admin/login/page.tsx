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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address.";
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return null;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password) : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setTouched({ email: true, password: true });

    if (validateEmail(email) || validatePassword(password)) return;

    setSubmitting(true);
    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin/projects");
    } catch (err) {
      setError(friendlyError(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-tint/40 px-5 py-10">
      <div className="grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand to-brand-dark p-8 text-white md:flex">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-black/10"
          />

          <div className="relative">
            <p className="text-2xl font-extrabold leading-tight">HI-LOOK&apos;S</p>
            <p className="text-sm font-medium tracking-widest text-white/70">LETTERS</p>
          </div>

          <div className="relative">
            <h2 className="text-xl font-bold leading-snug">
              Manage your site&apos;s content with ease.
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Sign in to update your Our Projects gallery and keep your
              homepage fresh.
            </p>
          </div>

          <p className="relative text-xs text-white/50">
            Professional Sign Makers &middot; Since 1987
          </p>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-foreground">Admin Login</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Sign in to access the admin panel.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground/80"
              >
                Email
              </label>
              <div
                className={`mt-1 flex items-center gap-2.5 rounded-lg border px-3 transition-colors focus-within:border-brand ${
                  emailError ? "border-red-400" : "border-black/10"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-4 w-4 shrink-0 text-foreground/40"
                >
                  <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z M3.5 6.5 12 13l8.5-6.5" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!emailError}
                  autoComplete="username"
                  className="w-full border-0 bg-transparent py-2.5 text-sm leading-none outline-none placeholder:text-foreground/40"
                  placeholder="you@example.com"
                />
              </div>
              {emailError && (
                <p className="mt-1 text-xs font-medium text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground/80"
              >
                Password
              </label>
              <div
                className={`mt-1 flex items-center gap-2.5 rounded-lg border px-3 transition-colors focus-within:border-brand ${
                  passwordError ? "border-red-400" : "border-black/10"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-4 w-4 shrink-0 text-foreground/40"
                >
                  <path d="M6 11V8a6 6 0 1 1 12 0v3 M5 11h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9Z" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  aria-invalid={!!passwordError}
                  autoComplete="current-password"
                  className="w-full border-0 bg-transparent py-2.5 text-sm leading-none outline-none placeholder:text-foreground/40"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="shrink-0 text-foreground/40 hover:text-brand"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                      <path d="M3 3l18 18 M10.6 10.6a2 2 0 0 0 2.8 2.8 M9.4 5.5A9.6 9.6 0 0 1 12 5c5 0 9 4 10 7a10.6 10.6 0 0 1-2.1 3.2 M6.2 6.6A10.6 10.6 0 0 0 2 12c1 3 5 7 10 7 1.1 0 2.1-.2 3-.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                      <path d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7s-9-4-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs font-medium text-red-600">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-black/20 text-brand focus:ring-brand"
              />
              <label htmlFor="remember" className="text-sm text-foreground/70">
                Remember me on this device
              </label>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-70"
            >
              {submitting && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
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
    </div>
  );
}
