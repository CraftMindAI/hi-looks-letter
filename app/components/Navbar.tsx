"use client";

import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#vision", label: "Vision" },
  { href: "#services", label: "Services" },
  { href: "#expertise", label: "Expertise" },
  { href: "#achievements", label: "Achievements" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#" className="flex items-center">
          <Image
            src="/hi-logo.png"
            alt="Hi-Look's Letters"
            width={780}
            height={320}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </a>

        <ul className="hidden items-center gap-7 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-foreground/80 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="tel:+919841060170"
          className="hidden rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark md:inline-block"
        >
          Call Now
        </a>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-black/5 bg-white px-5 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded px-2 py-2.5 text-sm font-medium text-foreground/80 hover:bg-brand-tint hover:text-brand"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="tel:+919841060170"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-full bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Call Now
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
