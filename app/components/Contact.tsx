export default function Contact() {
  return (
    <section id="contact" className="bg-brand-tint/50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 rounded-3xl bg-white p-8 shadow-xl sm:p-12 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand">
              Contact
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              Let&apos;s Connect With Us!
            </h3>
            <p className="mt-4 text-base leading-relaxed text-foreground/70">
              Reach out to Hi-Look&apos;s Letters for your next signage
              project &mdash; we&apos;d love to help your business stand out.
            </p>

            <a
              href="tel:+919841060170"
              className="mt-6 inline-block rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Call +91 98410 60170
            </a>
          </div>

          <ul className="flex flex-col gap-5 text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-brand">&#128205;</span>
              <span className="text-foreground/80">
                No 38, Kamarajar Salai, Virugambakkam, Chennai &ndash; 92
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-brand">&#128222;</span>
              <a
                href="tel:+919841060170"
                className="text-foreground/80 hover:text-brand"
              >
                +91 98410 60170
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-brand">&#9993;</span>
              <a
                href="mailto:hilooksletters@gmail.com"
                className="text-foreground/80 hover:text-brand"
              >
                hilooksletters@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-brand">&#127760;</span>
              <a
                href="https://www.hilooksletters.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-brand"
              >
                www.hilooksletters.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
