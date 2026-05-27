/**
 * @fileoverview Main administrative dashboard portal layout.
 * Isolated from the public header/footer shell. All subroutes handle their own chrome/navigation.
 */

export const metadata = {
  title: "Ruang PeKA JABAR CMS — Admin Dashboard",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }) {
  return children;
}
