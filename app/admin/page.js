"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCMS() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/materials");
      const data = await res.json();
      setMaterials(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data dari API CMS", error);
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setEditingId(id);
      setIsCreating(false);
      const res = await fetch(`http://localhost:4000/api/materials/${id}`);
      const data = await res.json();
      setFormData({
        ...data,
        content: JSON.stringify(data.content, null, 2),
        quiz: JSON.stringify(data.quiz, null, 2)
      });
    } catch (error) {
      alert("Gagal memuat detail materi.");
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      cat: "Umum",
      title: "",
      desc: "",
      time: "5 mnt",
      icon: "book",
      level: "Pemula",
      content: "[]",
      quiz: "[]"
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Anda yakin ingin menghapus materi ini?")) return;
    try {
      await fetch(`http://localhost:4000/api/materials/${id}`, { method: "DELETE" });
      fetchMaterials();
    } catch (error) {
      alert("Gagal menghapus.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validate JSON
      const parsedContent = JSON.parse(formData.content || "[]");
      const parsedQuiz = JSON.parse(formData.quiz || "[]");

      const payload = {
        ...formData,
        content: parsedContent,
        quiz: parsedQuiz
      };

      const url = isCreating 
        ? `http://localhost:4000/api/materials`
        : `http://localhost:4000/api/materials/${editingId}`;
      const method = isCreating ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Berhasil disimpan!");
        setEditingId(null);
        setIsCreating(false);
        fetchMaterials();
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      alert("Terjadi kesalahan atau format JSON untuk Content/Quiz tidak valid.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">LITERA CMS</h1>
            <p className="text-slate-500">Dashboard Manajemen Materi & Kuis</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-civic-blue hover:underline font-medium text-sm">Lihat Website</Link>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Database
            </div>
          </div>
        </div>

        {editingId || isCreating ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
            <h2 className="text-xl font-bold mb-6 text-civic-blue">
              {isCreating ? "Tambah Materi Baru" : `Edit Materi (ID: ${editingId})`}
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Kategori</label>
                  <input type="text" value={formData.cat || ""} onChange={(e) => setFormData({...formData, cat: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-civic-blue" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Judul Materi</label>
                  <input type="text" value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-civic-blue" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Estimasi Waktu (ex: 10 mnt)</label>
                  <input type="text" value={formData.time || ""} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-civic-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Level (Pemula/Menengah)</label>
                  <input type="text" value={formData.level || ""} onChange={(e) => setFormData({...formData, level: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-civic-blue" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Deskripsi Singkat</label>
                <textarea value={formData.desc || ""} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-civic-blue" rows="2" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Konten Materi (JSON Array)</label>
                <textarea value={formData.content || ""} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full font-mono text-sm border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-civic-blue bg-slate-50" rows="6" />
                <p className="text-xs text-slate-500 mt-1">Format: {`[ { "type": "p", "text": "Paragraf 1" } ]`}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Data Kuis (JSON Array)</label>
                <textarea value={formData.quiz || ""} onChange={(e) => setFormData({...formData, quiz: e.target.value})} className="w-full font-mono text-sm border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-civic-blue bg-slate-50" rows="6" />
                <p className="text-xs text-slate-500 mt-1">Format: {`[ { "q": "Pertanyaan?", "options": ["A", "B", "C", "D"], "answer": 1 } ]`}</p>
              </div>
              
              <div className="pt-4 flex gap-3 border-t border-slate-100">
                <button type="submit" className="bg-civic-blue text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-lg shadow-civic-blue/20">Simpan Materi</button>
                <button type="button" onClick={() => { setEditingId(null); setIsCreating(false); }} className="bg-slate-200 text-slate-700 px-8 py-2.5 rounded-xl font-medium hover:bg-slate-300 transition">Batal</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">Daftar Materi Edukasi</h2>
              <button onClick={handleCreate} className="bg-civic-blue text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Tambah Materi
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Kategori</th>
                    <th className="px-6 py-4 font-semibold">Judul Materi</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-12 text-slate-500">Memuat data dari SQLite...</td></tr>
                  ) : materials.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-slate-400 font-mono">#{m.id}</td>
                      <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-xs font-semibold">{m.cat}</span></td>
                      <td className="px-6 py-4 font-medium text-slate-800">{m.title}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(m.id)} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md font-medium transition">Edit</button>
                          <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md font-medium transition">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && materials.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-12 text-slate-500">Belum ada data materi.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
