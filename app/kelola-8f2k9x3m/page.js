"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import BlockBuilder from "./BlockBuilder";
import QuizBuilder from "./QuizBuilder";

/* ── Login Screen ── */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }
      onLogin(data.username);
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(165deg, #1B2D4F 0%, #1E3A5F 50%, #1B2D4F 100%)" }}>
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(37,99,235,0.2)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">LITERA CMS</h1>
          <p className="text-sm" style={{ color: "#94A3B8" }}>Masuk ke Dashboard Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {error && (
            <div className="text-sm px-4 py-2.5 rounded-xl" style={{ background: "rgba(220,38,38,0.15)", color: "#FCA5A5", border: "1px solid rgba(220,38,38,0.2)" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8", letterSpacing: "0.05em", textTransform: "uppercase" }}>Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#94A3B8", letterSpacing: "0.05em", textTransform: "uppercase" }}>Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="••••••••"
            />
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "#2563EB" }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-xs text-center" style={{ color: "#64748B" }}>
            Login pertama otomatis membuat akun admin.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ── Field Helper ── */
const Field = ({ label, name, type = "text", rows, mono, hint, formData, setFormData }) => (
  <div>
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</label>
    {rows ? (
      <textarea
        value={formData[name] || ""}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        rows={rows}
        className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition ${mono ? "font-mono text-xs" : ""}`}
        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#1E293B" }}
      />
    ) : (
      <input
        type={type}
        value={formData[name] || ""}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        required={["cat", "title", "desc"].includes(name)}
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition"
        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#1E293B" }}
      />
    )}
    {hint && <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{hint}</p>}
  </div>
);

/* ── Dashboard ── */
export default function AdminCMS() {
  const [adminUser, setAdminUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setAdminUser(d.username); })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await fetch("/api/materi");
      if (res.ok) setMaterials(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminUser) fetchMaterials();
  }, [adminUser, fetchMaterials]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdminUser(null);
  };

  const handleEdit = async (id) => {
    try {
      setEditingId(id);
      setIsCreating(false);
      const res = await fetch(`/api/materi/${id}`);
      const data = await res.json();
      setFormData({
        ...data,
        content: data.content || [],
        quiz: data.quiz || [],
      });
    } catch {
      showToast("Gagal memuat detail materi.", "error");
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ cat: "Umum", title: "", desc: "", time: "5 mnt", icon: "book", level: "Pemula", content: [], quiz: [] });
  };

  const handleDelete = async (id) => {
    if (!confirm("Anda yakin ingin menghapus materi ini?")) return;
    try {
      const res = await fetch(`/api/materi/${id}`, { method: "DELETE" });
      if (res.ok) { showToast("Materi berhasil dihapus."); fetchMaterials(); }
      else showToast("Gagal menghapus.", "error");
    } catch {
      showToast("Gagal menghapus.", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { 
        ...formData, 
        content: formData.content || [], 
        quiz: formData.quiz || [] 
      };

      const url = isCreating ? "/api/materi" : `/api/materi/${editingId}`;
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (res.ok) {
        showToast(isCreating ? "Materi berhasil ditambahkan!" : "Perubahan tersimpan!");
        setEditingId(null);
        setIsCreating(false);
        fetchMaterials();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Gagal menyimpan.", "error");
      }
    } catch {
      showToast("Format JSON tidak valid.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Auth gate
  if (!authChecked) return <div className="min-h-screen flex items-center justify-center" style={{ background: "#1B2D4F" }}><div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>;
  if (!adminUser) return <LoginScreen onLogin={setAdminUser} />;



  return (
    <div className="min-h-screen" style={{ background: "#F1F5F9" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-up" style={{ animation: "fadeUp 0.3s ease" }}>
          <div className="px-5 py-3 rounded-xl text-sm font-medium shadow-lg" style={{ background: toast.type === "error" ? "#FEE2E2" : "#D1FAE5", color: toast.type === "error" ? "#991B1B" : "#065F46", border: `1px solid ${toast.type === "error" ? "#FECACA" : "#A7F3D0"}` }}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40" style={{ background: "rgba(241,245,249,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2563EB" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div>
              <h1 className="text-sm font-bold" style={{ color: "#1E293B" }}>LITERA CMS</h1>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-medium" style={{ color: "#2563EB" }} target="_blank">Lihat Website</Link>
            <span className="text-xs" style={{ color: "#64748B" }}>{adminUser}</span>
            <button onClick={handleLogout} className="text-xs font-medium px-3 py-1.5 rounded-lg transition" style={{ color: "#DC2626", background: "rgba(220,38,38,0.08)" }}>Keluar</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Editor */}
        {(editingId || isCreating) ? (
          <div className="rounded-2xl p-8" style={{ background: "white", border: "1px solid #E2E8F0" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: "#1E293B" }}>{isCreating ? "Tambah Materi Baru" : `Edit Materi #${editingId}`}</h2>
              <button onClick={() => { setEditingId(null); setIsCreating(false); }} className="text-sm" style={{ color: "#64748B" }}>Batal</button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              {/* Basic Info */}
              <div className="rounded-xl p-5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-xs font-bold mb-4" style={{ color: "#2563EB", letterSpacing: "0.05em", textTransform: "uppercase" }}>Informasi Dasar</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Kategori" name="cat" hint="Contoh: Literasi Digital, Investasi, Perbankan" formData={formData} setFormData={setFormData} />
                  <Field label="Judul Materi" name="title" hint="Judul yang jelas dan deskriptif" formData={formData} setFormData={setFormData} />
                  <Field label="Estimasi Waktu Baca" name="time" hint="Contoh: 8 mnt, 15 mnt" formData={formData} setFormData={setFormData} />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Level" name="level" hint="Pemula / Menengah" formData={formData} setFormData={setFormData} />
                    <Field label="Ikon" name="icon" hint="book, chart, lock, dll" formData={formData} setFormData={setFormData} />
                  </div>
                </div>
                <div className="mt-4">
                  <Field label="Deskripsi Singkat" name="desc" rows={2} hint="1-2 kalimat ringkasan materi" formData={formData} setFormData={setFormData} />
                </div>
              </div>

              {/* Content Editor */}
              <div className="rounded-xl p-5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold" style={{ color: "#2563EB", letterSpacing: "0.05em", textTransform: "uppercase" }}>Konten Materi (Visual Builder)</p>
                </div>
                <BlockBuilder blocks={formData.content || []} onChange={(val) => setFormData({ ...formData, content: val })} />
              </div>

              {/* Quiz Editor */}
              <div className="rounded-xl p-5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-xs font-bold mb-4" style={{ color: "#2563EB", letterSpacing: "0.05em", textTransform: "uppercase" }}>Data Kuis (Post-Test)</p>
                <QuizBuilder quiz={formData.quiz || []} onChange={(val) => setFormData({ ...formData, quiz: val })} />
              </div>

              <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
                <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50" style={{ background: "#2563EB" }}>
                  {saving ? "Menyimpan..." : "Simpan Materi"}
                </button>
                <button type="button" onClick={() => { setEditingId(null); setIsCreating(false); }} className="px-6 py-2.5 rounded-xl text-sm font-medium transition" style={{ background: "#F1F5F9", color: "#475569" }}>Batal</button>
              </div>
            </form>
          </div>
        ) : (
          /* Material List */
          <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E2E8F0" }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <div>
                <h2 className="text-base font-bold" style={{ color: "#1E293B" }}>Daftar Materi Edukasi</h2>
                <p className="text-xs" style={{ color: "#94A3B8" }}>{materials.length} materi tersedia</p>
              </div>
              <button id="btn-tambah-materi" onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition" style={{ background: "#2563EB" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambah Materi
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                    <th className="px-5 py-2.5 text-xs font-semibold" style={{ color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase" }}>ID</th>
                    <th className="px-5 py-2.5 text-xs font-semibold" style={{ color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase" }}>Kategori</th>
                    <th className="px-5 py-2.5 text-xs font-semibold" style={{ color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase" }}>Judul Materi</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-right" style={{ color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-12 text-sm" style={{ color: "#94A3B8" }}>Memuat data...</td></tr>
                  ) : materials.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-12 text-sm" style={{ color: "#94A3B8" }}>Belum ada data materi.</td></tr>
                  ) : materials.map((m) => (
                    <tr key={m.id} className="group hover:bg-slate-50 transition-colors" style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="px-5 py-3 text-xs font-mono" style={{ color: "#94A3B8" }}>#{m.id}</td>
                      <td className="px-5 py-3"><span className="text-[11px] font-bold px-2 py-1 rounded-md" style={{ background: "#EFF6FF", color: "#2563EB" }}>{m.cat}</span></td>
                      <td className="px-5 py-3 text-sm font-medium" style={{ color: "#1E293B" }}>{m.title}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(m.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg transition hover:bg-blue-100" style={{ color: "#2563EB", background: "rgba(37,99,235,0.08)" }}>Edit</button>
                          <button onClick={() => handleDelete(m.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg transition hover:bg-red-100" style={{ color: "#DC2626", background: "rgba(220,38,38,0.08)" }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
