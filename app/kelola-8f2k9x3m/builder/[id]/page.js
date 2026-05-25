"use client";
import { useState, useEffect, use, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Convert any YouTube URL format to embed-friendly form
function toEmbedUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.pathname.startsWith('/embed/')) return url;
    if ((u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') && u.searchParams.has('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if ((u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') && u.pathname.startsWith('/shorts/')) {
      const videoId = u.pathname.replace('/shorts/', '');
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {}
  return url;
}

// Map icon string to visual representation
const AVAILABLE_ICONS = [
  { id: "chart", char: "📈", name: "Investasi / Grafik", desc: "Cocok untuk materi finansial & pasar modal" },
  { id: "briefcase", char: "💼", name: "Perencanaan Keuangan", desc: "Cocok untuk manajemen budget & tabungan" },
  { id: "bank", char: "🏦", name: "Perbankan / Tabungan", desc: "Cocok untuk materi bank & suku bunga" },
  { id: "laptop", char: "💻", name: "Literasi Digital", desc: "Cocok untuk materi keamanan siber & fintech" },
  { id: "shopping-bag", char: "🛍️", name: "UMKM / Usaha", desc: "Cocok untuk materi bisnis kecil & kewirausahaan" },
  { id: "book", char: "📘", name: "Umum / Edukasi", desc: "Gunakan untuk materi dasar & artikel umum" }
];

export default function PremiumSplitVisualBuilder({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [adminUser, setAdminUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Active highlighted block in right preview panel
  const [activeBlockIdx, setActiveBlockIdx] = useState(null); // integer or 'header' or 'quiz'

  // Custom Icon Dropdown toggle state
  const [showIconDropdown, setShowIconDropdown] = useState(false);

  // Drag and drop tracking state
  const [draggedType, setDraggedType] = useState(null); // from left component palette
  const [draggedIdx, setDraggedIdx] = useState(null); // internal preview blocks
  const [dragOverIdx, setDragOverIdx] = useState(null); // block index currently hovered over

  // Course form data state
  const [courseData, setCourseData] = useState({
    cat: "Investasi",
    title: "",
    desc: "",
    time: "15 mnt",
    icon: "chart",
    level: "Pemula",
    content: [],
    quiz: []
  });

  const fileInputRef = useRef(null);
  const [uploadTargetSlideIdx, setUploadTargetSlideIdx] = useState(null); // null if not uploading for a slide block

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth gate
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          setAdminUser(d.username);
        } else {
          router.push("/kelola-8f2k9x3m");
        }
      })
      .catch(() => router.push("/kelola-8f2k9x3m"))
      .finally(() => setAuthChecked(true));
  }, [router]);

  // Load existing course data if editing
  useEffect(() => {
    if (!adminUser) return;
    if (id === "new") {
      setTimeout(() => {
        setLoading(false);
      }, 0);
      return;
    }

    fetch(`/api/materi/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat materi");
        return res.json();
      })
      .then((data) => {
        setCourseData({
          cat: data.cat || "Investasi",
          title: data.title || "",
          desc: data.desc || "",
          time: data.time || "15 mnt",
          icon: data.icon || "chart",
          level: data.level || "Pemula",
          content: data.content || [],
          quiz: data.quiz || []
        });
      })
      .catch((err) => {
        console.error(err);
        showToast("Gagal memuat materi", "error");
      })
      .finally(() => setLoading(false));
  }, [id, adminUser]);

  const handleSave = async () => {
    if (!courseData.title.trim()) {
      showToast("Judul materi wajib diisi!", "error");
      return;
    }
    setSaving(true);
    try {
      const url = id === "new" ? "/api/materi" : `/api/materi/${id}`;
      const method = id === "new" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData)
      });

      if (res.ok) {
        showToast("Perubahan materi berhasil disimpan!");
        setTimeout(() => router.push("/kelola-8f2k9x3m"), 1000);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || "Gagal menyimpan materi", "error");
      }
    } catch {
      showToast("Gagal terhubung ke server", "error");
    } finally {
      setSaving(false);
    }
  };

  // Block Manipulation Helpers
  const addBlock = (type) => {
    const newBlock = { type };
    if (type === "p" || type === "h2" || type === "h3" || type === "callout") newBlock.text = "";
    if (type === "ul" || type === "ol") newBlock.items = ["Item Baru 1", "Item Baru 2"];
    if (type === "image" || type === "video") { newBlock.url = ""; newBlock.caption = ""; }
    if (type === "slides") newBlock.items = [{ url: "", caption: "" }];

    setCourseData((prev) => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
    
    // Auto-select the newly added block
    const newIdx = courseData.content.length;
    setActiveBlockIdx(newIdx);
    
    setTimeout(() => {
      const rightCanvas = document.getElementById("right-canvas-viewport");
      if (rightCanvas) rightCanvas.scrollTo({ top: rightCanvas.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const updateBlock = (idx, field, val) => {
    setCourseData((prev) => {
      const updated = [...prev.content];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, content: updated };
    });
  };

  const removeBlock = (idx) => {
    setCourseData((prev) => {
      const updated = [...prev.content];
      updated.splice(idx, 1);
      return { ...prev, content: updated };
    });
    if (activeBlockIdx === idx) setActiveBlockIdx(null);
  };

  const duplicateBlock = (idx) => {
    setCourseData((prev) => {
      const updated = [...prev.content];
      // Deep clone block
      const cloned = JSON.parse(JSON.stringify(updated[idx]));
      updated.splice(idx + 1, 0, cloned);
      return { ...prev, content: updated };
    });
    setActiveBlockIdx(idx + 1);
  };

  const moveBlock = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= courseData.content.length) return;
    setCourseData((prev) => {
      const updated = [...prev.content];
      const temp = updated[idx];
      updated[idx] = updated[idx + dir];
      updated[idx + dir] = temp;
      return { ...prev, content: updated };
    });
    setActiveBlockIdx(idx + dir);
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || activeBlockIdx === null || activeBlockIdx === 'header' || activeBlockIdx === 'quiz') return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      showToast("Mengunggah gambar...", "info");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (res.ok && data.url) {
        if (uploadTargetSlideIdx !== null) {
          // Slide index specific upload
          const updatedSlides = [...courseData.content[activeBlockIdx].items];
          updatedSlides[uploadTargetSlideIdx].url = data.url;
          updateBlock(activeBlockIdx, "items", updatedSlides);
        } else {
          // Regular single image block upload
          updateBlock(activeBlockIdx, "url", data.url);
        }
        showToast("Gambar berhasil diunggah!");
      } else {
        showToast(data.error || "Gagal mengunggah gambar", "error");
      }
    } catch {
      showToast("Terjadi kesalahan saat mengunggah", "error");
    } finally {
      setUploadTargetSlideIdx(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Quiz Manipulation Helpers
  const addQuizQuestion = () => {
    const newQ = {
      q: "Pertanyaan Baru?",
      options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      answer: 0,
      explanation: "Penjelasan jawaban benar."
    };
    setCourseData((prev) => ({
      ...prev,
      quiz: [...prev.quiz, newQ]
    }));
  };

  const updateQuizQuestion = (qIdx, field, val) => {
    setCourseData((prev) => {
      const updated = [...prev.quiz];
      updated[qIdx] = { ...updated[qIdx], [field]: val };
      return { ...prev, quiz: updated };
    });
  };

  const removeQuizQuestion = (qIdx) => {
    setCourseData((prev) => {
      const updated = [...prev.quiz];
      updated.splice(qIdx, 1);
      return { ...prev, quiz: updated };
    });
  };

  // DRAG & DROP HANDLERS FOR NATIVE ORDERING & PALETTE DROP
  const handlePaletteDragStart = (e, type) => {
    setDraggedType(type);
    setDraggedIdx(null);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleBlockDragStart = (e, idx) => {
    setDraggedIdx(idx);
    setDraggedType(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverZone = (e, idx) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDragLeaveZone = () => {
    setDragOverIdx(null);
  };

  const handleDropOnZone = (e, targetIdx) => {
    e.preventDefault();
    setDragOverIdx(null);
    
    if (draggedType) {
      // Adding a new block from Left Component Palette
      const newBlock = { type: draggedType };
      if (draggedType === "p" || draggedType === "h2" || draggedType === "h3" || draggedType === "callout") newBlock.text = "";
      if (draggedType === "ul" || draggedType === "ol") newBlock.items = ["Item Baru 1", "Item Baru 2"];
      if (draggedType === "image" || draggedType === "video") { newBlock.url = ""; newBlock.caption = ""; }
      if (draggedType === "slides") newBlock.items = [{ url: "", caption: "" }];

      setCourseData((prev) => {
        const updated = [...prev.content];
        updated.splice(targetIdx, 0, newBlock);
        return { ...prev, content: updated };
      });
      setActiveBlockIdx(targetIdx);
      showToast("Blok berhasil ditambahkan!");
    } else if (draggedIdx !== null) {
      // Reordering an existing block
      setCourseData((prev) => {
        const updated = [...prev.content];
        const [movedBlock] = updated.splice(draggedIdx, 1);
        const adjustedTarget = draggedIdx < targetIdx ? targetIdx - 1 : targetIdx;
        updated.splice(adjustedTarget, 0, movedBlock);
        return { ...prev, content: updated };
      });
      setActiveBlockIdx(draggedIdx < targetIdx ? targetIdx - 1 : targetIdx);
    }
    setDraggedType(null);
    setDraggedIdx(null);
  };

  // Find active icon details
  const activeIconObj = AVAILABLE_ICONS.find((i) => i.id === courseData.icon) || AVAILABLE_ICONS[0];

  const renderDropZone = (targetIdx) => {
    const isHovered = dragOverIdx === targetIdx;
    return (
      <div 
        key={`drop-${targetIdx}`}
        onDragOver={(e) => handleDragOverZone(e, targetIdx)}
        onDragLeave={handleDragLeaveZone}
        onDrop={(e) => handleDropOnZone(e, targetIdx)}
        className={`h-3.5 my-0.5 rounded-lg transition-all duration-150 flex items-center justify-center relative select-none ${isHovered ? 'bg-blue-600/10 border border-dashed border-blue-500 h-10 scale-99' : 'opacity-0 hover:opacity-100 hover:bg-slate-100'}`}
      >
        {isHovered && (
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
            ↓ Sisipkan di sini ↓
          </span>
        )}
      </div>
    );
  };

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] text-slate-800 font-sans overflow-hidden">
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-6 right-6 z-[99999] animate-fade-up">
          <div className="px-5 py-3 rounded-2xl text-sm font-bold shadow-xl border" style={{ background: toast.type === "error" ? "#FEE2E2" : toast.type === "info" ? "#EFF6FF" : "#D1FAE5", color: toast.type === "error" ? "#991B1B" : toast.type === "info" ? "#2563EB" : "#065F46", borderColor: toast.type === "error" ? "#FECACA" : toast.type === "info" ? "#BFDBFE" : "#A7F3D0" }}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
         LEFT PANEL — STICKY SIDEBAR EDITOR (360px wide, Dark Navy)
         ═══════════════════════════════════════════════════════════ */}
      <aside className="w-[360px] flex-shrink-0 bg-[#1B2D4F] border-r border-[#1B2D4F]/10 flex flex-col h-screen text-white select-none">
        
        {/* Sticky Sidebar Header */}
        <div className="p-5 border-b border-white/10 flex flex-col gap-3.5 flex-shrink-0 bg-[#142240]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7.5 h-7.5 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm">P</span>
              <div>
                <h2 className="text-xs font-black tracking-tight">Visual Editor</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ruang PeKA JABAR</p>
              </div>
            </div>
            <Link href="/kelola-8f2k9x3m" className="text-[10px] font-bold text-slate-400 hover:text-white px-2.5 py-1 rounded bg-white/5 border border-white/10 transition">
              ← Keluar
            </Link>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-100 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                Menyimpan...
              </>
            ) : "Simpan Perubahan Materi"}
          </button>
        </div>

        {/* Scrollable Inspector Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          
          {/* Metadata Section */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4.5 space-y-4">
            <h3 className="text-[11px] font-black text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">📂 Metadata Materi</h3>
            
            {/* Category Dropdown */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-0.5">Kategori</label>
              <select 
                value={courseData.cat}
                onChange={(e) => setCourseData({ ...courseData, cat: e.target.value })}
                className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold text-white outline-none cursor-pointer focus:border-blue-500"
              >
                <option value="Literasi Digital">Literasi Digital</option>
                <option value="Perencanaan Keuangan">Perencanaan Keuangan</option>
                <option value="Investasi">Investasi</option>
                <option value="Perbankan">Perbankan</option>
                <option value="UMKM">UMKM</option>
              </select>
            </div>

            {/* Level difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-0.5">Tingkat</label>
                <select 
                  value={courseData.level}
                  onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                  className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold text-white outline-none cursor-pointer focus:border-blue-500"
                >
                  <option value="Pemula">Pemula</option>
                  <option value="Menengah">Menengah</option>
                  <option value="Semua Tingkat">Semua Tingkat</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-0.5">Waktu Baca</label>
                <input 
                  type="text"
                  value={courseData.time}
                  onChange={(e) => setCourseData({ ...courseData, time: e.target.value })}
                  placeholder="15 mnt"
                  className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-extrabold text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Custom Icon Dropdown Selector */}
            <div className="relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-0.5">Icon Visual Utama</label>
              
              {/* Trigger Button */}
              <button 
                type="button"
                onClick={() => setShowIconDropdown((p) => !p)}
                className="w-full bg-[#142240] border border-white/10 hover:bg-[#1B2D4F]/50 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-white flex items-center justify-between outline-none transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{activeIconObj.char}</span>
                  <span>{activeIconObj.name}</span>
                </div>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`text-slate-400 transition-transform ${showIconDropdown ? 'rotate-180' : ''}`}><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>

              {/* Overlay Backdrop to Close Dropdown */}
              {showIconDropdown && (
                <div 
                  className="fixed inset-0 z-40 bg-transparent" 
                  onClick={() => setShowIconDropdown(false)}
                />
              )}

              {/* Styled Popover Dropdown Choices */}
              {showIconDropdown && (
                <div className="absolute left-0 right-0 mt-1.5 bg-[#142240] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                  {AVAILABLE_ICONS.map((ico) => (
                    <button 
                      key={ico.id}
                      type="button"
                      onClick={() => {
                        setCourseData({ ...courseData, icon: ico.id });
                        setShowIconDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 hover:bg-blue-600/50 flex items-start gap-3 transition-colors ${courseData.icon === ico.id ? 'bg-blue-600/20 border-l-3 border-blue-500' : ''}`}
                    >
                      <span className="text-lg mt-0.5">{ico.char}</span>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{ico.name}</p>
                        <p className="text-[9px] text-slate-400 leading-normal mt-0.5">{ico.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Description */}
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-0.5">Ringkasan Ringkas (Katalog)</label>
              <textarea 
                value={courseData.desc}
                onChange={(e) => setCourseData({ ...courseData, desc: e.target.value })}
                placeholder="Tulis 1 kalimat deskripsi materi untuk katalog..."
                rows={2}
                className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* Component choosing Palette (Replaced bottom element chooser) */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4.5 space-y-3">
            <h3 className="text-[11px] font-black text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">🛠️ Palet Elemen</h3>
            <p className="text-[9px] text-slate-400 leading-relaxed">Klik elemen di bawah untuk langsung menyisipkan di akhir halaman, atau <b>drag & drop</b> ke area preview kanan.</p>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { type: "p", label: "Paragraf", emoji: "📝" },
                { type: "h2", label: "Judul Bab", emoji: "🏷️" },
                { type: "h3", label: "Sub-Bab", emoji: "📎" },
                { type: "image", label: "Gambar", emoji: "🖼️" },
                { type: "slides", label: "Slider", emoji: "📑" },
                { type: "video", label: "Video YT", emoji: "▶️" },
                { type: "ul", label: "Daftar Bullets", emoji: "•" },
                { type: "ol", label: "Daftar Nomor", emoji: "1." },
                { type: "callout", label: "Catatan", emoji: "💡" }
              ].map((comp) => (
                <button
                  key={comp.type}
                  type="button"
                  draggable
                  onDragStart={(e) => handlePaletteDragStart(e, comp.type)}
                  onClick={() => addBlock(comp.type)}
                  className="px-3 py-2.5 bg-[#142240] hover:bg-[#2563EB] border border-white/10 hover:border-blue-400 text-left rounded-xl transition duration-150 active:scale-95 group flex items-center gap-2 cursor-grab active:cursor-grabbing"
                >
                  <span className="text-xs group-hover:scale-110 transition-transform">{comp.emoji}</span>
                  <span className="text-[10px] font-extrabold tracking-tight truncate">{comp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sticky block properties Inspector */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4.5 space-y-4">
            <h3 className="text-[11px] font-black text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">⚙️ Inspektur Blok Konten</h3>
            
            {activeBlockIdx === null || activeBlockIdx === 'header' || activeBlockIdx === 'quiz' ? (
              <div className="text-center py-6 text-[10px] font-bold text-slate-400 bg-white/5 rounded-xl border border-dashed border-white/10 leading-relaxed px-4">
                Pilih atau klik salah satu blok di area kanan preview untuk menyesuaikan pengaturan medianya secara langsung di sini.
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black bg-blue-600 text-white uppercase tracking-widest px-2.5 py-1 rounded">
                    {courseData.content[activeBlockIdx].type.toUpperCase()}
                  </span>
                  <button 
                    onClick={() => removeBlock(activeBlockIdx)}
                    className="text-[10px] font-extrabold text-red-400 hover:text-white px-2 py-1 bg-red-500/10 hover:bg-red-500 rounded transition"
                  >
                    Hapus Blok
                  </button>
                </div>

                {/* IMAGE BLOCK INSPECTOR */}
                {courseData.content[activeBlockIdx].type === "image" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Unggah File</label>
                      <button 
                        type="button" 
                        onClick={() => {
                          setUploadTargetSlideIdx(null);
                          fileInputRef.current?.click();
                        }}
                        className="w-full py-2 bg-slate-700 hover:bg-slate-600 border border-white/10 rounded-xl text-xs font-bold text-center transition"
                      >
                        📁 Pilih & Upload File Lokal
                      </button>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Atau Tempel URL Gambar</label>
                      <input 
                        type="text"
                        value={courseData.content[activeBlockIdx].url || ""}
                        onChange={(e) => updateBlock(activeBlockIdx, "url", e.target.value)}
                        placeholder="https://... atau /uploads/..."
                        className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Caption / Keterangan</label>
                      <input 
                        type="text"
                        value={courseData.content[activeBlockIdx].caption || ""}
                        onChange={(e) => updateBlock(activeBlockIdx, "caption", e.target.value)}
                        placeholder="Tulis deskripsi keterangan gambar..."
                        className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* VIDEO BLOCK INSPECTOR */}
                {courseData.content[activeBlockIdx].type === "video" && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Link Video YouTube</label>
                      <input 
                        type="text"
                        value={courseData.content[activeBlockIdx].url || ""}
                        onChange={(e) => updateBlock(activeBlockIdx, "url", e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                      />
                      <p className="text-[9px] text-slate-400 mt-1">Mendukung link biasa, youtu.be, atau shorts.</p>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Keterangan Video</label>
                      <input 
                        type="text"
                        value={courseData.content[activeBlockIdx].caption || ""}
                        onChange={(e) => updateBlock(activeBlockIdx, "caption", e.target.value)}
                        placeholder="Judul / deskripsi singkat video..."
                        className="w-full bg-[#142240] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* SLIDESHOW BANNER INSPECTOR */}
                {courseData.content[activeBlockIdx].type === "slides" && (
                  <div className="space-y-4">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Slide Banner Items ({courseData.content[activeBlockIdx].items.length})</label>
                    
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar border-b border-white/10 pb-3">
                      {courseData.content[activeBlockIdx].items.map((slide, sIdx) => (
                        <div key={sIdx} className="bg-[#142240] p-3 rounded-xl border border-white/5 space-y-2 relative">
                          <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                            <span>Slide {sIdx + 1}</span>
                            <button 
                              type="button" 
                              onClick={() => {
                                const updated = [...courseData.content[activeBlockIdx].items];
                                updated.splice(sIdx, 1);
                                updateBlock(activeBlockIdx, "items", updated);
                              }}
                              className="text-red-400 hover:text-white"
                            >
                              ✕ Hapus
                            </button>
                          </div>
                          
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={slide.url || ""}
                              onChange={(e) => {
                                const updated = [...courseData.content[activeBlockIdx].items];
                                updated[sIdx].url = e.target.value;
                                updateBlock(activeBlockIdx, "items", updated);
                              }}
                              placeholder="URL Gambar Slide..."
                              className="flex-1 bg-[#1B2D4F] border border-white/10 rounded-lg px-2 py-1 text-[11px] font-semibold outline-none"
                            />
                            <button 
                              type="button" 
                              onClick={() => {
                                setUploadTargetSlideIdx(sIdx);
                                fileInputRef.current?.click();
                              }}
                              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold"
                            >
                              Upload
                            </button>
                          </div>

                          <input 
                            type="text"
                            value={slide.caption || ""}
                            onChange={(e) => {
                              const updated = [...courseData.content[activeBlockIdx].items];
                              updated[sIdx].caption = e.target.value;
                              updateBlock(activeBlockIdx, "items", updated);
                            }}
                            placeholder="Keterangan Slide..."
                            className="w-full bg-[#1B2D4F] border border-white/10 rounded-lg px-2 py-1 text-[11px] font-semibold outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = [...courseData.content[activeBlockIdx].items, { url: "", caption: "" }];
                        updateBlock(activeBlockIdx, "items", updated);
                      }}
                      className="w-full py-1.5 bg-blue-600/30 border border-blue-500/50 hover:bg-blue-600 rounded-xl text-[10px] font-bold text-center text-blue-300 transition"
                    >
                      + Tambah Slide Baru
                    </button>
                  </div>
                )}

                {/* TEXT / LISTS / CALLOUT SIMPLE HINTS */}
                {(courseData.content[activeBlockIdx].type === "p" || courseData.content[activeBlockIdx].type === "h2" || courseData.content[activeBlockIdx].type === "h3" || courseData.content[activeBlockIdx].type === "callout") && (
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    💡 Anda dapat mengetik teks, memodifikasi, dan memformat isinya secara visual langsung di area preview halaman sebelah kanan.
                  </p>
                )}

                {(courseData.content[activeBlockIdx].type === "ul" || courseData.content[activeBlockIdx].type === "ol") && (
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    💡 Klik item list langsung pada preview kanan untuk mengubah isinya, menghapus item, atau menambah butir baru.
                  </p>
                )}

              </div>
            )}
          </div>

          {/* Kuis Quiz Section */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-[11px] font-black text-blue-300 uppercase tracking-widest">📝 Soal Kuis ({courseData.quiz.length})</h3>
              <button 
                type="button" 
                onClick={addQuizQuestion}
                className="text-[10px] font-black text-blue-400 hover:text-white"
              >
                + Soal Baru
              </button>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
              {courseData.quiz.length === 0 ? (
                <div className="text-center py-6 text-[10px] font-bold text-slate-400 bg-white/5 rounded-xl border border-dashed border-white/10">
                  Belum ada pertanyaan kuis ditambahkan.
                </div>
              ) : (
                courseData.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="bg-[#142240] p-4 rounded-xl border border-white/5 space-y-3 relative">
                    <div className="flex justify-between items-center text-[10px] font-black text-blue-300">
                      <span>Pertanyaan {qIdx + 1}</span>
                      <button 
                        type="button" 
                        onClick={() => removeQuizQuestion(qIdx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Hapus
                      </button>
                    </div>

                    <input 
                      type="text"
                      value={q.q}
                      onChange={(e) => updateQuizQuestion(qIdx, "q", e.target.value)}
                      placeholder="Masukkan Pertanyaan..."
                      className="w-full bg-[#1B2D4F] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white outline-none"
                    />

                    {/* Options Mapping */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Opsi Pilihan (Jawaban Benar dicentang)</label>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2 items-center">
                          <input 
                            type="radio" 
                            name={`correct-ans-${qIdx}`}
                            checked={q.answer === oIdx}
                            onChange={() => updateQuizQuestion(qIdx, "answer", oIdx)}
                            className="cursor-pointer"
                          />
                          <input 
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...q.options];
                              updated[oIdx] = e.target.value;
                              updateQuizQuestion(qIdx, "options", updated);
                            }}
                            placeholder={`Pilihan ${String.fromCharCode(65 + oIdx)}`}
                            className="flex-1 bg-[#1B2D4F] border border-white/10 rounded-lg px-2 py-1 text-[11px] font-semibold text-white outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1">Penjelasan Kunci</label>
                      <textarea 
                        value={q.explanation || ""}
                        onChange={(e) => updateQuizQuestion(qIdx, "explanation", e.target.value)}
                        placeholder="Tulis penjelasan kenapa opsi tersebut benar..."
                        rows={2}
                        className="w-full bg-[#1B2D4F] border border-white/10 rounded-lg px-2 py-1 text-[11px] font-semibold text-white outline-none leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
         RIGHT PANEL — REAL-TIME LIVE COURSE PREVIEW CANVAS
         ═══════════════════════════════════════════════════════════ */}
      <main 
        id="right-canvas-viewport" 
        className="flex-1 h-screen overflow-y-auto bg-[#FAFAF8] relative scroll-smooth no-scrollbar"
      >
        {/* Navigation Mock (mirrors live website exactly) */}
        <div className="absolute top-0 inset-x-0 h-16 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-30 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1B2D4F] rounded-lg flex items-center justify-center font-bold text-white text-xs">P</div>
            <span className="text-xs font-bold text-[#1B2D4F] tracking-tight">Ruang PeKA JABAR</span>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">Preview Mode</span>
        </div>

        {/* ── Visual Course Header (Replicates Live Page Symmetrically) ── */}
        <section className="bg-[#F5F3F0] pt-[95px] pb-12 border-b border-slate-200/50 relative">
          <div className="max-w-[720px] mx-auto px-6 relative">
            
            {/* Symmetrical Breadcrumbs Dropdown Selector */}
            <nav className="flex items-center gap-2 text-fine text-text-tertiary mb-6 select-none">
              <span className="hover:text-civic-blue transition">Materi</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
              
              <span className="font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg">
                {courseData.cat}
              </span>
            </nav>

            {/* Symmetrical Category Tag */}
            <span className="text-overline text-civic-blue mb-2.5 block tracking-widest font-extrabold select-none">
              {courseData.cat}
            </span>

            {/* DIRECT VISUAL IN-PLACE EDITABLE TITLE */}
            <textarea
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              placeholder="Tulis Judul Materi Edukasi Di Sini..."
              rows={1}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }
              }}
              className="w-full text-display font-extrabold text-[#1B2D4F] tracking-tight bg-transparent border-0 outline-none p-1.5 focus:bg-white/90 focus:ring-4 focus:ring-blue-100 rounded-2xl resize-none transition leading-tight mb-5"
            />

            {/* Symmetrical metadata row */}
            <div className="flex flex-wrap items-center gap-4 text-caption text-text-tertiary select-none">
              <span className="flex items-center gap-1.5 bg-white border border-slate-200/50 rounded-xl px-3 py-1 text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                {courseData.time}
              </span>

              <span>•</span>

              <span className="flex items-center gap-1.5 bg-white border border-slate-200/50 rounded-xl px-3 py-1 text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                {courseData.level}
              </span>

              <span>•</span>

              <span className="flex items-center gap-1.5 bg-white border border-slate-200/50 rounded-xl px-3 py-1 text-xs">
                <span className="text-base mr-1">{activeIconObj.char}</span>
                <span>{activeIconObj.name}</span>
              </span>
            </div>

          </div>
        </section>

        {/* ── Content Canvas Area ── */}
        <section className="relative">
          <div className="max-w-[720px] mx-auto px-6 py-12 space-y-1">
            
            {/* Iterate blocks */}
            {courseData.content.length === 0 ? (
              <div 
                onDragOver={(e) => handleDragOverZone(e, 0)}
                onDragLeave={handleDragLeaveZone}
                onDrop={(e) => handleDropOnZone(e, 0)}
                className={`text-center py-20 bg-slate-50/50 border-2 border-dashed rounded-3xl transition-all duration-150 ${dragOverIdx === 0 ? 'bg-blue-50/50 border-blue-500 scale-99' : 'border-slate-200'}`}
              >
                <span className="text-3xl block mb-2">📥</span>
                <p className="text-slate-400 text-xs font-black uppercase tracking-wider mb-1">Canvas Materi Kosong</p>
                <p className="text-[11px] text-slate-400 font-semibold">Tarik / drop blok dari sidebar kiri, atau klik tombol elemen untuk memulai.</p>
              </div>
            ) : (
              courseData.content.map((block, idx) => {
                 const renderBlockContent = () => {
                  switch (block.type) {
                    case "h2":
                      return (
                        <textarea 
                          value={block.text}
                          onChange={(e) => updateBlock(idx, "text", e.target.value)}
                          placeholder="Tulis Judul Bab (H2)..."
                          rows={1}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          className="w-full text-heading text-[#1B2D4F] font-bold bg-transparent border-0 outline-none p-1.5 focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-300 rounded-xl resize-none leading-tight"
                        />
                      );
                    case "h3":
                      return (
                        <textarea 
                          value={block.text}
                          onChange={(e) => updateBlock(idx, "text", e.target.value)}
                          placeholder="Tulis Sub-Bab (H3)..."
                          rows={1}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          className="w-full text-subheading text-[#1B2D4F] font-bold bg-transparent border-0 outline-none p-1.5 focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-300 rounded-xl resize-none leading-tight"
                        />
                      );
                    case "p":
                      return (
                        <textarea 
                          value={block.text}
                          onChange={(e) => updateBlock(idx, "text", e.target.value)}
                          placeholder="Ketik isi paragraf edukatif di sini..."
                          rows={2}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          className="w-full text-body text-text-primary bg-transparent border-0 outline-none p-1.5 focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-300 rounded-xl resize-none leading-relaxed"
                        />
                      );
                    case "callout":
                      return (
                        <div className="bg-civic-blue-mist rounded-2xl p-5 flex gap-3.5 items-start border border-blue-100/30">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-civic-blue)" strokeWidth="2.5" className="flex-shrink-0 mt-1"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                          <textarea 
                            value={block.text}
                            onChange={(e) => updateBlock(idx, "text", e.target.value)}
                            placeholder="Tulis catatan, insight, atau kutipan di sini..."
                            rows={2}
                            onInput={(e) => {
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            className="w-full text-body text-slate-800 bg-transparent border-0 outline-none p-1.5 focus:bg-white focus:shadow-sm focus:ring-1 focus:ring-blue-300 rounded-xl resize-none leading-relaxed font-semibold"
                          />
                        </div>
                      );
                    case "ul":
                      return (
                        <div className="space-y-2.5 ml-1">
                          {block.items.map((item, j) => (
                            <div key={j} className="flex gap-3 items-center group/item">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0 mt-0.5" />
                              <input 
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const updated = [...block.items];
                                  updated[j] = e.target.value;
                                  updateBlock(idx, "items", updated);
                                }}
                                placeholder="Daftar item..."
                                className="flex-1 text-body text-text-primary bg-transparent border-0 outline-none p-1 focus:bg-white focus:ring-1 focus:ring-blue-200 rounded-lg"
                              />
                              <button 
                                type="button" 
                                onClick={() => {
                                  const updated = [...block.items];
                                  updated.splice(j, 1);
                                  updateBlock(idx, "items", updated);
                                }}
                                className="opacity-0 group-hover/item:opacity-100 text-red-500 text-xs px-2 hover:scale-110 transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => {
                              updateBlock(idx, "items", [...block.items, "Item Baru"]);
                            }}
                            className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg mt-1 transition active:scale-95"
                          >
                            + Tambah Item Poin
                          </button>
                        </div>
                      );
                    case "ol":
                      return (
                        <div className="space-y-2.5 ml-1">
                          {block.items.map((item, j) => (
                            <div key={j} className="flex gap-3 items-center group/item">
                              <span className="w-6 h-6 rounded-full bg-civic-blue-mist text-civic-blue text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">{j + 1}</span>
                              <input 
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const updated = [...block.items];
                                  updated[j] = e.target.value;
                                  updateBlock(idx, "items", updated);
                                }}
                                placeholder="Daftar item bernomor..."
                                className="flex-1 text-body text-text-primary bg-transparent border-0 outline-none p-1 focus:bg-white focus:ring-1 focus:ring-blue-200 rounded-lg"
                              />
                              <button 
                                type="button" 
                                onClick={() => {
                                  const updated = [...block.items];
                                  updated.splice(j, 1);
                                  updateBlock(idx, "items", updated);
                                }}
                                className="opacity-0 group-hover/item:opacity-100 text-red-500 text-xs px-2 hover:scale-110 transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => {
                              updateBlock(idx, "items", [...block.items, "Item Baru"]);
                            }}
                            className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg mt-1 transition active:scale-95"
                          >
                            + Tambah Item Nomor
                          </button>
                        </div>
                      );
                    case "image":
                      return (
                        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md bg-slate-50/50 aspect-video flex flex-col justify-center items-center relative group/img">
                          {block.url ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={block.url} alt={block.caption || "Preview"} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-[#1B2D4F]/30 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white text-[11px] font-extrabold gap-1.5 shadow-inner">
                                <span className="bg-[#1B2D4F]/85 px-4 py-2.5 rounded-full flex items-center gap-1.5 border border-white/10 pointer-events-none">
                                  ⚙️ Edit di Sidebar Kiri
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-10">
                              <span className="text-4xl block mb-2">🖼️</span>
                              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Kosong • Butuh Gambar</span>
                              <p className="text-[10px] text-slate-400 mt-1">Konfigurasi file atau URL di inspektur kiri.</p>
                            </div>
                          )}
                          {block.caption && (
                            <div className="absolute bottom-0 inset-x-0 bg-[#1B2D4F]/85 text-center py-2.5 px-4 text-[10px] font-extrabold text-white z-10 truncate border-t border-white/5 select-none">
                              {block.caption}
                            </div>
                          )}
                        </div>
                      );
                    case "video":
                      return (
                        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md bg-slate-50/50 aspect-video flex flex-col justify-center items-center relative group/vid">
                          {block.url ? (
                            <>
                              <iframe 
                                src={toEmbedUrl(block.url)}
                                title={block.caption || "Video"}
                                className="w-full h-full pointer-events-none"
                              />
                              <div className="absolute inset-0 bg-[#1B2D4F]/35 opacity-0 group-hover/vid:opacity-100 transition flex items-center justify-center text-white text-[11px] font-extrabold gap-1.5">
                                <span className="bg-[#1B2D4F]/85 px-4 py-2.5 rounded-full flex items-center gap-1.5 border border-white/10 pointer-events-none">
                                  ⚙️ Edit di Sidebar Kiri
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-10">
                              <span className="text-4xl block mb-2">▶️</span>
                              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Kosong • Butuh URL Video</span>
                              <p className="text-[10px] text-slate-400 mt-1">Tempel link YouTube pada inspektur kiri.</p>
                            </div>
                          )}
                          {block.caption && (
                            <div className="absolute bottom-0 inset-x-0 bg-[#1B2D4F]/85 text-center py-2.5 px-4 text-[10px] font-extrabold text-white z-10 truncate border-t border-white/5 select-none">
                              {block.caption}
                            </div>
                          )}
                        </div>
                      );
                    case "slides":
                      return (
                        <div className="bg-[#F5F3F0]/60 border border-slate-200/50 rounded-2xl p-4.5 space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                            <span>📑 Slider Banner Multi-Slide</span>
                            <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Preview</span>
                          </div>

                          <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                            {block.items[0]?.url ? (
                              <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={block.items[0].url} alt="slide preview" className="w-full h-full object-contain" />
                                {block.items.length > 1 && (
                                  <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full">
                                    + {block.items.length - 1} Slides Lainnya
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center p-6 text-slate-400">
                                <span className="text-3xl block mb-1">📑</span>
                                <span className="text-[10px] font-bold">Slider Kosong</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    default:
                      return null;
                  }
                };

                const isBlockActive = activeBlockIdx === idx;

                return (
                  <div key={idx}>
                    {/* Render drop zone ABOVE this block */}
                    {renderDropZone(idx)}

                    {/* RENDER THE ACTUAL WRAPPED BLOCK */}
                    <div 
                      draggable
                      onDragStart={(e) => handleBlockDragStart(e, idx)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveBlockIdx(idx);
                      }}
                      className={`group relative border-2 rounded-2xl p-2.5 transition duration-150 cursor-pointer ${isBlockActive ? 'border-blue-500 bg-blue-50/5 shadow-md shadow-blue-500/5' : 'border-transparent hover:border-blue-200/60 hover:bg-slate-50/30'}`}
                    >
                      {/* Floating Block Control Toolbar */}
                      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 flex items-center bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-1 shadow-md transition duration-150 gap-0.5 select-none pointer-events-auto">
                        <span className="text-[9px] font-black text-[#1B2D4F] uppercase tracking-wider px-2 py-0.5 border-r border-slate-100">
                          {block.type}
                        </span>
                        
                        {/* Drag Handle icon */}
                        <div className="text-[11px] font-bold text-slate-400 hover:text-blue-600 px-1.5 py-0.5 cursor-grab active:cursor-grabbing" title="Drag to Reorder">
                          ☰
                        </div>

                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); moveBlock(idx, -1); }} 
                          disabled={idx === 0} 
                          className="text-[10px] font-bold text-slate-400 hover:text-blue-600 disabled:opacity-20 px-1.5 py-0.5"
                          title="Pindahkan ke Atas"
                        >
                          ▲
                        </button>
                        
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); moveBlock(idx, 1); }} 
                          disabled={idx === courseData.content.length - 1} 
                          className="text-[10px] font-bold text-slate-400 hover:text-blue-600 disabled:opacity-20 px-1.5 py-0.5"
                          title="Pindahkan ke Bawah"
                        >
                          ▼
                        </button>

                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); duplicateBlock(idx); }} 
                          className="text-[10px] font-bold text-slate-400 hover:text-blue-600 px-1.5 py-0.5"
                          title="Duplikasi Elemen"
                        >
                          ❐
                        </button>
                        
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); removeBlock(idx); }} 
                          className="text-[9px] font-extrabold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100/50 hover:bg-red-100"
                          title="Hapus Elemen"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Block Component Display */}
                      {renderBlockContent()}
                    </div>
                  </div>
                );
              })
            )}

            {/* Render absolute final drop zone at the bottom */}
            {courseData.content.length > 0 && renderDropZone(courseData.content.length)}

          </div>
        </section>

        {/* ── Visual Post-Test CTA Section (Symmetrical Live) ── */}
        <section 
          onClick={() => setActiveBlockIdx('quiz')}
          className={`py-12 select-none cursor-pointer border-2 transition ${activeBlockIdx === 'quiz' ? 'border-blue-500 bg-blue-50/5' : 'border-transparent hover:bg-slate-50/40'}`}
        >
          <div className="max-w-[720px] mx-auto px-6">
            <div className="relative bg-[#1B2D4F] rounded-3xl p-10 text-center overflow-hidden shadow-xl shadow-blue-900/10">
              
              {/* Symmetrical Mega Mendung ornament cloud motif */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image src="/mega_mendung.jpeg" alt="Motif Mega Mendung" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover opacity-[0.12] mix-blend-color-dodge -scale-y-100" />
                <div className="absolute inset-0 bg-[#1B2D4F]/85 mix-blend-multiply" />
              </div>

              <div className="relative z-10 text-center">
                <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-widest block mb-2">Selesai Membaca?</span>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Evaluasi Kuis Post-Test</h3>
                <p className="text-[11px] text-slate-300 max-w-sm mx-auto mb-6">
                  {courseData.quiz.length} soal pertanyaan disiapkan untuk menguji pemahaman materi ini.
                </p>
                <button 
                  type="button" 
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black px-8 py-3 rounded-full transition active:scale-95 shadow-md shadow-blue-500/25 pointer-events-none"
                >
                  Lihat / Konfigurasi Soal di Kiri
                </button>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Hidden system input for image uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

    </div>
  );
}
