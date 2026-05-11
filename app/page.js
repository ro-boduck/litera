"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── SVG Icons (no emoji, per ui-ux-pro-max §4) ── */
const Icons = {
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  trending: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  book: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  ),
  users: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  map: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  star: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  wallet: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <path d="M3 5v14a2 2 0 002 2h16v-5" />
      <path d="M18 12a2 2 0 100 4h4v-4h-4z" />
    </svg>
  ),
};

/* ── Data ── */
const stats = [
  { value: "24+", label: "Materi Edukasi", icon: Icons.book },
  { value: "15.000+", label: "Peserta Didik", icon: Icons.users },
  { value: "27", label: "Kota/Kabupaten", icon: Icons.map },
  { value: "98%", label: "Kepuasan", icon: Icons.star },
];

const materials = [
  { id: 1, cat: "Literasi Digital", title: "Keamanan Transaksi Digital", desc: "Cara melindungi data pribadi dan menghindari penipuan transaksi digital.", time: "8 mnt", icon: Icons.lock },
  { id: 2, cat: "Perencanaan", title: "Perencanaan Anggaran Pribadi", desc: "Strategi membagi penghasilan untuk kebutuhan, tabungan, dan investasi.", time: "12 mnt", icon: Icons.chart },
  { id: 3, cat: "Investasi", title: "Mengenal Instrumen Investasi", desc: "Panduan memahami profil risiko dan jenis investasi legal di Indonesia.", time: "10 mnt", icon: Icons.trending },
];

const features = [
  { icon: Icons.shield, title: "Pencegahan Penipuan", desc: "Kemampuan mengidentifikasi investasi bodong dan skema penipuan digital yang marak beredar." },
  { icon: Icons.wallet, title: "Perencanaan Masa Depan", desc: "Menyiapkan dana darurat, pendidikan, dan pensiun dengan instrumen yang tepat dan aman." },
  { icon: Icons.chart, title: "Kesehatan Finansial", desc: "Mengelola hutang produktif dan membatasi hutang konsumtif untuk ketenangan finansial." },
];

/* ── Animated Counter Hook ── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(target.replace(/[^0-9]/g, "")) || 0;
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

  const suffix = target.replace(/[0-9.,]/g, "");
  return { ref, display: count.toLocaleString("id-ID") + suffix };
}

/* ── Stat Card Component ── */
function StatCard({ stat, delay }) {
  const { ref, display } = useCounter(stat.value);
  return (
    <div ref={ref} className={`stat-card animate-fade-up delay-${delay}`}>
      <div className="w-12 h-12 rounded-2xl bg-civic-blue-mist flex items-center justify-center text-civic-blue mx-auto mb-4">
        {stat.icon}
      </div>
      <p className="stat-value mb-1">{display}</p>
      <p className="text-caption text-text-tertiary">{stat.label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden hero-gradient">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/mega_mendung.jpeg"
            alt="Motif Mega Mendung"
            fill
            className="object-cover opacity-[0.40] mix-blend-luminosity"
            priority
          />
          {/* Gradient overlay: Dark on left for text, more transparent on right for pattern pop */}
          <div className="absolute inset-0 bg-gradient-to-r from-civic-navy via-civic-navy/70 to-civic-navy/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-civic-navy via-transparent to-transparent opacity-80" />
        </div>

        {/* Ornamental Clouds */}
        <div className="ornament-cloud w-[500px] h-[500px] -top-48 -right-48 z-10 relative" />
        <div className="ornament-cloud w-[400px] h-[400px] bottom-0 -left-32 z-10 relative" />

        <div className="relative z-20 max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[13px] font-medium text-white/80">
                  KPwBI Jawa Barat
                </span>
              </div>

              <h1 className="text-hero-light mb-6">
                Literasi Keuangan
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                  untuk Semua.
                </span>
              </h1>

              <p className="text-[18px] text-white/70 leading-relaxed max-w-lg mb-10 mx-auto lg:mx-0">
                Platform pembelajaran interaktif untuk meningkatkan pemahaman
                keuangan masyarakat Jawa Barat — gratis dan terbuka.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/materi" className="btn-primary px-8 py-4 text-[16px]">
                  {Icons.book}
                  Jelajahi Materi
                </Link>
                <Link href="/tentang" className="btn-ghost-light px-8 py-4 text-[16px]">
                  Tentang Kami
                </Link>
              </div>
            </div>

            {/* Right: Interactive Financial Visualization */}
            <div className="lg:w-1/2 w-full max-w-md">
              <div className="relative bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 shadow-2xl">
                {/* Mini Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[12px] font-semibold text-white/50 uppercase tracking-wider">Indeks Literasi</p>
                    <p className="text-[28px] font-bold text-white tracking-tight">49.68<span className="text-[16px] text-emerald-400 ml-2">↑ 12.3%</span></p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    {Icons.trending}
                  </div>
                </div>

                {/* Chart Bars */}
                <div className="flex items-end gap-2 h-32 mb-4">
                  {[30, 42, 38, 55, 48, 62, 50, 72, 60, 85, 68, 90].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md transition-all duration-700" style={{
                      height: `${h}%`,
                      backgroundColor: i >= 10 ? "rgba(37, 99, 235, 0.9)" : i >= 8 ? "rgba(37, 99, 235, 0.6)" : "rgba(255, 255, 255, 0.08)",
                      animationDelay: `${i * 0.08}s`,
                    }} />
                  ))}
                </div>

                {/* Labels */}
                <div className="flex justify-between text-[10px] text-white/30 mb-6">
                  <span>2020</span><span>2022</span><span>2024</span><span>2026</span>
                </div>

                {/* Mini Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                    <p className="text-[11px] text-white/40 mb-1">Perbankan</p>
                    <p className="text-[16px] font-semibold text-white">67.8%</p>
                  </div>
                  <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                    <p className="text-[11px] text-white/40 mb-1">Asuransi</p>
                    <p className="text-[16px] font-semibold text-white">31.7%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="bg-canvas-warm section-padding mega-mendung-blue">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MATERIALS ═══ */}
      <section className="bg-canvas section-padding">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-overline text-civic-blue mb-3">Materi Edukasi</p>
            <h2 className="text-display text-text-primary mb-4">
              Topik pembelajaran pilihan.
            </h2>
            <p className="text-body text-text-secondary max-w-xl mx-auto">
              Materi yang dirancang dan dikurasi untuk meningkatkan wawasan
              finansial Anda secara komprehensif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {materials.map((m, i) => (
              <Link
                key={m.id}
                href={`/materi/${m.id}`}
                className={`card group animate-fade-up delay-${i + 1}`}
              >
                {/* Card Thumbnail */}
                <div className="aspect-[5/3] bg-gradient-to-br from-civic-blue-mist to-canvas-warm flex items-center justify-center relative overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-civic-blue group-hover:scale-110 transition-transform duration-300">
                    {m.icon}
                  </div>
                  {/* Decorative corner accent */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-civic-blue/[0.05]" />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-overline text-civic-blue">{m.cat}</span>
                    <span className="text-fine text-text-tertiary">{m.time}</span>
                  </div>
                  <h3 className="text-subheading text-text-primary mb-2 group-hover:text-civic-blue transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-caption text-text-tertiary mb-4">{m.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-civic-blue group-hover:gap-3 transition-all">
                    Baca selengkapnya {Icons.arrow}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/materi" className="btn-secondary px-8 py-3.5">
              Lihat Semua Materi
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ WHY SECTION ═══ */}
      <section className="bg-civic-navy section-padding mega-mendung relative overflow-hidden">
        <div className="ornament-cloud w-[600px] h-[600px] -top-32 -right-32" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-2/5">
              <p className="text-overline text-blue-300 mb-3">Mengapa Penting</p>
              <h2 className="text-display text-white mb-6">
                Literasi keuangan adalah fondasi kesejahteraan.
              </h2>
              <p className="text-body text-text-on-dark-muted">
                Di era digital yang cepat berubah, pemahaman produk keuangan vital
                untuk mencegah kerugian dan membangun masa depan yang aman.
              </p>
            </div>

            <div className="lg:w-3/5 space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-5 items-start group bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-civic-blue/20 flex items-center justify-center text-blue-300 flex-shrink-0 group-hover:bg-civic-blue/30 transition-colors">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-subheading text-white mb-1.5">{f.title}</h3>
                    <p className="text-caption text-text-on-dark-muted">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="bg-canvas section-padding">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="relative bg-civic-navy rounded-3xl p-12 lg:p-16 text-center overflow-hidden mega-mendung">
            <div className="ornament-cloud w-[400px] h-[400px] -top-20 -left-20" />
            <div className="relative">
              <h2 className="text-display text-white mb-4">
                Uji pemahaman Anda.
              </h2>
              <p className="text-body text-text-on-dark-muted max-w-lg mx-auto mb-8">
                Ikuti evaluasi singkat untuk mengetahui tingkat literasi keuangan
                Anda dan dapatkan rekomendasi materi yang tepat.
              </p>
              <Link href="/materi" className="btn-primary px-10 py-4 text-[16px]">
                Mulai Evaluasi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
