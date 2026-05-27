"use client";
import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Image from "next/image";
import Link from "next/link";

const transactionSteps = [
  {
    number: 1,
    title: 'Konsumen',
    preTitle: '',
    postTitle: ' melapor ke pihak penyelenggara melalui contact center masing-masing penyelenggara.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5l1.5-2.5 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Penyelenggara',
    preTitle: '',
    postTitle: ' menerima dan menanggapi laporan konsumen.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Konsumen',
    preTitle: '',
    postTitle: ' belum puas, menyampaikan pengaduan ke Bank Indonesia.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    number: 4,
    title: 'Bank Indonesia',
    preTitle: '',
    postTitle: ' memberikan edukasi, literasi dan juga memfasilitasi konsumen untuk menyelesaikan kendala.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: 5,
    title: 'Konsumen',
    preTitle: 'Jika kendala belum selesai, ',
    postTitle: ' dapat mengajukan sengketa melalui LAPS-SK.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const obligations = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
    text: 'Seluruh penyelenggara wajib menyediakan saluran resmi untuk menerima pengaduan konsumen.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <circle cx="9" cy="9" r="1" />
      </svg>
    ),
    text: 'Penyelenggara wajib menyelesaikan pengaduan terkait ketidakpahaman produk/jasa atau permintaan informasi lainnya paling lambat 5 (lima) hari kerja.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    text: 'Pengaduan berupa indikasi pelanggaran ketentuan dan kerugian konsumen diselesaikan paling lambat 20 (dua puluh) hari kerja.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </svg>
    ),
    text: 'Jika ada kondisi tertentu, penyelenggara dapat memperpanjang waktu penyelesaian pengaduan sebanyak 20 (dua puluh) hari kerja, namun wajib diinformasikan kepada konsumen terlebih dahulu.',
  },
];

export default function KontakPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();
  const revealRef3 = useScrollReveal();
  const revealRef4 = useScrollReveal();
  const revealRef5 = useScrollReveal();

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 8000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Prevent vertical page jumps by scrolling the card container horizontally only on mobile viewports
  useEffect(() => {
    if (!isPaused && window.innerWidth < 1024 && scrollRef.current && itemRefs.current[activeStep]) {
      const container = scrollRef.current;
      const element = itemRefs.current[activeStep];
      // Calculate layout coordinates to center the focused card inside the horizontal scrollable viewport
      const scrollPosition = element.offsetLeft - (container.clientWidth / 2) + (element.clientWidth / 2);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });
    }
  }, [activeStep, isPaused]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const contacts = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 21c-4.97-4.97-7-8.58-7-11a7 7 0 1114 0c0 2.42-2.03 6.03-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
      label: "Alamat",
      value: "Kantor Perwakilan Bank Indonesia\nProvinsi Jawa Barat\nJl. Braga No.108, Bandung 40111",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z" /></svg>,
      label: "Telepon",
      value: "(022) 4233453",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4l-10 8L2 4" /></svg>,
      label: "Email",
      value: "kpwbi.jabar@bi.go.id",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
      label: "Jam Operasional",
      value: "Senin – Jumat, 08:00 – 16:00 WIB",
    },
  ];

  return (
    <>
      {/* Section Header: Public support resources contact details */}
      <section ref={revealRef1} className="bg-[#f0f6fc] pt-[140px] md:pt-[160px] pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/batik_merak.png" alt="Motif Batik Merak" fill className="object-cover opacity-[0.03] mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center reveal-base reveal-up delay-1">
          <p className="text-overline text-civic-blue mb-3">Pusat Bantuan</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0a4d94] mb-6">Hubungi Kami.</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Kami siap membantu Anda. Jika Anda mengalami kendala transaksi atau ingin berkonsultasi, Anda dapat mengikuti prosedur pengaduan atau menghubungi kami langsung.
          </p>
        </div>
      </section>

      {/* Transaction handling process flow steps */}
      <section ref={revealRef2} className="bg-[#f0f6fc] py-12 border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#0a4d94] mb-16 whitespace-nowrap tracking-tight reveal-base reveal-up delay-1">
            Transaksi kamu bermasalah?
          </h2>
          
          <div className="relative">
            {/* Visual connecting lines between process steps on desktop */}
            <div className="hidden lg:block absolute top-[80px] left-[10%] right-[10%] h-1 bg-blue-200/60 z-0 rounded-full" />
            <div 
              className="hidden lg:block absolute top-[80px] left-[10%] h-1 bg-[#1875c7] z-0 rounded-full transition-all duration-400 ease-in-out"
              style={{ width: `${(activeStep / 4) * 80}%` }}
            />

            <div 
              ref={scrollRef}
              className="flex lg:grid lg:grid-cols-5 overflow-x-auto snap-x snap-mandatory lg:overflow-x-visible gap-4 lg:gap-4 pb-8 lg:pb-0 relative z-10 scrollbar-hide px-6 lg:px-0 reveal-base reveal-up delay-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {transactionSteps.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                <div 
                  key={idx} 
                  ref={(el) => (itemRefs.current[idx] = el)}
                  className="group cursor-pointer flex-shrink-0 snap-center"
                  onMouseEnter={() => { setActiveStep(idx); setIsPaused(true); }}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  {/* --- Desktop process layout view --- */}
                  <div className="hidden lg:flex flex-col items-center">
                    <div className={`relative mb-6 transform transition-all duration-200 ease-out ${isActive ? '-translate-y-4' : 'group-hover:-translate-y-2'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg absolute -top-4 -left-4 z-20 shadow-md transition-all duration-200 ease-out ${isActive ? 'bg-white text-[#0a4d94] ring-4 ring-white/20 shadow-lg scale-110' : 'bg-[#1875c7] text-white'}`}>
                        {step.number}
                      </div>
                      <div className={`w-40 h-40 rounded-[2rem] shadow-xl flex items-center justify-center transition-all duration-200 ease-out ${isActive ? 'bg-[#0a4d94] text-white shadow-2xl border-transparent' : 'bg-white text-slate-700 shadow-blue-900/5 border border-white group-hover:border-blue-100 group-hover:text-blue-600'}`}>
                        {step.icon}
                      </div>
                    </div>
                    <p className={`text-center text-[15px] leading-relaxed max-w-[200px] transition-colors duration-200 ease-out ${isActive ? 'text-[#0a4d94]' : 'text-slate-600'}`}>
                      {step.preTitle}
                      <strong className={isActive ? 'text-[#0a4d94]' : 'text-[#1a73e8]'}>{step.title}</strong>
                      {step.postTitle}
                    </p>
                  </div>

                  {/* --- Mobile swipable process cards view --- */}
                  <div className={`flex lg:hidden flex-col justify-between w-[280px] h-[360px] p-8 rounded-[2rem] transition-all duration-400 ease-out overflow-hidden shadow-lg border ${isActive ? 'bg-[#0a4d94] border-transparent shadow-[#0a4d94]/30' : 'bg-white border-blue-100 shadow-blue-900/5'}`}>
                    {/* Step illustrative SVG icon */}
                    <div className={`w-12 h-12 flex items-center justify-center transition-colors duration-200 ease-out ${isActive ? 'text-white' : 'text-[#1875c7]'}`}>
                      {step.icon}
                    </div>
                    
                    {/* Step text content container */}
                    <div className="mt-8">
                      <p className={`text-sm font-bold mb-2 transition-colors duration-200 ease-out ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                        0{step.number}.
                      </p>
                      <h3 className={`text-xl font-bold leading-tight mb-2 transition-colors duration-200 ease-out w-full ${isActive ? 'text-white' : 'text-[#0a4d94]'}`}>
                        {step.title}
                      </h3>
                      
                      <div 
                        className={`transition-all duration-400 ease-in-out overflow-hidden ${isActive ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}
                      >
                        <div className={`h-px w-full mb-3 ${isActive ? 'bg-white/20' : 'bg-transparent'}`} />
                        <div className="flex items-start">
                          <p className={`text-[13px] leading-relaxed ${isActive ? 'text-blue-50' : 'text-slate-500'}`}>
                            {step.preTitle}<strong className="font-semibold">{step.title}</strong>{step.postTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>
      </section>

      {/* Provider statutory obligations and SLA constraints */}
      <section ref={revealRef3} className="bg-[#e4eff8] py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/full_mega_mendung.png" alt="Motif Mega Mendung" fill className="object-cover opacity-[0.03] mix-blend-multiply" />
        </div>
        <div className="max-w-5xl mx-auto px-4 lg:px-8 overflow-hidden relative z-10 reveal-base reveal-up delay-1">
          <h2 className="text-[22px] sm:text-2xl md:text-3xl font-bold text-[#0a4d94] mb-10 text-center whitespace-nowrap tracking-tight">
            Kewajiban Penyelenggara
          </h2>
          
          <div className="space-y-6 lg:space-y-4">
            {obligations.map((ob, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-stretch group relative cursor-default">
                {/* Overlapping layout placement positioning icon relative to box */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl shadow-lg flex items-center justify-center text-[#1a73e8] z-20 flex-shrink-0 transition-transform duration-200 ease-out sm:group-hover:scale-[1.03] relative top-4 sm:top-0 sm:left-0 border border-blue-50 sm:border-none">
                  <div className="scale-75 sm:scale-100">{ob.icon}</div>
                </div>
                <div className="bg-[#0a4d94] rounded-2xl sm:rounded-r-3xl sm:rounded-l-md sm:-ml-6 pt-10 pb-6 px-6 sm:py-5 sm:pl-10 sm:pr-6 text-white shadow-md flex-grow min-h-[80px] flex items-center transition-all duration-200 ease-out sm:group-hover:bg-[#0c59a8] w-full text-center sm:text-left">
                  <p className="text-[14px] lg:text-[15px] leading-relaxed font-light w-full">
                    {ob.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact submission form layout block */}
      <section ref={revealRef4} className="bg-canvas section-padding">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* User feedback form fields */}
            <div className="lg:w-3/5 reveal-base reveal-up delay-1">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-caption text-text-primary mb-2">
                    Nama Lengkap <span className="text-error">*</span>
                  </label>
                  <input id="name" type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-5 py-3.5 bg-canvas-warm border border-border rounded-xl text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-civic-blue focus:border-transparent transition-all min-h-[48px]" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-caption text-text-primary mb-2">
                    Email <span className="text-error">*</span>
                  </label>
                  <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="nama@email.com"
                    className="w-full px-5 py-3.5 bg-canvas-warm border border-border rounded-xl text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-civic-blue focus:border-transparent transition-all min-h-[48px]" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-caption text-text-primary mb-2">
                    Nomor Telepon <span className="text-error">*</span>
                  </label>
                  <input id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    placeholder="08123456789"
                    className="w-full px-5 py-3.5 bg-canvas-warm border border-border rounded-xl text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-civic-blue focus:border-transparent transition-all min-h-[48px]" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-caption text-text-primary mb-2">
                    Pesan <span className="text-error">*</span>
                  </label>
                  <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full px-5 py-3.5 bg-canvas-warm border border-border rounded-xl text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-civic-blue focus:border-transparent transition-all resize-none" />
                </div>
                <button type="submit" disabled={status === "sending"}
                  className="btn-primary w-full py-4 text-[16px] disabled:opacity-60">
                  {status === "sending" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                      Mengirim...
                    </span>
                  ) : status === "sent" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      Pesan Terkirim
                    </span>
                  ) : "Kirim Pesan"}
                </button>
              </form>
            </div>

            {/* Physical location addresses and active support phone lines */}
            <div className="lg:w-2/5 reveal-base reveal-up delay-2">
              <div className="bg-surface-card border border-border rounded-2xl p-8">
                <h3 className="text-subheading text-text-primary mb-6">Informasi Kontak</h3>
                <div className="space-y-6">
                  {contacts.map((c) => (
                    <div key={c.label} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-civic-blue-mist flex items-center justify-center text-civic-blue flex-shrink-0">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-overline text-text-tertiary mb-1">{c.label}</p>
                        <p className="text-caption text-text-primary whitespace-pre-line leading-relaxed">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded interactive Google Maps location view */}
      <section className="bg-canvas pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=Jl.%20Braga%20No.108,%20Babakan%20Ciamis,%20Kec.%20Sumur%20Bandung,%20Kota%20Bandung,%20Jawa%20Barat%2040111&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Lokasi KPwBI Jawa Barat" />
          </div>
        </div>
      </section>

      {/* Institutional and government regulatory hotlines and portal shortcuts */}
      <section ref={revealRef5} className="bg-canvas pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10 text-center md:text-left reveal-base reveal-up delay-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a4d94]">Kanal Pengaduan Resmi & Lembaga Terkait</h2>
            <p className="text-slate-500 mt-3 max-w-2xl text-[15px]">Hubungi kanal resmi dan lembaga yang berwenang jika Anda menemukan indikasi penipuan atau layanan keuangan ilegal.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
             
             {/* Primary regulatory contact shortcut card */}
             <div className="bg-gradient-to-br from-[#0a4d94] to-[#1875c7] rounded-[2rem] p-8 lg:p-10 border border-[#0a4d94] shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all reveal-base reveal-up delay-1 flex flex-col md:flex-row md:items-center justify-between group lg:col-span-4 h-full gap-8 lg:gap-12">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-white/15 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-inner">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <h3 className="font-bold text-white text-2xl lg:text-3xl leading-snug mb-3">Kontak BI</h3>
                  <p className="text-blue-100 text-sm max-w-sm leading-relaxed">Hubungi Bank Indonesia melalui kanal resmi untuk bantuan, informasi, atau pengaduan secara langsung.</p>
                </div>
                
                <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 lg:pl-12 flex flex-col justify-center gap-3.5">
                  <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-5 py-3 border border-white/5 w-max max-w-full">
                    <span className="font-bold text-white shrink-0 text-sm">Email</span>
                    <div className="w-px h-4 bg-white/20 mx-1"></div>
                    <a href="mailto:bicara@bi.go.id" className="text-blue-50 hover:text-white hover:underline transition-colors truncate text-[15px]">bicara@bi.go.id</a>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3.5">
                    <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-5 py-3 border border-white/5 w-max">
                      <span className="font-bold text-white shrink-0 text-sm">Telp</span>
                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                      <span className="text-blue-50 text-[15px] font-semibold">131</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-5 py-3 border border-white/5 w-max">
                      <span className="font-bold text-blue-200 shrink-0 text-[13px]">Luar Negeri</span>
                      <div className="w-px h-4 bg-white/20 mx-1"></div>
                      <span className="text-blue-50 text-[15px] font-semibold">1500131</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-5 py-3 border border-white/5 w-max max-w-full">
                    <span className="font-bold text-white shrink-0 text-sm">LISA</span>
                    <div className="w-px h-4 bg-white/20 mx-1"></div>
                    <span className="text-[15px] truncate"><a href="https://wa.me/6281131131131" className="text-blue-50 hover:text-white hover:underline transition-colors font-semibold">081 131 131 131</a> <span className="text-[13px] text-blue-200 ml-1 hidden sm:inline">(WhatsApp)</span></span>
                  </div>
                </div>
             </div>

             {/* Regional provincial representative office card */}
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all reveal-base reveal-up delay-2 flex flex-col group lg:col-span-2 h-full">
                <div className="w-14 h-14 bg-blue-50 text-[#1875c7] rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <h3 className="font-bold text-slate-800 text-[17px] mb-2 leading-snug">KPw BI Provinsi Jawa Barat</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-3">Informasi profil, lokasi, dan layanan Kantor Perwakilan Bank Indonesia Provinsi Jawa Barat.</p>
                <a href="https://www.bi.go.id/id/tentang-bi/profil/organisasi/Pages/Kantor-Perwakilan-Provinsi-Jawa-Barat.aspx" target="_blank" rel="noreferrer" className="text-[14px] text-[#1875c7] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all mt-auto w-max">
                  Lihat Selengkapnya <span aria-hidden="true">&rarr;</span>
                </a>
             </div>

             {/* Official Central Bank conversational portal */}
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all reveal-base reveal-up delay-3 flex flex-col group lg:col-span-2 h-full">
                <div className="w-14 h-14 bg-blue-50 text-[#1875c7] rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <h3 className="font-bold text-slate-800 text-[17px] mb-2 leading-snug">Webportal BI</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-3">Website aplikasi portal dengan salah satu fungsi menerima pengaduan konsumen.</p>
                <a href="https://bicara131.bi.go.id/" target="_blank" rel="noreferrer" className="text-[14px] text-[#1875c7] font-bold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all mt-auto w-max">
                  Kunjungi Website <span aria-hidden="true">&rarr;</span>
                </a>
             </div>

             {/* Integrated Financial Services Authority (OJK) card */}
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-900/5 transition-all reveal-base reveal-up delay-4 flex flex-col group lg:col-span-2 h-full">
                <div className="w-24 h-10 relative mb-6 transition-transform group-hover:scale-105 origin-left">
                  <Image src="/OJK.png" alt="Logo OJK" fill sizes="96px" className="object-contain object-left" />
                </div>
                <h3 className="font-bold text-slate-800 text-[17px] mb-5 leading-snug flex-1">Otoritas Jasa Keuangan</h3>
                <ul className="space-y-3 text-[14px] text-slate-600 mt-auto border-t border-slate-100 pt-5">
                  <li className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z"/></svg>
                    <span>157 <span className="text-slate-400 text-[13px]">(Pulsa lokal)</span></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    <a href="https://wa.me/6281157157157" className="hover:text-emerald-600 transition-colors">081-157-157-157</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
                    <a href="mailto:konsumen@ojk.go.id" className="hover:text-blue-600 transition-colors break-all">konsumen@ojk.go.id</a>
                  </li>
                </ul>
             </div>

             {/* Digital infrastructure ministry reporting links card */}
             <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all reveal-base reveal-up delay-5 flex flex-col group lg:col-span-2 h-full">
                <div className="w-28 h-10 relative mb-6 transition-transform group-hover:scale-105 origin-left">
                  <Image src="/Komdigi.png" alt="Logo Komdigi" fill sizes="112px" className="object-contain object-left" />
                </div>
                <h3 className="font-bold text-slate-800 text-[17px] mb-5 leading-snug flex-1">Kementerian Komdigi</h3>
                <ul className="space-y-4 text-[14px] text-slate-700 font-medium mt-auto border-t border-slate-100 pt-5">
                  <li>
                    <a href="https://cekrekening.id" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/link">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover/link:bg-indigo-100 transition-colors shrink-0"><span className="text-indigo-500 text-sm font-bold">&rarr;</span></div> 
                      CekRekening.id
                    </a>
                  </li>
                  <li>
                    <a href="https://aduannomor.id" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/link">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover/link:bg-indigo-100 transition-colors shrink-0"><span className="text-indigo-500 text-sm font-bold">&rarr;</span></div> 
                      AduanNomor.id
                    </a>
                  </li>
                  <li>
                    <a href="https://aduankonten.id" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-indigo-600 transition-colors group/link">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover/link:bg-indigo-100 transition-colors shrink-0"><span className="text-indigo-500 text-sm font-bold">&rarr;</span></div> 
                      AduanKonten.id
                    </a>
                  </li>
                </ul>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
