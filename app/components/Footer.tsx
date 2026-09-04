const QUICK_LINKS = [
  { href: "#about", label: "About" },
  { href: "#vision", label: "Vision" },
  { href: "#services", label: "Services" },
  { href: "#expertise", label: "Expertise" },
  { href: "#achievements", label: "Achievements" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const SERVICES = [
  "LED Video Wall",
  "LED Signs",
  "NEON Signs",
  "ACP Cladding Works",
  "Metal Signs",
  "Decorative Signage",
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 md:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold">
            HI-LOOK&apos;S{" "}
            <span className="font-normal opacity-80">LETTERS</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Professional sign makers since 1987-35+ years of experience
            promoting businesses with signage that lasts.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Quick Links
          </h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Services
          </h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
            {SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Get in Touch
          </h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <li>No 38, Kamarajar Salai, Virugambakkam, Chennai &ndash; 92</li>
            <li>
              <a href="tel:+919841060170" className="hover:text-white">
                +91 98410 60170
              </a>
            </li>
            <li>
              <a
                href="mailto:hilooksletters@gmail.com"
                className="hover:text-white"
              >
                hilooksletters@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.hilooksletters.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                www.hilooksletters.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-white/60 sm:flex-row sm:px-8">
          <p>
            &copy; {new Date().getFullYear()} Hi-Look&apos;s Letters. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <p>Proprietor: A. Mohamed Saleem &middot; MD: A. Deen Rubiyaa</p>
            <a
              href="/admin/login"
              className="text-white/60 underline-offset-2 hover:text-white hover:underline"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
