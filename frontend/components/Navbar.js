"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/predict", label: "Analyze" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-600 text-white shadow-sm">
            <Heart size={18} className="animate-heartbeat" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-slate-900">
              CardioSense
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Arrhythmia Detection
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/predict" className="btn-primary ml-2">
            Start Analysis
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/predict"
              className="btn-primary mt-1"
              onClick={() => setOpen(false)}
            >
              Start Analysis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
