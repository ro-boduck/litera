/**
 * Admin layout — isolated from the public Navbar/Footer.
 * The admin section handles its own chrome.
 */

export const metadata = {
  title: "LITERA CMS — Admin Dashboard",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }) {
  return children;
}
