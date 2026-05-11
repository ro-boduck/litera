"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";

export default function QuizPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(`/api/materi/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (submitted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [submitted]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas-warm">
        <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !data.quiz || data.quiz.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas-warm gap-4">
        <h2 className="text-xl font-bold text-slate-800">Kuis belum tersedia untuk materi ini.</h2>
        <Link href={`/materi/${id}`} className="text-civic-blue font-medium hover:underline">Kembali ke Materi</Link>
      </div>
    );
  }

  const quiz = data.quiz;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.length) * 100;

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.answer) correct++; });
    setScore(Math.round((correct / quiz.length) * 100));
    window.scrollTo({ top: 0, behavior: "instant" });
    setSubmitted(true);
  };



  return (
    <>
      <section className="bg-gradient-to-b from-blue-50/80 via-white to-canvas-warm min-h-[calc(100vh)] pt-[140px] md:pt-[160px] pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/10 blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-[800px] mx-auto px-6">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Link href={`/materi/${id}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-medium bg-white/50 px-4 py-2 rounded-full border border-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Kembali ke Materi
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Evaluasi Pemahaman</h1>
              <p className="text-slate-500 text-sm md:text-base font-medium">Topik: {data.title}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[200px]">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>Progress</span>
                  <span className="text-blue-600">{answeredCount} / {quiz.length}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {quiz.map((q, qi) => (
              <div key={qi} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white shadow-xl shadow-blue-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 animate-fade-up delay-1">
                <div className="flex gap-4 mb-6">
                  <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 text-[14px] font-bold flex items-center justify-center flex-shrink-0 border border-blue-100">{qi + 1}</span>
                  <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug pt-1.5">{q.q}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 md:ml-14">
                  {q.options.map((opt, oi) => (
                    <button key={oi} onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 border-2
                        ${submitted
                          ? oi === q.answer
                            ? "bg-emerald-50 text-emerald-700 border-emerald-400"
                            : answers[qi] === oi
                              ? "bg-red-50 text-red-600 border-red-300"
                              : "bg-white text-slate-400 border-slate-100"
                          : answers[qi] === oi
                            ? "bg-blue-50/50 text-blue-700 border-blue-500 shadow-md shadow-blue-500/20"
                            : "bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
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
                {submitted && q.explanation && (
                  <div className="mt-4 ml-0 md:ml-14 p-4 rounded-xl bg-blue-50 text-sm text-slate-700">
                    <span className="font-semibold text-blue-700">Penjelasan: </span>{q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          {!submitted && (
            <div className="mt-12 flex justify-end">
              <button onClick={handleSubmit} disabled={answeredCount < quiz.length}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                  answeredCount < quiz.length
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95"
                }`}>
                Kirim Jawaban Evaluasi
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Score Modal — fixed center, full-page blur overlay */}
      {submitted && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
          <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl animate-scale-in" style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)" }}>
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
              {score >= 80 ? "Luar Biasa!" : score >= 50 ? "Cukup Baik!" : "Perlu Belajar Lagi"}
            </h3>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium">
              {score >= 80 ? "Pemahaman Anda sangat luar biasa tentang materi ini." : score >= 50 ? "Coba baca ulang beberapa bagian yang terlewat." : "Disarankan membaca ulang materi sebelum mencoba lagi."}
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/materi" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-full transition-all duration-300">
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
