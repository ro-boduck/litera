"use client";
import { useState } from "react";
import Image from "next/image";

export default function KontakPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1200);
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
      {/* ── Header ── */}
      <section className="bg-canvas-warm pt-[140px] md:pt-[160px] pb-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/batik_merak.png" alt="Motif Batik Merak" fill className="object-cover opacity-[0.04] mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <p className="text-overline text-civic-blue mb-3">Kontak</p>
          <h1 className="text-hero text-text-primary mb-4">Hubungi Kami.</h1>
          <p className="text-body text-text-secondary max-w-xl">
            Kami siap membantu Anda. Hubungi kami melalui formulir atau kunjungi kantor kami.
          </p>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="bg-canvas section-padding pt-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Form */}
            <div className="lg:w-3/5">
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

            {/* Right: Contact Info */}
            <div className="lg:w-2/5">
              <div className="bg-surface-card border border-border rounded-2xl p-8 sticky top-24">
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

      {/* ── Map ── */}
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
    </>
  );
}
