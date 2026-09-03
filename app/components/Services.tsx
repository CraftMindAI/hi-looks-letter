const SERVICES = [
  {
    title: "LED Video Wall",
    icon: (
      <path d="M3 5h18v11H3z M3 20h18 M8 16v4 M16 16v4" />
    ),
  },
  {
    title: "LED Signs",
    icon: <path d="M9 18h6 M10 22h4 M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />,
  },
  {
    title: "NEON Signs",
    icon: (
      <path d="M7 3h10l-3 6h3l-7 12v-8H7l3-6H7z" />
    ),
  },
  {
    title: "ACP Cladding Works",
    icon: (
      <path d="M4 21V8l8-5 8 5v13 M4 21h16 M9 21v-6h6v6" />
    ),
  },
  {
    title: "Metal Signs",
    icon: (
      <path d="M12 2 3 6l9 4 9-4-9-4Z M3 6v12l9 4 9-4V6 M12 10v12" />
    ),
  },
  {
    title: "Indoor & Outdoor Decorative Signage",
    icon: (
      <path d="M4 4h16v16H4z M4 9h16 M9 9v11" />
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand">
            Our Service
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Comprehensive Signboard Solutions
          </h3>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Our services cover a diverse spectrum of signboard solutions,
            from cutting-edge LED technology to traditional NEON signs and
            decorative options &mdash; ensuring excellence, innovation, and
            affordability that leave a lasting impression.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-black/5 p-6 transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {service.icon}
                </svg>
              </div>
              <h4 className="mt-4 text-lg font-semibold text-foreground">
                {service.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
