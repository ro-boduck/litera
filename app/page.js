'use client';
import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import Link from 'next/link';
import Image from 'next/image';
import LazyLoad from './components/LazyLoad';

import dynamic from 'next/dynamic';

const HomeStats = dynamic(
  () => import('./components/HomeSections').then((mod) => mod.HomeStats),
  { ssr: false }
);
const HomeFeatures = dynamic(
  () => import('./components/HomeSections').then((mod) => mod.HomeFeatures),
  { ssr: false }
);
const HomeProfile = dynamic(
  () => import('./components/HomeSections').then((mod) => mod.HomeProfile),
  { ssr: false }
);
const HomeFaq = dynamic(
  () => import('./components/HomeSections').then((mod) => mod.HomeFaq),
  { ssr: false }
);
const HomeCta = dynamic(
  () => import('./components/HomeSections').then((mod) => mod.HomeCta),
  { ssr: false }
);

/* ═══ CONTENT-AWARE SKELETON LOADERS ═══ */
const StatsSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 pb-24 lg:py-24 lg:pb-32 bg-[#FAFAF8] relative z-10 animate-pulse">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 sm:p-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-200 mb-5" />
          <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const FeaturesSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24 bg-[#FAFAF8] animate-pulse">
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
      <div className="lg:w-2/5 w-full space-y-4">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-10 w-4/5 bg-slate-200 rounded" />
        <div className="h-10 w-2/3 bg-slate-200 rounded" />
        <div className="space-y-2 mt-6">
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 rounded" />
          <div className="h-4 w-4/5 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="lg:w-3/5 w-full">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 lg:p-14 space-y-8">
          <div className="flex justify-between items-center relative">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-3 w-1/3">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-slate-200" />
                <div className="h-6 w-12 bg-slate-200 rounded" />
                <div className="h-4 w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
          <div className="h-14 w-full bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-24 bg-[#FAFAF8] animate-pulse">
    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
      <div className="w-full md:w-1/2 rounded-3xl bg-slate-200 aspect-[4/3]" />
      <div className="w-full md:w-1/2 space-y-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-10 w-2/3 bg-slate-200 rounded" />
        <div className="space-y-2 mt-6">
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 rounded" />
          <div className="h-4 w-4/5 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-36 bg-slate-200 rounded mt-6" />
      </div>
    </div>
  </div>
);

const FaqSkeleton = () => (
  <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-24 bg-[#FAFAF8] animate-pulse">
    <div className="text-center mb-12 space-y-3">
      <div className="h-4 w-12 bg-slate-200 rounded mx-auto" />
      <div className="h-8 w-48 bg-slate-200 rounded mx-auto" />
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 flex justify-between items-center">
          <div className="h-6 w-2/3 bg-slate-200 rounded" />
          <div className="w-6 h-6 rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  </div>
);

const CtaSkeleton = () => (
  <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 animate-pulse">
    <div className="bg-slate-200 rounded-3xl p-12 lg:p-16 flex flex-col items-center space-y-6">
      <div className="h-8 w-64 bg-slate-300 rounded" />
      <div className="h-4 w-96 bg-slate-300 rounded" />
      <div className="h-10 w-36 bg-slate-300 rounded-full" />
    </div>
  </div>
);

export default function Home() {
  const heroRef = useScrollReveal();

  return (
    <>
      <section ref={heroRef} className="relative overflow-hidden min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#f0f6fc] to-[#e4eff8] pt-[75px] pb-32 lg:pt-[160px] lg:pb-16">
        {/* Background Image Layer (Mega Mendung Pattern) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/full_mega_mendung.png"
            alt="Motif Mega Mendung"
            fill
            sizes="100vw"
            quality={30}
            className="object-cover opacity-[0.03] mix-blend-multiply"
            priority
          />
        </div>

        {/* Bank Indonesia Building (Bottom) */}
        <div className="absolute left-0 bottom-0 translate-y-[40%] lg:translate-y-[35%] w-full h-[300px] md:w-[300px] md:h-[150px] lg:w-[420px] lg:h-[210px] z-0 pointer-events-none opacity-45 lg:opacity-30 brightness-100 select-none">
          <Image
            src="/HeroBIBuilding.png"
            alt="Gedung Bank Indonesia"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 300px, 420px"
            className="object-contain object-bottom lg:object-left-bottom"
            priority
          />
        </div>

        {/* Karakter Kang Umen (Kiri) */}
        <div className="hidden xl:block absolute left-4 xl:left-12 top-1/2 -translate-y-1/2 w-[140px] h-[240px] xl:w-[180px] xl:h-[300px] z-10 select-none transition-transform duration-500 hover:scale-105 pointer-events-none">
          <Image
            src="/KangUmen.png"
            alt="Karakter Kang Umen"
            fill
            sizes="(max-width: 1280px) 140px, 180px"
            className="object-contain"
            priority
          />
        </div>

        {/* Karakter Neng Euis (Kanan) */}
        <div className="hidden xl:block absolute right-4 xl:right-12 top-1/2 -translate-y-1/2 w-[140px] h-[240px] xl:w-[180px] xl:h-[300px] z-10 select-none transition-transform duration-500 hover:scale-105 pointer-events-none">
          <Image
            src="/NengEuis.png"
            alt="Karakter Neng Euis"
            fill
            sizes="(max-width: 1280px) 140px, 180px"
            className="object-contain"
            priority
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
          {/* PeKa Logo */}
          <div className="mb-8 relative w-56 h-16 md:w-64 md:h-20 lg:w-[280px] lg:h-[88px] flex justify-center items-center reveal-base reveal-up delay-1">
            <Image
              src="/FullLogoPeKa.png"
              alt="PeKa Logo"
              fill
              sizes="(max-width: 768px) 224px, (max-width: 1024px) 256px, 280px"
              className="object-contain"
              priority
            />
          </div>

          <h1 className="flex flex-col items-center text-center text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.25] mb-6 max-w-4xl mx-auto reveal-base reveal-up delay-2">
            {/* Baris Atas */}
            <span className="block mb-1">
              Ruang Edukasi Pelindungan Konsumen
            </span>
            <span className="block mb-3">Demi Mewujudkan</span>

            {/* Baris Tengah (Highlight) */}
            <span className="inline-flex items-center gap-2 px-6 py-1.5 mb-3 text-blue-600 bg-blue-100/50 rounded-2xl border border-blue-200 shadow-sm transition-all">
              Masyarakat Jawa Barat
            </span>

            {/* Baris Bawah */}
            <span className="text-slate-800 block mt-1">
              Cerdas, Waspada, dan Terlindungi
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mb-10 reveal-base reveal-up delay-3">
            Membantu kamu untuk lebih sadar dan paham cara melindungi diri agar
            terhindar dari praktik kejahatan, penipuan serta kecurangan di
            bidang sistem pembayaran.
          </p>

          <Link
            href="/materi"
            className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 text-white font-medium px-8 py-4 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/30 reveal-base reveal-up delay-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
              Mulai Belajar Sekarang{' '}
              <span className="text-xl leading-none group-hover:translate-x-1 transition-transform">
                →
              </span>
            </span>
          </Link>
        </div>
      </section>

      {/* ═══ LAZY LOADED SECTIONS ═══ */}
      <LazyLoad minHeight="500px" skeleton={<StatsSkeleton />}>
        <HomeStats />
      </LazyLoad>
      <LazyLoad minHeight="700px" skeleton={<FeaturesSkeleton />}>
        <HomeFeatures />
      </LazyLoad>
      <LazyLoad minHeight="600px" skeleton={<ProfileSkeleton />}>
        <HomeProfile />
      </LazyLoad>
      <LazyLoad minHeight="500px" skeleton={<FaqSkeleton />}>
        <HomeFaq />
      </LazyLoad>
      <LazyLoad minHeight="500px" skeleton={<CtaSkeleton />}>
        <HomeCta />
      </LazyLoad>
    </>
  );
}
