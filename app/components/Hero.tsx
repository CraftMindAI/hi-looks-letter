export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-full w-[60%] opacity-20"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 30% 40%, transparent 0, transparent 10px, var(--brand-light) 11px)",
          maskImage: "linear-gradient(to left, black, transparent)",
        }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-20 sm:px-8 sm:py-28">
        <span className="rounded-full bg-brand-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand">
          Professional Sign Makers &middot; Since 1987
        </span>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Signage That Makes Your Business{" "}
          <span className="text-brand">Impossible to Miss</span>
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
          35+ years crafting LED signs, NEON signs, ACP cladding, metal signs
          and decorative signage &mdash; trusted by 2500+ businesses across
          Chennai and beyond.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href="#contact"
            className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark"
          >
            Get a Free Quote
          </a>
          <a
            href="#services"
            className="rounded-full border border-brand/30 px-7 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
          >
            Explore Services
          </a>
        </div>

        <div className="mt-10 grid w-full grid-cols-2 gap-6 border-t border-black/5 pt-8 sm:grid-cols-4">
          {[
            ["35+", "Years Experience"],
            ["2500+", "Projects Delivered"],
            ["6+", "Signage Services"],
            ["1987", "Established"],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="text-2xl font-extrabold text-brand sm:text-3xl">
                {stat}
              </p>
              <p className="text-xs font-medium text-foreground/60 sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
