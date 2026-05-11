"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas-warm flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/batik_merak.png" alt="Motif Batik" fill className="object-cover opacity-[0.05] mix-blend-multiply" priority />
      </div>
      
      <div className="relative z-10 text-center max-w-lg px-6">
        <div className="w-24 h-24 bg-red-100 rounded-3xl mx-auto flex items-center justify-center text-red-500 mb-8">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Terjadi Kesalahan</h1>
        <p className="text-slate-600 mb-10 text-lg">Sistem mengalami gangguan saat memproses permintaan Anda. Silakan coba kembali.</p>
        
        <button 
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-civic-blue text-white font-medium px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-xl shadow-civic-blue/30"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
