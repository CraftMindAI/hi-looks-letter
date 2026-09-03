export default function About() {
  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand">
            About Company
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Established Since 1987
          </h3>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Hi-Look&apos;s Letters has spent over three decades promoting
            businesses through high-quality, custom-designed signboards
            &mdash; building a reputation for excellence, affordability, and
            timeless craftsmanship.
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-black/5 bg-brand-tint/40 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-brand">
                Proprietor
              </dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">
                A. Mohamed Saleem
              </dd>
            </div>
            <div className="rounded-xl border border-black/5 bg-brand-tint/40 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-brand">
                Managing Director
              </dt>
              <dd className="mt-1 text-lg font-semibold text-foreground">
                A. Deen Rubiyaa
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-10 text-center text-white shadow-xl">
            <p className="text-6xl font-extrabold leading-none">35+</p>
            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-white/80">
              Years of Experience
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/90">
              in promoting businesses with signage that lasts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
