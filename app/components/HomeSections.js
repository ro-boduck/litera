"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "../../lib/data"; // Need to export Icons from data.js

const stats = [
  { value: "24+", label: "Materi Edukasi", icon: Icons.book },
  { value: "15.000+", label: "Peserta Didik", icon: Icons.users },
  { value: "27", label: "Kota/Kabupaten", icon: Icons.map },
  { value: "98%", label: "Kepuasan", icon: Icons.star },
];

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

function StatCard({ stat, delay }) {
  const { ref, display } = useCounter(stat.value);
  return (
    <div ref={ref} className={`bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl shadow-blue-900/5 rounded-3xl p-6 sm:p-8 transform transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-100 group animate-fade-up delay-${delay}`}>
      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        <div dangerouslySetInnerHTML={{ __html: stat.icon }} />
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">{display}</p>
      <p className="text-sm sm:text-base font-medium text-slate-500">{stat.label}</p>
    </div>
  );
}

export function HomeStats() {
  return (
    <section className="relative z-30 px-6 lg:px-8 max-w-6xl mx-auto py-16 lg:py-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} delay={Math.min(i + 1, 6)} />
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Icons.shield, title: "Pencegahan Penipuan", desc: "Kemampuan mengidentifikasi investasi bodong dan skema penipuan digital yang marak beredar." },
  { icon: Icons.wallet, title: "Perencanaan Masa Depan", desc: "Menyiapkan dana darurat, pendidikan, dan pensiun dengan instrumen yang tepat dan aman." },
  { icon: Icons.chart, title: "Kesehatan Finansial", desc: "Mengelola hutang produktif dan membatasi hutang konsumtif untuk ketenangan finansial." },
];

export function HomeFeatures() {
  return (
    <section className="bg-civic-navy section-padding relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/mega_mendung.jpeg" alt="Motif Mega Mendung" fill sizes="100vw" className="object-cover opacity-[0.05] mix-blend-luminosity" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-civic-navy via-civic-navy/90 to-transparent" />
      </div>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-2/5">
            <p className="text-overline text-blue-400 mb-3">Mengapa Penting</p>
            <h2 className="text-display text-white mb-6">Literasi yang Menentukan Masa Depan</h2>
            <p className="text-body text-text-on-dark-muted mb-8">
              Berdasarkan SNLIK, pemahaman finansial yang baik berkorelasi langsung dengan kesejahteraan. Kami hadir untuk menutup kesenjangan literasi tersebut.
            </p>
          </div>
          <div className="lg:w-3/5 space-y-6">
            {features.map((f, i) => (
              <div key={i} className="flex gap-5 items-start group bg-white/[0.03] rounded-2xl p-6 border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all">
                <div className="w-12 h-12 rounded-xl bg-civic-blue/20 flex items-center justify-center text-blue-300 flex-shrink-0 group-hover:bg-civic-blue/30 transition-colors">
                  <div dangerouslySetInnerHTML={{ __html: f.icon }} />
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
  );
}

export function HomeProfile() {
  return (
    <section className="bg-white section-padding relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-1/2 relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
             <Image src="/BI_Building.png" alt="Gedung Bank Indonesia" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" loading="lazy" />
          </div>
          <div className="w-full md:w-1/2">
             <p className="text-overline text-civic-blue mb-3">Profil Singkat</p>
             <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Bank Indonesia Jawa Barat</h2>
             <p className="text-slate-600 mb-6 leading-relaxed">
               Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat memiliki peran strategis dalam menjaga stabilitas ekonomi dan mendorong pertumbuhan ekonomi yang inklusif di wilayah Jawa Barat. Melalui program edukasi seperti platform LITERA ini, kami berkomitmen untuk meningkatkan literasi keuangan masyarakat secara komprehensif.
             </p>
             <Link href="/tentang" className="inline-flex items-center gap-2 text-civic-blue font-bold hover:gap-4 transition-all">
               Pelajari Lebih Lanjut <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section className="bg-canvas-warm section-padding relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image src="/batik_merak.png" alt="Motif Batik Merak" fill sizes="100vw" className="object-cover opacity-[0.03] mix-blend-multiply" loading="lazy" />
      </div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
           <p className="text-overline text-civic-blue mb-3">Bantuan Singkat</p>
           <h2 className="text-display text-text-primary">Pertanyaan Umum</h2>
        </div>
        <div className="space-y-4">
          <details className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 open:shadow-md transition-all">
            <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none text-slate-800">
              Apakah platform ini 100% gratis?
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="text-slate-500 mt-4 leading-relaxed group-open:animate-fade-in">
              Ya, platform edukasi LITERA disediakan sepenuhnya gratis oleh Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat untuk seluruh lapisan masyarakat.
            </p>
          </details>
          <details className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 open:shadow-md transition-all">
            <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none text-slate-800">
              Apakah saya mendapat sertifikat setelah belajar?
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="text-slate-500 mt-4 leading-relaxed group-open:animate-fade-in">
              Saat ini platform difokuskan pada peningkatan literasi pribadi. Namun, Anda dapat mengukur kemampuan Anda secara mandiri melalui fitur evaluasi di akhir materi.
            </p>
          </details>
          <details className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 open:shadow-md transition-all">
            <summary className="flex justify-between items-center font-bold text-lg cursor-pointer list-none text-slate-800">
              Bagaimana jika ada kendala atau butuh bantuan lebih lanjut?
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="text-slate-500 mt-4 leading-relaxed group-open:animate-fade-in">
              Anda dapat menghubungi kami melalui formulir di halaman Kontak atau via nomor telepon resmi yang tertera. Tim layanan kami siap membantu di jam operasional.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

export function HomeCta() {
  return (
    <section className="bg-canvas section-padding">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="relative bg-civic-navy rounded-3xl p-12 lg:p-16 text-center overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image src="/full_mega_mendung.png" alt="Motif Mega Mendung" fill sizes="100vw" className="object-cover opacity-15 mix-blend-luminosity scale-125 rotate-6" loading="lazy" />
            <div className="absolute inset-0 bg-civic-navy/80" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Uji Pemahaman Anda</h2>
            <p className="text-lg text-blue-100 mb-8">
              Akses puluhan materi eksklusif dan evaluasi tingkat literasi finansial Anda
              melalui post-test interaktif kami.
            </p>
            <Link href="/materi" className="inline-flex items-center gap-2 bg-white text-civic-blue hover:bg-blue-50 font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
              Jelajahi Materi <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
