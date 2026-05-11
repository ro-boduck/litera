"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";

/* ── Data ── */
const materialData = {
  1: {
    category: "Literasi Digital",
    title: "Keamanan Transaksi Digital di Era Modern",
    time: "8 menit",
    date: "15 Mei 2026",
    content: [
      { type: "p", text: "Di era transformasi digital yang semakin pesat, transaksi keuangan secara daring telah menjadi bagian tak terpisahkan dari kehidupan sehari-hari masyarakat Indonesia. Mulai dari pembayaran melalui QRIS, transfer antarbank melalui aplikasi mobile banking, hingga belanja online — semuanya membutuhkan pemahaman yang baik tentang keamanan digital." },
      { type: "h2", text: "Ancaman Umum dalam Transaksi Digital" },
      { type: "p", text: "Berdasarkan data Bank Indonesia, kasus penipuan digital meningkat signifikan selama beberapa tahun terakhir. Berikut adalah beberapa ancaman yang paling sering dihadapi oleh masyarakat:" },
      { type: "ul", items: ["Phishing — penipuan melalui email, SMS, atau situs palsu yang meniru institusi resmi untuk mencuri data pribadi.", "Social Engineering — manipulasi psikologis untuk membujuk korban memberikan informasi sensitif seperti OTP atau PIN.", "Skimming — pencurian data kartu debit/kredit melalui perangkat ilegal yang dipasang pada mesin ATM atau EDC.", "Malware — perangkat lunak berbahaya yang disisipkan ke dalam aplikasi atau tautan untuk mencuri data keuangan."] },
      { type: "h2", text: "Langkah-Langkah Perlindungan" },
      { type: "callout", text: "Bank Indonesia dan OJK menghimbau seluruh masyarakat untuk tidak pernah membagikan kode OTP, PIN, atau CVV kepada siapa pun, termasuk pihak yang mengaku dari bank." },
      { type: "p", text: "Untuk melindungi diri dari ancaman tersebut, berikut adalah langkah-langkah yang perlu dilakukan:" },
      { type: "ol", items: ["Aktifkan autentikasi dua faktor (2FA) pada semua akun keuangan digital Anda.", "Gunakan kata sandi yang kuat dan berbeda untuk setiap platform.", "Selalu verifikasi URL situs web sebelum memasukkan data sensitif.", "Perbarui aplikasi mobile banking dan dompet digital secara berkala.", "Hindari menggunakan WiFi publik untuk transaksi keuangan."] },
      { type: "h2", text: "Mengenali Tanda-Tanda Penipuan" },
      { type: "p", text: "Penipuan digital sering kali dirancang dengan sangat meyakinkan. Perhatikan tanda-tanda berikut: permintaan informasi sensitif melalui telepon atau pesan singkat, tawaran hadiah atau investasi dengan keuntungan tidak wajar, serta tekanan untuk bertindak segera tanpa memberi waktu berpikir." },
      { type: "p", text: "Jika Anda mencurigai adanya aktivitas penipuan, segera hubungi bank terkait dan laporkan ke kanal resmi Bank Indonesia atau OJK. Melaporkan lebih awal dapat mencegah kerugian yang lebih besar." },
    ],
    quiz: [
      { q: "Apa yang dimaksud dengan phishing?", options: ["Teknik memancing ikan secara modern", "Penipuan melalui situs/email palsu untuk mencuri data pribadi", "Sistem keamanan perbankan terbaru", "Aplikasi transfer uang antar bank"], answer: 1 },
      { q: "Manakah yang TIDAK boleh dibagikan kepada siapa pun?", options: ["Nomor rekening bank", "Nama lengkap", "Kode OTP dan PIN", "Alamat email"], answer: 2 },
      { q: "Langkah pertama mengamankan akun keuangan digital?", options: ["Menggunakan WiFi publik", "Membagikan password kepada keluarga", "Mengaktifkan autentikasi dua faktor (2FA)", "Mengabaikan pembaruan aplikasi"], answer: 2 },
      { q: "Tanda penipuan digital yang perlu diwaspadai:", options: ["Notifikasi resmi dari aplikasi bank", "Permintaan informasi sensitif dengan tekanan waktu", "Email konfirmasi transaksi Anda", "SMS berisi saldo rekening"], answer: 1 },
      { q: "Jika mencurigai penipuan, apa yang harus dilakukan?", options: ["Membalas pesan penipu", "Menunggu beberapa hari", "Menghubungi bank dan melaporkan ke BI/OJK", "Menghapus aplikasi mobile banking"], answer: 2 },
    ],
  },
};

const fallback = materialData[1];

export default function MateriDetailPage({ params }) {
  const resolvedParams = use(params);
  const data = materialData[resolvedParams.id] || fallback;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("article-body");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top + 200);
      const pct = Math.min(100, (scrolled / (total - window.innerHeight + 200)) * 100);
      setProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[60]">
        <div className="h-full progress-shimmer transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Header ── */}
      <section className="bg-canvas-warm section-padding pb-10">
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
          <div className="bg-civic-navy rounded-3xl p-12 relative overflow-hidden mega-mendung">
            <div className="ornament-cloud w-[400px] h-[400px] -top-20 -left-20" />
            <div className="relative">
              <p className="text-overline text-blue-300 mb-3">Selesai Membaca?</p>
              <h2 className="text-display text-white mb-4">Uji pemahaman Anda.</h2>
              <p className="text-body text-text-on-dark-muted max-w-lg mx-auto mb-8">
                Ikuti post-test singkat untuk mengevaluasi pemahaman Anda tentang {data.title}.
              </p>
              <Link href={`/materi/${resolvedParams.id}/kuis`} className="btn-primary px-10 py-4 text-[16px]">
                Mulai Post-Test
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
