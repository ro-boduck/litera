"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/kelola-8f2k9x3m");
  const isQuiz = /^\/materi\/[^/]+\/kuis/.test(pathname);

  if (isAdmin || isQuiz) return null;

  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Jelajahi",
      links: [
        { label: "Beranda", href: "/" },
        { label: "Katalog Materi", href: "/materi" },
      ],
    },
    {
      title: "Informasi",
      links: [
        { label: "Tentang Ruang PeKA JABAR", href: "/tentang" },
        { label: "Hubungi Kami", href: "/kontak" },
        { label: "Bank Indonesia", href: "https://www.bi.go.id" },
      ],
    },
  ];

  return (
    <footer className="bg-civic-navy relative overflow-hidden">
      {/* Decorative background clouds pattern overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/mega_mendung.jpeg"
          alt="Motif Mega Mendung"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.40] mix-blend-luminosity scale-x-[-1] scale-y-[-1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-civic-navy/95 via-civic-navy/80 to-civic-navy/60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        {/* Branding information and description footer blocks */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12">
          <div className="lg:w-2/5">
            <div className="mb-6">
              <div className="bg-white rounded-full px-6 py-2.5 inline-block shadow-lg">
                <Image 
                  src="/BI_Logo.png" 
                  alt="Logo Bank Indonesia" 
                  width={140} 
                  height={40} 
                  className="h-auto w-[120px] object-contain"
                />
              </div>
            </div>
            <p className="text-[15px] text-text-on-dark-muted leading-relaxed max-w-sm">
              Platform edukasi literasi keuangan interaktif untuk masyarakat
              Jawa Barat, oleh Kantor Perwakilan Bank Indonesia.
            </p>
          </div>

          {/* Footer sitemap columns navigation */}
          <div className="lg:w-3/5 grid grid-cols-2 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-overline text-text-on-dark-muted mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-text-on-dark-muted hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal partition line */}
        <div className="border-t border-border-on-dark" />

        {/* Attribution copyright block */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-fine text-text-on-dark-muted opacity-60">
            &copy; {year} KPwBI Provinsi Jawa Barat. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-2 text-fine text-text-on-dark-muted opacity-60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>Didukung oleh Bank Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
