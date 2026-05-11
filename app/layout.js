import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
