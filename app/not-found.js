import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas-warm flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/batik_merak.png" alt="Motif Batik" fill className="object-cover opacity-[0.05] mix-blend-multiply" priority />
      </div>
      
      <div className="relative z-10 text-center max-w-lg px-6">
        <div className="w-24 h-24 bg-civic-blue/10 rounded-3xl mx-auto flex items-center justify-center text-civic-blue mb-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-slate-600 mb-10 text-lg">Maaf, halaman yang Anda tuju mungkin telah dipindahkan atau tidak lagi tersedia di server.</p>
        
        <Link href="/" className="inline-flex items-center gap-2 bg-civic-blue text-white font-medium px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-xl shadow-civic-blue/30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
