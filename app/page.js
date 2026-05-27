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

/* --- Skeleton Loader Components (Client-side dynamic view fallbacks) --- */
const StatsSkeleton = () => (
  <div className="relative z-30 overflow-hidden bg-[#1B2D4F] animate-pulse">
    <div className="px-6 lg:px-8 max-w-6xl mx-auto py-16 pb-24 lg:py-24 lg:pb-32">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/10 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 mb-5" />
            <div className="h-8 w-20 bg-white/20 rounded mb-2" />
            <div className="h-4 w-32 bg-white/15 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FeaturesSkeleton = () => (
  <div className="bg-[#1B2D4F] section-padding animate-pulse">
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        <div className="lg:w-2/5 w-full space-y-4">
          <div className="h-4 w-28 bg-white/20 rounded" />
          <div className="h-10 w-4/5 bg-white/20 rounded" />
          <div className="h-10 w-2/3 bg-white/20 rounded" />
          <div className="space-y-2 mt-6">
            <div className="h-4 w-full bg-white/15 rounded" />
            <div className="h-4 w-5/6 bg-white/15 rounded" />
            <div className="h-4 w-4/5 bg-white/15 rounded" />
          </div>
        </div>
        <div className="lg:w-3/5 w-full">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-14 space-y-8">
            <div className="flex justify-between items-center relative">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-3 w-1/3">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20" />
                  <div className="h-6 w-12 bg-white/20 rounded" />
                  <div className="h-4 w-16 bg-white/15 rounded" />
                </div>
              ))}
            </div>
            <div className="h-14 w-full bg-white/10 rounded-xl" />
          </div>
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
      <section ref={heroRef} className="relative overflow-hidden min-h-[100svh] bg-gradient-to-b from-[#f0f6fc] to-[#e4eff8]">
        {/* Decorative background motif cloud pattern overlay */}
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

        {/* Purely decorative building graphic placed at bottom left */}
        <div className="hidden lg:block absolute left-0 bottom-0 translate-y-[45%] w-[320px] h-[160px] xl:w-[400px] xl:h-[200px] z-0 pointer-events-none opacity-20 select-none">
          <Image
            src="/HeroBIBuilding.png"
            alt="Gedung Bank Indonesia"
            fill
            sizes="(max-width: 1280px) 320px, 400px"
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* Vertically centered layout container */}
        <div className="relative z-20 min-h-[100svh] flex flex-col justify-center items-center pt-[100px] pb-10">

          {/* Central content wrapper */}
          <div className="relative w-full max-w-4xl px-6 lg:px-8 text-center flex flex-col items-center">

            {/* PeKa Logo */}
            <div className="mb-3 relative w-40 h-[52px] md:w-48 md:h-[60px] lg:w-[200px] lg:h-[66px] reveal-base reveal-up delay-1">
              <Image
                src="/FullLogoPeKa.png"
                alt="PeKa Logo"
                fill
                sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 200px"
                className="object-contain"
                priority
              />
            </div>

            {/* Relative positioning container that anchors side mascots beside the main header title */}
            <div className="relative w-full">
              {/* Left mascot: Vertically centered relative to parent title height */}
              <div className="hidden xl:block absolute right-full top-1/2 mr-10 mascot-enter-left select-none pointer-events-none">
                <div className="relative w-[150px] h-[246px]">
                  <Image
                    src="/KangUmen.png"
                    alt="Karakter Kang Umen"
                    fill
                    sizes="150px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Right mascot: Vertically centered relative to parent title height */}
              <div className="hidden xl:block absolute left-full top-1/2 ml-10 mascot-enter-right select-none pointer-events-none">
                <div className="relative w-[150px] h-[246px]">
                  <Image
                    src="/NengEuis.png"
                    alt="Karakter Neng Euis"
                    fill
                    sizes="150px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <h1 className="flex flex-col items-center text-center text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] font-bold tracking-tight text-slate-900 leading-[1.2] mb-3 reveal-base reveal-up delay-2">
                <span className="block mb-0.5">
                  Ruang Edukasi Pelindungan Konsumen
                </span>
                <span className="block mb-2">Demi Mewujudkan</span>
                <span className="inline-flex items-center px-5 py-1 mb-2 text-blue-600 bg-blue-100/50 rounded-2xl border border-blue-200 shadow-sm">
                  Masyarakat Jawa Barat
                </span>
                <span className="text-slate-800 block">
                  Cerdas, Waspada, dan Terlindungi
                </span>
              </h1>
            </div>

            <p className="text-sm md:text-base lg:text-lg text-slate-500 leading-relaxed max-w-2xl mb-6 reveal-base reveal-up delay-3">
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

        </div>
      </section>

      {/* --- Lazy-loaded Content Sections (Rendered on intersection to reduce initial bundle loading footprints) --- */}
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
