import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Welcome to the Hi-Look&apos;s Letters admin panel.
      </p>

      <Link
        href="/admin/projects"
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-black/5 bg-white p-5 text-sm font-semibold text-brand shadow-sm transition-shadow hover:shadow-md"
      >
        Manage Our Projects Gallery &rarr;
      </Link>
    </div>
  );
}
