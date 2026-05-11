/**
 * Decoy admin layout — looks like a normal page with 404 content.
 * Intentionally uses the default site layout (Navbar/Footer visible)
 * so it appears like any other missing page on the site.
 */

export const metadata = {
  title: "404 — Halaman Tidak Ditemukan",
  robots: "noindex, nofollow",
};

export default function AdminDecoyLayout({ children }) {
  return children;
}
