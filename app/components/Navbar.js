"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/materi", label: "Materi" },
    { href: "/tentang", label: "Tentang" },
    { href: "/kontak", label: "Kontak" },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled
          ? "rgba(250, 250, 248, 0.85)"
          : "rgba(250, 250, 248, 0.6)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(0, 0, 0, 0.06)" : "1px solid transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Beranda - Kantor Perwakilan Bank Indonesia">
              <Image 
                src="/BI_Logo.png" 
                alt="Bank Indonesia Logo" 
                width={140} 
                height={40} 
                className="h-9 w-auto opacity-90 group-hover:opacity-100 transition-opacity" 
                priority
              />
            </Link>
          </div>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200
                  ${isActive(link.href)
                    ? "text-civic-blue bg-civic-blue-mist"
                    : "text-text-secondary hover:text-text-primary hover:bg-canvas-warm"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            <Link href="/materi" className="btn-primary text-[14px] py-2.5 px-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
              Mulai Belajar
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
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

        {/* ── Mobile Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? "max-h-80 pb-6" : "max-h-0"
          }`}
        >
          <div className="pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-[16px] font-medium transition-colors
                  ${isActive(link.href)
                    ? "text-civic-blue bg-civic-blue-mist"
                    : "text-text-secondary hover:text-text-primary hover:bg-canvas-warm"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/materi"
              className="btn-primary w-full mt-3 text-[15px] py-3"
            >
              Mulai Belajar
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
