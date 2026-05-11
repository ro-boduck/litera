"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── SVG Icons ── */
const CategoryIcons = {
  "Semua": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  "Literasi Digital": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>,
  "Perencanaan Keuangan": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
  "Investasi": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  "Perbankan": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>,
  "UMKM": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
};

const MaterialIcons = {
  lock: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
  chart: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
  trending: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  bank: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>,
  store: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  phone: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>,
  shield: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  money: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  percent: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>,
};

const categories = ["Semua", "Literasi Digital", "Perencanaan Keuangan", "Investasi", "Perbankan", "UMKM"];

export default function MateriPage() {
  const [active, setActive] = useState("Semua");
  const [allMaterials, setAllMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/materials");
        if (res.ok) {
          const data = await res.json();
          setAllMaterials(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = active === "Semua" ? allMaterials : allMaterials.filter((m) => m.cat === active);

  return (
    <>
      {/* ── Header ── */}
      <section className="bg-canvas-warm pt-[140px] md:pt-[160px] pb-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/batik_merak.png" alt="Motif Batik Merak" fill className="object-cover opacity-[0.04] mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <p className="text-overline text-civic-blue mb-3">Katalog Materi</p>
          <h1 className="text-hero text-text-primary mb-4">Materi Edukasi.</h1>
          <p className="text-body text-text-secondary max-w-xl">
            Topik-topik yang dirancang untuk meningkatkan wawasan dan kemampuan
            finansial Anda.
          </p>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="border-b border-border bg-canvas">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex gap-2 lg:justify-center overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`inline-flex items-center gap-1.5 lg:gap-2 whitespace-nowrap px-3 lg:px-4 py-2 lg:py-2.5 rounded-full text-[13px] lg:text-[14px] font-medium transition-all min-h-[38px] lg:min-h-[44px]
                  ${active === cat
                    ? "bg-civic-blue text-white shadow-md shadow-civic-blue/20"
                    : "bg-surface-card text-text-secondary border border-border hover:border-civic-blue/30 hover:text-text-primary"
                  }`}
              >
                {CategoryIcons[cat]}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="bg-canvas section-padding pt-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6 animate-pulse bg-white border border-border/50">
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl mb-6"></div>
                  <div className="w-1/3 h-3 bg-slate-200 rounded-full mb-3"></div>
                  <div className="w-3/4 h-5 bg-slate-200 rounded-full mb-4"></div>
                  <div className="w-full h-3 bg-slate-200 rounded-full mb-2"></div>
                  <div className="w-5/6 h-3 bg-slate-200 rounded-full mb-6"></div>
                  <div className="w-1/2 h-4 bg-slate-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-tertiary text-body">Belum ada materi untuk kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((m, i) => (
                <Link key={m.id} href={`/materi/${m.id}`} className={`card group animate-fade-up delay-${Math.min(i + 1, 6)}`}>
                  <div className="aspect-[5/3] bg-gradient-to-br from-civic-blue-mist to-canvas-warm flex items-center justify-center relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-civic-blue group-hover:scale-110 transition-transform duration-300">
                      {MaterialIcons[m.icon]}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-overline text-civic-blue">{m.cat}</span>
                      <span className="text-fine text-text-tertiary">{m.time}</span>
                    </div>
                    <h3 className="text-subheading text-text-primary mb-2 group-hover:text-civic-blue transition-colors">{m.title}</h3>
                    <p className="text-caption text-text-tertiary mb-4 line-clamp-2">{m.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-civic-blue group-hover:gap-3 transition-all">
                      Mulai belajar
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
