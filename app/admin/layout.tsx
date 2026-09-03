"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

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

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-tint/50">
        <p className="text-sm font-medium text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-tint/30">
      <header className="flex items-center justify-between border-b border-black/5 bg-white px-5 py-4 sm:px-8">
        <p className="text-lg font-extrabold text-brand">
          HI-LOOK&apos;S <span className="font-normal text-foreground/70">ADMIN</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-foreground/60 sm:inline">
            {user.email}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-brand/30 px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
