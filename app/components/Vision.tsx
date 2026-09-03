export default function Vision() {
  return (
    <section id="vision" className="relative overflow-hidden bg-brand-tint/50 py-16 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-light/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-brand">
          Vision
        </h2>
        <p className="mt-4 text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
          To be the{" "}
          <span className="text-brand">unrivaled leader</span> in the
          signboard solutions industry, setting the standard for excellence
          and innovation.
        </p>
        <p className="mt-5 text-base leading-relaxed text-foreground/70">
          We aspire to continue delivering top-notch signboards that not only
          meet but exceed the expectations of our clients.
        </p>
      </div>
    </section>
  );
}
