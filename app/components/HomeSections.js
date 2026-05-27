/**
 * @fileoverview Collection of landing page layout sections (Stats, Features, Profile, FAQ, and CTA).
 * Integrates Intersection Observer counters, auto-advancing slideshows, interactive tab flows,
 * and custom scroll animations via useScrollReveal.
 */

'use client';
import { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '../../lib/data'; // Need to export Icons from data.js

const stats = [
  { value: '24+', label: 'Materi Edukasi', icon: Icons.book },
  { value: '120+', label: 'Sosialisasi Edukasi', icon: Icons.chart },
  { value: '15.000+', label: 'Peserta Didik', icon: Icons.users },
  { value: '27', label: 'Kota/Kabupaten', icon: Icons.map },
];

/**
 * Custom hook to animate numeric counter when scrolled into the viewport.
 * Uses a cubic ease-out calculation over a customizable animation duration.
 * @param {string} target The numeric target value (may contain suffixes like '+' or '.').
 * @param {number} [duration=2000] Animation duration in milliseconds.
 * @returns {object} Reference to pass to target DOM element and the formatted count string.
 */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(target.replace(/[^0-9]/g, '')) || 0;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(num * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const suffix = target.replace(/[0-9.,]/g, '');
  return { ref, display: count.toLocaleString('id-ID') + suffix };
}

/**
 * Individual statistic card component featuring an ease-out animated counter and hover elevation effects.
 * @param {object} props
 * @param {object} props.stat The statistics data schema containing value, label, and SVG icon.
 * @param {number} props.delay Animation delay multiplier for sequential entrance effect.
 */
function StatCard({ stat, delay }) {
  const { ref, display } = useCounter(stat.value);
  return (
    <div
      ref={ref}
      className={`bg-white/20 backdrop-blur-2xl border border-white/20 shadow-xl shadow-blue-900/10 rounded-3xl p-6 sm:p-8 transform transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-400/20 hover:border-white/40 hover:bg-white/30 group animate-fade-up delay-${delay}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white/40 border border-white/30 flex items-center justify-center text-blue-100 mb-5 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-400 transition-all duration-200 ease-out [&_svg]:stroke-[2.5px] [&_svg]:w-7 [&_svg]:h-7 shadow-inner">
        <div className="flex items-center justify-center">{stat.icon}</div>
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
        {display}
      </p>
      <p className="text-sm sm:text-base font-medium text-blue-100/80">
        {stat.label}
      </p>
    </div>
  );
}

const slides = [
  '/Dokumentasi1.jpeg',
  '/Dokumentasi2.png',
  '/Dokumentasi3.png',
  '/Dokumentasi4.png',
];

/**
 * Renders the landing page statistics section.
 * Backed by a full-screen, self-advancing slideshow overlay featuring local event documentation.
 */
export function HomeStats() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const revealRef = useScrollReveal();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={revealRef} className="relative z-30 overflow-hidden">
      <style>{`
        @keyframes fill-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 bg-civic-navy">
        {slides.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt={`Dokumentasi ${idx + 1}`}
            fill
            sizes="100vw"
            quality={60}
            className={`object-cover transition-opacity duration-500 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            loading={idx === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* Transparent Overlay */}
        <div className="absolute inset-0 bg-civic-navy/80 z-20" />
      </div>

      <div className="relative z-10 px-6 lg:px-8 max-w-6xl mx-auto py-16 pb-24 lg:py-24 lg:pb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 reveal-base reveal-up delay-1">
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} delay={Math.min(i + 1, 6)} />
          ))}
        </div>
      </div>

      {/* Pagination / Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {slides.map((_, idx) => {
          const isActive = currentSlide === idx;
          return (
            <div
              key={idx}
              className={`relative rounded-full overflow-hidden transition-all duration-400 ease-out ${
                isActive ? 'w-24 h-2 bg-white/20' : 'w-2 h-2 bg-white/60'
              }`}
            >
              {isActive && (
                <div
                  key={currentSlide}
                  className="absolute left-0 top-0 h-full w-full bg-white rounded-full origin-left"
                  style={{ animation: 'fill-progress 8s linear forwards' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const features = [
  {
    icon: Icons.shield,
    title: 'Pencegahan Penipuan',
    desc: 'Kemampuan mengidentifikasi investasi bodong dan skema penipuan digital yang marak beredar.',
  },
  {
    icon: Icons.wallet,
    title: 'Perencanaan Masa Depan',
    desc: 'Menyiapkan dana darurat, pendidikan, dan pensiun dengan instrumen yang tepat dan aman.',
  },
  {
    icon: Icons.chart,
    title: 'Kesehatan Finansial',
    desc: 'Mengelola hutang produktif dan membatasi hutang konsumtif untuk ketenangan finansial.',
  },
];

/**
 * Renders the "Stop, Cek, Lapor" interactive feature section.
 * Provides tabs showing systematic actions users should take when experiencing suspicious financial activity,
 * including a CSS-pulsing 30-second reminder banner.
 */
export function HomeFeatures() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const revealRef = useScrollReveal();

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const steps = [
    {
      title: 'STOP',
      desc: '(Jangan Panik!)',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-10 h-10 lg:w-12 lg:h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
          />
        </svg>
      ),
      activeColor: 'text-red-500',
      activeRing: 'ring-red-500/30',
    },
    {
      title: 'CEK',
      desc: '(Fakta & Akun Resmi)',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-10 h-10 lg:w-12 lg:h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      activeColor: 'text-blue-600',
      activeRing: 'ring-blue-400/30',
    },
    {
      title: 'LAPOR',
      desc: '(Otoritas Terkait)',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-10 h-10 lg:w-12 lg:h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
      activeColor: 'text-blue-600',
      activeRing: 'ring-blue-400/30',
    },
  ];

  return (
    <section ref={revealRef} className="bg-civic-navy section-padding relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/mega_mendung.jpeg"
          alt="Motif Mega Mendung"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.05] mix-blend-luminosity"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-civic-navy via-civic-navy/90 to-transparent" />
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="lg:w-2/5 reveal-base reveal-up delay-1">
            <p className="text-sm md:text-base font-semibold tracking-wider text-blue-400 mb-4 uppercase">
              Mengapa Penting
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.15]">
              Kalau Ragu Stop Dulu
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed font-light">
              Membantu kamu untuk lebih sadar dan paham cara melindungi diri
              agar terhindar dari praktik kejahatan, penipuan serta kecurangan
              di bidang sistem pembayaran.
            </p>
          </div>

          {/* Interactive STOP CEK LAPOR UI */}
          <div
            className="lg:w-3/5 w-full reveal-base reveal-up delay-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-14 relative shadow-2xl overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-center relative mb-16 mt-4">
                  {/* Connecting Line */}
                  <div className="absolute top-10 lg:top-12 left-[16.6%] right-[16.6%] h-1 lg:h-1.5 bg-white/10 -z-10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full transition-all duration-400 ease-out"
                      style={{ width: `${(activeStep / 2) * 100}%` }}
                    />
                  </div>

                  {steps.map((step, idx) => {
                    const isActive = activeStep === idx;
                    const isPast = idx < activeStep;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center relative z-10 w-1/3 cursor-pointer group/step"
                        onMouseEnter={() => setActiveStep(idx)}
                      >
                        <div
                          className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ease-out border-2 ${
                            isActive
                              ? `bg-white border-white scale-110 shadow-2xl ring-4 ring-offset-4 ring-offset-[#0f172a] ${step.activeRing} ${step.activeColor}`
                              : isPast
                                ? `bg-civic-navy border-blue-400/50 text-blue-400 scale-100 shadow-inner`
                                : `bg-civic-navy border-white/20 text-white/40 scale-100 hover:border-white/40 hover:text-white/60 shadow-inner`
                          }`}
                        >
                          {step.icon}
                        </div>
                        <h4
                          className={`font-bold text-xl lg:text-2xl mb-2 transition-colors ${
                            isActive
                              ? 'text-white'
                              : isPast
                                ? 'text-blue-200'
                                : 'text-white/40'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-sm lg:text-base font-medium transition-colors ${
                            isActive
                              ? 'text-blue-200'
                              : isPast
                                ? 'text-blue-200/60'
                                : 'text-white/30'
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* 30 Detik Pertama Highlight */}
                <div 
                  className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-400 ease-out"
                  style={{ animation: 'box-breathe 33s infinite' }}
                >
                  <style>{`
                    @keyframes thirty-seconds {
                      0% { width: 0%; opacity: 0; }
                      1% { width: 0%; opacity: 1; }
                      90.9% { width: 100%; opacity: 1; }
                      96% { width: 100%; opacity: 1; }
                      98% { width: 100%; opacity: 0; }
                      100% { width: 0%; opacity: 0; }
                    }
                    @keyframes box-breathe {
                      0%, 90.9% { transform: scale(1); background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); box-shadow: 0 0 0 rgba(96,165,250,0); }
                      93% { transform: scale(1.05); background-color: rgba(255,255,255,0.15); border-color: rgba(96,165,250,0.6); box-shadow: 0 0 40px rgba(96,165,250,0.6); }
                      97% { transform: scale(1); background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); box-shadow: 0 0 0 rgba(96,165,250,0); }
                      100% { transform: scale(1); background-color: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); box-shadow: 0 0 0 rgba(96,165,250,0); }
                    }
                  `}</style>
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500/30 to-blue-400/50"
                    style={{ animation: 'thirty-seconds 33s linear infinite' }}
                  />
                  <p className="text-white font-bold tracking-widest text-lg lg:text-xl uppercase relative z-10 flex items-center gap-3">
                    30 Detik Pertama!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the Bank Indonesia short profile block, explaining its monetary and administrative duties.
 */
export function HomeProfile() {
  const revealRef = useScrollReveal();
  return (
    <section ref={revealRef} className="bg-white section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl reveal-base reveal-up delay-1">
            <Image
              src="/BI_Building.png"
              alt="Gedung Bank Indonesia"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="w-full md:w-1/2 reveal-base reveal-up delay-2">
            <p className="text-overline text-civic-blue mb-3">Profil Singkat</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Bank Indonesia
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Bank Indonesia (BI) adalah lembaga negara independen yang
              berfungsi sebagai Bank Sentral Republik Indonesia. Berdasarkan
              Undang-Undang, BI memiliki tujuan tunggal untuk mencapai dan
              memelihara stabilitas nilai Rupiah melalui pengelolaan bidang
              moneter, sistem pembayaran, dan stabilitas sistem keuangan.
              Sebagai otoritas moneter, BI berwenang menetapkan kebijakan suku
              bunga, mengatur kelancaran lalu lintas pembayaran nasional, serta
              merumuskan kebijakan makroprudensial untuk mendukung pertumbuhan
              ekonomi nasional yang berkelanjutan.{' '}
            </p>
            <Link
              href="/tentang"
              className="inline-flex items-center gap-2 text-civic-blue font-bold hover:gap-4 transition-all"
            >
              Pelajari Lebih Lanjut{' '}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the interactive Accordion-style Frequently Asked Questions section regarding consumer protection.
 */
export function HomeFaq() {
  const [openIdx, setOpenIdx] = useState(null);
  const revealRef = useScrollReveal();

  const faqs = [
    {
      q: 'Bagaimana cara melapor penipuan transaksi?',
      a: 'Segera hubungi penyedia layanan atau bank terkait, simpan bukti transaksi, dan laporkan melalui kanal pengaduan resmi agar penanganan dapat dilakukan lebih cepat. Jika belum terselesaikan, konsumen dapat menggunakan kanal pengaduan resmi Bank Indonesia.',
    },
    {
      q: 'Apa itu QRIS palsu?',
      a: 'QRIS palsu adalah kode pembayaran yang telah dimanipulasi sehingga dana masuk ke rekening pelaku. Pastikan nama merchant muncul sesuai dan benar sebelum melakukan pembayaran.',
    },
    {
      q: 'Kenapa OTP tidak boleh dibagikan?',
      a: 'Kode OTP bersifat rahasia dan hanya digunakan oleh pemilik akun. Membagikan OTP dapat membuka akses pelaku ke akun atau transaksi Anda.',
    },
    {
      q: 'Apa yang harus dilakukan jika salah transfer?',
      a: 'Segera hubungi bank atau penyedia layanan pembayaran, sertakan bukti transaksi, dan ajukan pelaporan sesegera mungkin untuk proses tindak lanjut.',
    },
    {
      q: 'Bagaimana menjaga data pribadi tetap aman?',
      a: 'Jangan membagikan PIN, password, OTP, atau data pribadi kepada siapa pun, serta gunakan password yang kuat dan berbeda untuk setiap akun.',
    },
  ];

  return (
    <section ref={revealRef} className="bg-canvas-warm section-padding relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/batik_merak.png"
          alt="Motif Batik Merak"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.03] mix-blend-multiply"
          loading="lazy"
        />
      </div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 reveal-base reveal-up delay-1">
          <p className="text-overline text-civic-blue mb-3">FAQ</p>
          <h2 className="text-display text-text-primary">Pelindungan Konsumen</h2>
        </div>
        <div className="space-y-4 reveal-base reveal-up delay-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-200 ease-out ${isOpen ? 'shadow-md' : ''}`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center font-bold text-lg text-slate-800 p-6 focus:outline-none"
                >
                  <span className="text-left">{faq.q}</span>
                  <span
                    className={`transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <svg
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </button>
                <div
                  className="grid transition-all duration-200 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-500 pb-6 px-6 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the final Call-To-Action (CTA) panel directing users to the educational courses page.
 */
export function HomeCta() {
  const revealRef = useScrollReveal();
  return (
    <section ref={revealRef} className="bg-canvas section-padding">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="relative bg-civic-navy rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl shadow-blue-900/20 reveal-base reveal-up delay-1">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/full_mega_mendung.png"
              alt="Motif Mega Mendung"
              fill
              sizes="100vw"
              className="object-cover opacity-15 mix-blend-luminosity scale-125 rotate-6"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-civic-navy/80" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Uji Pemahaman Anda
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Akses puluhan materi eksklusif dan evaluasi tingkat literasi
              finansial Anda melalui post-test interaktif kami.
            </p>
            <Link
              href="/materi"
              className="inline-flex items-center gap-2 bg-white text-civic-blue hover:bg-blue-50 font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
            >
              Jelajahi Materi{' '}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
