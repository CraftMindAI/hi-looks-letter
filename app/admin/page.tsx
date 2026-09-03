"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Project = { _id: string; name: string; images: string[] };

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]));
  }, []);

  const totalProjects = projects?.length ?? null;
  const totalImages = projects?.reduce((sum, p) => sum + p.images.length, 0) ?? null;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Welcome back! Here&apos;s a quick overview of your site content.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
            Projects Featured
          </p>
          <p className="mt-2 text-3xl font-extrabold text-brand">
            {totalProjects === null ? "—" : totalProjects}
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
            Photos Uploaded
          </p>
          <p className="mt-2 text-3xl font-extrabold text-brand">
            {totalImages === null ? "—" : totalImages}
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="group flex flex-col justify-between rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white transition-shadow hover:shadow-lg"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
            Quick Action
          </p>
          <p className="mt-2 flex items-center gap-2 text-lg font-extrabold">
            Manage Projects Gallery
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </p>
        </Link>
      </div>
    </div>
  );
}
