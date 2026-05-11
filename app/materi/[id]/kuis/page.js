"use client";
import { useState, use } from "react";
import Link from "next/link";

/* ── Data ── */
const materialData = {
  1: {
    category: "Literasi Digital",
    title: "Keamanan Transaksi Digital di Era Modern",
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

export default function QuizPage({ params }) {
  const resolvedParams = use(params);
  const data = materialData[resolvedParams.id] || fallback;

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    data.quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    setScore(Math.round((correct / data.quiz.length) * 100));
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-civic-navy min-h-[calc(100vh-64px)] py-16 mega-mendung relative overflow-hidden flex flex-col justify-center">
        <div className="ornament-cloud w-[600px] h-[600px] -top-32 -right-32" />
        <div className="relative max-w-[720px] w-full mx-auto px-6">
          
          {/* Back button */}
          <Link href={`/materi/${resolvedParams.id}`} className="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Kembali ke Materi
          </Link>

          <p className="text-overline text-blue-300 mb-3">Post-Test: {data.category}</p>
          <h1 className="text-display text-white mb-3">Uji Pemahaman Anda.</h1>
          <p className="text-body text-text-on-dark-muted mb-10">
            Jawab pertanyaan berikut untuk mengukur pemahaman Anda tentang materi "{data.title}".
          </p>

          <div className="space-y-6">
            {data.quiz.map((q, qi) => (
              <div key={qi} className="bg-white/[0.04] rounded-2xl p-6 border border-white/[0.08]">
                <div className="flex gap-3 mb-5">
                  <span className="w-7 h-7 rounded-full bg-civic-blue/30 text-blue-200 text-[12px] font-bold flex items-center justify-center flex-shrink-0">{qi + 1}</span>
                  <p className="text-body-strong text-white">{q.q}</p>
                </div>
                <div className="space-y-2.5 ml-10">
                  {q.options.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers({ ...answers, [qi]: oi })}
                      className={`w-full text-left px-4 py-3.5 rounded-xl text-caption transition-all min-h-[44px]
                        ${answers[qi] === oi
                          ? "bg-civic-blue text-white border border-civic-blue shadow-lg shadow-civic-blue/20"
                          : "bg-white/[0.03] text-white/80 border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.16]"
                        }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-fine text-text-on-dark-muted">
              Anda telah menjawab {Object.keys(answers).length} dari {data.quiz.length} pertanyaan.
            </p>
            <button onClick={handleSubmit} disabled={Object.keys(answers).length < data.quiz.length}
              className="btn-primary px-10 py-4 w-full sm:w-auto disabled:opacity-30 disabled:cursor-not-allowed">
              Kirim Jawaban
            </button>
          </div>
        </div>
      </section>

      {/* ═══ SCORE MODAL ═══ */}
      {submitted && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6"
             style={{ backgroundColor: "rgba(27, 45, 79, 0.7)", backdropFilter: "blur(16px)" }}>
          <div className="bg-surface-card rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-scale-in">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                <circle cx="64" cy="64" r="56" fill="none"
                  stroke={score >= 80 ? "var(--color-success)" : score >= 50 ? "var(--color-warning)" : "var(--color-error)"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 352} 352`}
                  style={{ transition: "stroke-dasharray 1s ease-out" }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[28px] font-bold text-text-primary">{score}%</span>
            </div>
            <h3 className="text-heading text-text-primary mb-2">
              {score >= 80 ? "Luar Biasa!" : score >= 50 ? "Cukup Baik" : "Perlu Belajar Lagi"}
            </h3>
            <p className="text-caption text-text-tertiary mb-8">
              {score >= 80 ? "Pemahaman Anda sangat baik tentang materi ini." : score >= 50 ? "Coba baca ulang bagian yang kurang dipahami." : "Disarankan membaca ulang materi sebelum mencoba lagi."}
            </p>
            <div className="flex flex-col gap-3">
              <Link href={`/materi/${resolvedParams.id}`} className="btn-primary py-3.5">Kembali ke Materi</Link>
              <button onClick={() => { setSubmitted(false); setAnswers({}); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="btn-secondary py-3.5">Ulangi Post-Test</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
