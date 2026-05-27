/**
 * @fileoverview Honeypot decoy page.
 * Returns a generic 404 response for scanners looking for a standard "/admin" route.
 * The actual admin portal is located at an obfuscated slug route.
 */
import Link from "next/link";

export const metadata = {
  title: "404 — Halaman Tidak Ditemukan",
  robots: "noindex, nofollow",
};

export default function AdminDecoyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas-warm px-6 text-center">
      <h1 className="text-7xl font-bold text-slate-300 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-body text-text-tertiary mb-8 max-w-md">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link href="/" className="btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
