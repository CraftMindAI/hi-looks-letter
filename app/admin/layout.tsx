"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const NAV_ITEMS = [
  { href: "/admin/projects", label: "Projects", icon: "M4 4h16v16H4z M4 9h16 M9 9v11" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && !isLoginPage) {
        router.replace("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [isLoginPage, router]);

  useEffect(() => {
    if (pathname === "/admin") {
      router.replace("/admin/projects");
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user || pathname === "/admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-tint/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
          <p className="text-sm font-medium text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  const initial = (user.email ?? "A").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-brand-tint/20">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-black/5 bg-white sm:flex">
        <div className="border-b border-black/5 px-5 py-5">
          <p className="text-lg font-extrabold leading-tight text-brand">
            HI-LOOK&apos;S
          </p>
          <p className="text-xs font-medium tracking-widest text-foreground/50">
            ADMIN PANEL
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand text-white"
                    : "text-foreground/70 hover:bg-brand-tint hover:text-brand"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0"
                >
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-black/5 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-brand-tint hover:text-brand"
          >
            &larr; Back to website
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-5 py-3.5 sm:px-8">
          <p className="text-base font-extrabold text-brand sm:hidden">
            HI-LOOK&apos;S <span className="font-normal text-foreground/70">ADMIN</span>
          </p>
          <div className="hidden text-sm font-medium text-foreground/50 sm:block">
            Projects
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand">
                {initial}
              </div>
              <span className="hidden text-sm text-foreground/60 sm:inline">
                {user.email}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-brand/30 px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
