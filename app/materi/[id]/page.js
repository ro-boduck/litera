"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MateriDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/materials/${id}`);
        if (!res.ok) throw new Error('Data tidak ditemukan');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.min(100, (window.scrollY / total) * 100);
      setProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-warm pt-[120px] pb-20">
        <div className="max-w-3xl mx-auto px-6">
           <div className="animate-pulse">
             <div className="h-4 bg-slate-200 rounded-full w-24 mb-6"></div>
             <div className="h-10 bg-slate-200 rounded-lg w-full mb-4"></div>
             <div className="h-10 bg-slate-200 rounded-lg w-2/3 mb-10"></div>
             
             <div className="flex gap-4 mb-12">
                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                <div className="h-6 bg-slate-200 rounded-full w-24"></div>
             </div>

             <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                <div className="h-4 bg-slate-200 rounded-full w-4/5"></div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas-warm">
        <h1 className="text-2xl font-bold text-slate-800">Materi tidak ditemukan.</h1>
      </div>
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[60]">
        <div className="h-full progress-shimmer transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Header ── */}
      <section className="bg-canvas-warm pt-[140px] md:pt-[160px] pb-12">
        <div className="max-w-[720px] mx-auto px-6">
          <nav className="flex items-center gap-2 text-fine text-text-tertiary mb-8">
            <Link href="/" className="hover:text-civic-blue transition-colors">Beranda</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <Link href="/materi" className="hover:text-civic-blue transition-colors">Materi</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-text-secondary">{data.category}</span>
          </nav>
          <span className="text-overline text-civic-blue mb-3 block">{data.category}</span>
          <h1 className="text-display text-text-primary mb-4">{data.title}</h1>
          <div className="flex items-center gap-4 text-caption text-text-tertiary">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              {data.time}
            </span>
            <span>•</span>
            <span>{data.date}</span>
          </div>
        </div>
      </section>

      {/* ── Article ── */}
      <section className="bg-canvas" id="article-body">
        <div className="max-w-[720px] mx-auto px-6 py-16">
          {data.content.map((block, i) => {
            switch (block.type) {
              case "h2": return <h2 key={i} className="text-heading text-text-primary mt-12 mb-4">{block.text}</h2>;
              case "p": return <p key={i} className="text-body text-text-primary mb-6">{block.text}</p>;
              case "ul": return (
                <ul key={i} className="space-y-3 mb-6 ml-1">{block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-body text-text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-civic-blue mt-2.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}</ul>
              );
              case "ol": return (
                <ol key={i} className="space-y-3 mb-6 ml-1">{block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-body text-text-primary">
                    <span className="w-6 h-6 rounded-full bg-civic-blue-mist text-civic-blue text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{j + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}</ol>
              );
              case "callout": return (
                <div key={i} className="bg-civic-blue-mist border-l-[3px] border-civic-blue rounded-r-xl p-5 mb-6">
                  <div className="flex gap-3 items-start">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-civic-blue)" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                    <p className="text-body text-text-primary">{block.text}</p>
                  </div>
                </div>
              );
              default: return null;
            }
          })}
        </div>
      </section>

      {/* ═══ CTA POST-TEST ═══ */}
      <section className="bg-canvas section-padding">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <div className="relative bg-civic-navy rounded-3xl p-12 text-center overflow-hidden shadow-2xl shadow-blue-900/20">
            {/* Background Image - Mega Mendung Layer 3 */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image src="/mega_mendung.jpeg" alt="Motif Mega Mendung" fill className="object-cover opacity-[0.12] mix-blend-color-dodge -scale-y-100" />
              <div className="absolute inset-0 bg-civic-navy/85 mix-blend-multiply" />
            </div>
            <div className="ornament-cloud w-[400px] h-[400px] -top-20 -left-20 z-10" />
            <div className="relative z-20">
              <p className="text-overline text-blue-300 mb-3">Selesai Membaca?</p>
              <h2 className="text-display text-white mb-4">Uji pemahaman Anda.</h2>
              <p className="text-body text-text-on-dark-muted max-w-lg mx-auto mb-8">
                Ikuti post-test singkat untuk mengevaluasi pemahaman Anda tentang {data.title}.
              </p>
              <Link href={`/materi/${id}/kuis`} className="btn-primary px-10 py-4 text-[16px]">
                Mulai Post-Test
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
