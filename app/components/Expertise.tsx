const EXPERTISE = [
  {
    title: "Timeless Appearance",
    desc: "Designs that stay sharp and relevant for years to come.",
    icon: <path d="M12 2 2 7l10 5 10-5-10-5Z M2 17l10 5 10-5 M2 12l10 5 10-5" />,
  },
  {
    title: "Richer Colors & Vivid Visuals",
    desc: "Vibrant materials and finishes that command attention.",
    icon: <path d="M12 3a9 9 0 1 0 9 9c0-1-1-2-2-2h-2a3 3 0 0 1-3-3V6c0-1.5-1-3-2-3Z M7 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M10 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />,
  },
  {
    title: "Lasting Resilience",
    desc: "Built to withstand weather and wear, indoors and out.",
    icon: <path d="M12 2 4 5v6c0 5 4 9 8 11 4-2 8-6 8-11V5l-8-3Z" />,
  },
  {
    title: "Prompt Delivery",
    desc: "On-time execution without compromising on quality.",
    icon: <path d="M12 8v4l3 3 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />,
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="bg-brand-tint/50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand">
            Our Expertise
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Why We&apos;re the Industry Leaders
          </h3>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERTISE.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7"
                >
                  {item.icon}
                </svg>
              </div>
              <h4 className="mt-4 text-base font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
