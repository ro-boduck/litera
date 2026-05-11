import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { headers } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "LITERA — Edukasi Literasi Keuangan Jawa Barat",
  description:
    "Platform edukasi literasi keuangan modern dan interaktif untuk masyarakat Jawa Barat, oleh Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat.",
  keywords: ["literasi keuangan", "edukasi", "bank indonesia", "jawa barat", "LITERA"],
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-next-pathname") || headersList.get("x-invoke-path") || "";
  const isAdmin = pathname.startsWith("/kelola-8f2k9x3m");
  const isQuiz = /^\/materi\/[^/]+\/kuis/.test(pathname);
  const hideFooter = isAdmin || isQuiz;

  return (
    <html lang="id" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        {!isAdmin && <Navbar />}
        <main className="flex-grow">{children}</main>
        {!hideFooter && <Footer />}
      </body>
    </html>
  );
}
