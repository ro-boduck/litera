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

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / data.quiz.length) * 100;

  const handleSubmit = () => {
    let correct = 0;
    data.quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    setScore(Math.round((correct / data.quiz.length) * 100));
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50/80 via-white to-canvas-warm min-h-[calc(100vh)] pt-[140px] md:pt-[160px] pb-24 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-[800px] mx-auto px-6">
          
          {/* Header & Back button */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Link href={`/materi/${resolvedParams.id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium bg-white/50 px-4 py-2 rounded-full border border-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Kembali ke Materi
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Evaluasi Pemahaman</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Topik: {data.title}</p>
            </div>
            
            {/* Progress indicator */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[200px]">
               <div className="flex-1">
                 <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                   <span>Progress</span>
                   <span className="text-blue-600">{answeredCount} / {data.quiz.length}</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            {data.quiz.map((q, qi) => (
              <div key={qi} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white shadow-xl shadow-blue-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 animate-fade-up delay-1">
                <div className="flex gap-4 mb-6">
                  <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 text-[14px] font-bold flex items-center justify-center flex-shrink-0 border border-blue-100">{qi + 1}</span>
                  <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug pt-1.5">{q.q}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 md:ml-14">
                  {q.options.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers({ ...answers, [qi]: oi })}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 border-2
                        ${answers[qi] === oi
                          ? "bg-blue-50/50 text-blue-700 border-blue-500 shadow-md shadow-blue-500/20 transform scale-[1.02]"
                          : "bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-lg"
                        }`}>
                      <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${answers[qi] === oi ? 'border-blue-500' : 'border-slate-300'}`}>
                           {answers[qi] === oi && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                         </div>
                         <span>{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="mt-12 flex justify-end">
            <button onClick={handleSubmit} disabled={answeredCount < data.quiz.length}
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                answeredCount < data.quiz.length 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.4)]"
              }`}>
              <span>Kirim Jawaban Evaluasi</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ SCORE MODAL ═══ */}
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl border border-white animate-scale-in">
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle cx="64" cy="64" r="56" fill="none"
                  stroke={score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444"}
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 352} 352`}
                  style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-extrabold text-slate-800">{score}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Skor</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {score >= 80 ? "Luar Biasa! 🎉" : score >= 50 ? "Cukup Baik! 👍" : "Perlu Belajar Lagi 📚"}
            </h3>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium">
              {score >= 80 ? "Pemahaman Anda sangat luar biasa tentang materi ini. Pertahankan!" : score >= 50 ? "Anda cukup memahami materi ini, namun coba baca ulang beberapa bagian yang terlewat." : "Jangan menyerah! Disarankan membaca ulang materi perlahan sebelum mencoba lagi."}
            </p>
            
            <div className="flex flex-col gap-3">
              <Link href={`/materi/${resolvedParams.id}`} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Lanjut ke Katalog Materi
              </Link>
              <button onClick={() => { setSubmitted(false); setAnswers({}); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-full transition-all duration-300">
                Ulangi Evaluasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
