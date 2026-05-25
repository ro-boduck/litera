import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CursorGlow from "./components/CursorGlow";
import ChatbotFAB from "./components/ChatbotFAB";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Ruang PeKA",
  description:
    "Platform edukasi literasi keuangan modern dan interaktif untuk masyarakat Jawa Barat, oleh Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat.",
  keywords: ["literasi keuangan", "edukasi", "bank indonesia", "jawa barat", "Ruang PeKA"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <CursorGlow />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ChatbotFAB />
      </body>
    </html>
  );
}
