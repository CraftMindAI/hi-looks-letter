import HiLooksLogoAnimation from "@/components/HiLooksLogoAnimation";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Left Column: Hero Content */}
          <div className="order-2 flex flex-col items-start gap-6 lg:order-1 lg:col-span-6 xl:col-span-6">
            <span className="animate-hero-fade-up rounded-full bg-brand-tint px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand [animation-delay:0ms]">
              Professional Sign Makers &middot; Since 1987
            </span>

            <h1 className="animate-hero-fade-up text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl [animation-delay:150ms]">
              Signage That Makes Your Business{" "}
              <span className="text-brand">Impossible to Miss</span>
            </h1>

            <p className="animate-hero-fade-up max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg [animation-delay:300ms]">
              35+ years crafting LED signs, NEON signs, ACP cladding, metal signs
              and decorative signage &mdash; trusted by 2500+ businesses across
              Chennai and beyond.
            </p>

            <div className="animate-hero-fade-up flex flex-wrap gap-4 pt-2 [animation-delay:450ms]">
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

            <div className="animate-hero-fade-up mt-6 grid w-full grid-cols-2 gap-6 border-t border-black/5 pt-8 sm:grid-cols-4 [animation-delay:600ms]">
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

          {/* Right Column: Hi-Look's Logo Animation (Expanded size) */}
          <div className="order-1 flex w-full items-center justify-center lg:order-2 lg:col-span-6 xl:col-span-6">
            <HiLooksLogoAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
