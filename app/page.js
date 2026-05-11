"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import dynamic from "next/dynamic";

const HomeStats = dynamic(() => import("./components/HomeSections").then(mod => mod.HomeStats), { ssr: false });
const HomeFeatures = dynamic(() => import("./components/HomeSections").then(mod => mod.HomeFeatures), { ssr: false });
const HomeProfile = dynamic(() => import("./components/HomeSections").then(mod => mod.HomeProfile), { ssr: false });
const HomeFaq = dynamic(() => import("./components/HomeSections").then(mod => mod.HomeFaq), { ssr: false });
const HomeCta = dynamic(() => import("./components/HomeSections").then(mod => mod.HomeCta), { ssr: false });

export default function Home() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden pt-[180px] pb-16 lg:pt-[200px] lg:pb-20 bg-gradient-to-b from-blue-50/80 via-white to-blue-50/40">
        {/* Background Image Layer (Mega Mendung Pattern) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/mega_mendung.jpeg"
            alt="Motif Mega Mendung"
            fill
            sizes="100vw"
            className="object-cover opacity-[0.04] mix-blend-multiply"
            priority
            loading="eager"
          />
        </div>

        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none z-0" />
        
        <div className="relative z-20 max-w-5xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
          
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 max-w-4xl">
            Tingkatkan Pemahaman <span className="text-blue-600 bg-blue-100/50 px-3 py-1 rounded-2xl mx-1 inline-flex items-center gap-2 relative -top-1 shadow-sm border border-blue-200">Finansial</span> Anda Bersama Kami
          </h1>

          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mb-10">
            Platform pembelajaran interaktif untuk meningkatkan pemahaman
            keuangan masyarakat Jawa Barat — gratis, mudah, dan terbuka untuk semua kalangan.
          </p>

          <Link href="/materi" className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-medium px-8 py-4 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
              Mulai Belajar Sekarang <span className="text-xl leading-none group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>

        </div>
      </section>

      {/* ═══ LAZY LOADED SECTIONS ═══ */}
      <HomeStats />
      <HomeFeatures />
      <HomeProfile />
      <HomeFaq />
      <HomeCta />
    </>
  );
}
