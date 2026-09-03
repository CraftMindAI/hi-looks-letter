const ACHIEVEMENTS = [
  { stat: "2500+", label: "Successful Projects" },
  { stat: "35+", label: "Years of Excellence" },
  { stat: "100%", label: "Custom-designed Signboards" },
  { stat: "1987", label: "A Track Record Since" },
];

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="bg-gradient-to-br from-brand to-brand-dark py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
            Achievements
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            A Track Record of Success
          </h3>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            Reputation for excellence and affordable, custom-designed
            signboards that speak for themselves.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {ACHIEVEMENTS.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-extrabold sm:text-4xl">{item.stat}</p>
              <p className="mt-1 text-xs font-medium text-white/80 sm:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
