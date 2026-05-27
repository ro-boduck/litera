/**
 * @fileoverview Main site navigation header.
 * Implements a floating design system with glassmorphism styling, active route highlighting,
 * full responsiveness, and mobile-friendly slide dropdowns.
 */

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * Navbar component for LITERA.
 * Includes page route links, branding elements, CTA buttons, and a responsive toggle for mobile devices.
 * Automatically conceals itself if current route matches isolated CMS paths.
 * @returns {React.ReactElement|null} Navigation header node, or null when in CMS view.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = pathname?.startsWith("/kelola-8f2k9x3m");
  if (isAdmin) return null;

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/materi", label: "Materi" },
    { href: "/tentang", label: "Tentang" },
    { href: "/kontak", label: "Kontak" },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : (pathname ? pathname.startsWith(href) : false);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header
        className="w-full max-w-4xl bg-white/90 backdrop-blur-md border border-white/50 shadow-2xl shadow-blue-900/10 rounded-full transition-all duration-300 pointer-events-auto"
      >
      <nav className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Beranda - Kantor Perwakilan Bank Indonesia">
              <Image 
                src="/BI_Logo.png" 
                alt="Bank Indonesia Logo" 
                width={140} 
                height={40} 
                className="h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity" 
                priority
                loading="eager"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item px-4 py-2 rounded-full text-[14px] font-medium
                  ${isActive(link.href)
                    ? "nav-item-active text-civic-blue bg-civic-blue-mist shadow-[0_4px_12px_rgba(37,99,235,0.06)]"
                    : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Call-To-Action */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            <Link href="/materi" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/40 rounded-full px-6 py-2.5 text-[14px] font-medium transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-blue-500/60 active:scale-95">
              Mulai Belajar
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-text-primary hover:bg-canvas-warm transition-colors"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
        </nav>
      </header>

      {/* Mobile Menu Dropdown Panel */}
      <div
        className={`absolute top-[80px] w-[calc(100%-2rem)] max-w-4xl bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl shadow-blue-900/10 rounded-3xl pointer-events-auto transition-all duration-200 ease-out origin-top ${
          mobileOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <div className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-[16px] font-medium transition-all duration-200 active:scale-[0.98]
                ${isActive(link.href)
                  ? "text-blue-600 bg-blue-50 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/materi"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/40 rounded-xl px-4 py-3 text-[15px] font-medium transition-all"
          >
            Mulai Belajar
          </Link>
        </div>
      </div>
    </div>
  );
}
