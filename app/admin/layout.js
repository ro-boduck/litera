/**
 * @fileoverview Decoy admin layout.
 * Leverages the default site layout (Navbar and Footer) so that scanned
 * honeypot URLs appear visually identical to authentic missing pages.
 */

export const metadata = {
  title: "404 — Halaman Tidak Ditemukan",
  robots: "noindex, nofollow",
};

export default function AdminDecoyLayout({ children }) {
  return children;
}
