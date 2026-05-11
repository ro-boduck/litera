import { useState } from "react";

export default function QuizBuilder({ quiz, onChange }) {
  const addQuestion = () => {
    onChange([...quiz, { q: "", options: ["", "", "", ""], answer: 0 }]);
  };

  const updateQuestion = (idx, field, val) => {
    const newQuiz = [...quiz];
    newQuiz[idx][field] = val;
    onChange(newQuiz);
  };

  const updateOption = (qIdx, oIdx, val) => {
    const newQuiz = [...quiz];
    newQuiz[qIdx].options[oIdx] = val;
    onChange(newQuiz);
  };

  const removeQuestion = (idx) => {
    const newQuiz = [...quiz];
    newQuiz.splice(idx, 1);
    onChange(newQuiz);
  };

  return (
    <div className="space-y-6">
      {quiz.map((q, qIdx) => (
        <div key={qIdx} className="p-4 rounded-xl border" style={{ background: "white", borderColor: "#E2E8F0" }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-700">Pertanyaan {qIdx + 1}</span>
            <button type="button" onClick={() => removeQuestion(qIdx)} className="text-xs text-red-500 hover:underline">Hapus</button>
          </div>
          <input
            type="text"
            placeholder="Tulis pertanyaan..."
            value={q.q}
            onChange={(e) => updateQuestion(qIdx, "q", e.target.value)}
            className="w-full mb-3 px-3 py-2 text-sm rounded border outline-none focus:border-blue-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`answer-${qIdx}`}
                  checked={q.answer === oIdx}
                  onChange={() => updateQuestion(qIdx, "answer", oIdx)}
                  className="w-4 h-4 text-blue-600"
                  title="Tandai sebagai jawaban benar"
                />
                <input
                  type="text"
                  placeholder={`Opsi ${["A", "B", "C", "D"][oIdx]}`}
                  value={opt}
                  onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded border outline-none ${q.answer === oIdx ? "border-green-500 bg-green-50" : "focus:border-blue-500"}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={addQuestion} className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
        + Tambah Pertanyaan Kuis
      </button>
    </div>
  );
}
