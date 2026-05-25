import { useState, useRef } from "react";

export default function BlockBuilder({ blocks, onChange }) {
  const fileInputRef = useRef(null);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState(null);

  const addBlock = (type) => {
    const newBlock = { type };
    if (type === "p" || type === "h2" || type === "h3" || type === "callout") newBlock.text = "";
    if (type === "ul" || type === "ol") newBlock.items = ["", ""];
    if (type === "image" || type === "video") { newBlock.url = ""; newBlock.caption = ""; }
    if (type === "slides") newBlock.items = [{ url: "", caption: "" }];
    
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (idx, field, val) => {
    const newBlocks = [...blocks];
    newBlocks[idx][field] = val;
    onChange(newBlocks);
  };

  const removeBlock = (idx) => {
    const newBlocks = [...blocks];
    newBlocks.splice(idx, 1);
    onChange(newBlocks);
  };

  // Move block up/down
  const moveBlock = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[idx];
    newBlocks[idx] = newBlocks[idx + dir];
    newBlocks[idx + dir] = temp;
    onChange(newBlocks);
  };

  // Handle Image Upload
  const triggerUpload = (blockIdx, slideIdx = null) => {
    setUploadingIdx(blockIdx);
    setUploadingSlideIdx(slideIdx);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (res.ok && data.url) {
        const newBlocks = [...blocks];
        if (uploadingSlideIdx !== null) {
          newBlocks[uploadingIdx].items[uploadingSlideIdx].url = data.url;
        } else {
          newBlocks[uploadingIdx].url = data.url;
        }
        onChange(newBlocks);
      } else {
        alert(data.error || "Gagal upload gambar");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat upload");
    } finally {
      setUploadingIdx(null);
      setUploadingSlideIdx(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const renderBlockEditor = (block, idx) => {
    const commonHeader = (title, icon) => (
      <div className="flex justify-between items-center mb-3 bg-slate-50 px-4 py-3 rounded-t-2xl border-b border-slate-100">
        <div className="flex gap-3 items-center">
          <span className="text-[10px] font-extrabold text-[#1B2D4F] uppercase tracking-wider flex items-center gap-1.5 bg-white border px-2.5 py-1 rounded-lg shadow-sm">
            {icon}
            {title}
          </span>
          <div className="flex items-center bg-white border rounded-lg p-0.5 shadow-sm">
            <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0} className="text-slate-400 hover:text-blue-500 disabled:opacity-30 px-2 py-0.5 text-[10px] font-bold">▲</button>
            <span className="w-px h-3 bg-slate-200" />
            <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} className="text-slate-400 hover:text-blue-500 disabled:opacity-30 px-2 py-0.5 text-[10px] font-bold">▼</button>
          </div>
        </div>
        <button type="button" onClick={() => removeBlock(idx)} className="text-[10px] font-extrabold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100/60 hover:bg-red-100 transition active:scale-95 duration-100">Hapus</button>
      </div>
    );

    if (block.type === "h2" || block.type === "h3") {
      return (
        <div className="border border-slate-100 bg-white/80 rounded-2xl mb-4 overflow-hidden shadow-sm">
          {commonHeader(block.type === "h2" ? "Heading (Bab)" : "Sub-heading", "🏷️")}
          <div className="p-4">
            <input 
              type="text" 
              value={block.text} 
              onChange={(e) => updateBlock(idx, "text", e.target.value)} 
              placeholder="Masukkan judul heading..." 
              className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-[#1B2D4F] ${block.type === "h2" ? "font-extrabold text-base" : "font-bold text-sm"}`} 
            />
          </div>
        </div>
      );
    }

    if (block.type === "p" || block.type === "callout") {
      return (
        <div className="border border-slate-100 bg-white/80 rounded-2xl mb-4 overflow-hidden shadow-sm">
          {commonHeader(block.type === "p" ? "Paragraf" : "Catatan / Info", block.type === "p" ? "📝" : "💡")}
          <div className="p-4">
            <textarea 
              value={block.text} 
              onChange={(e) => updateBlock(idx, "text", e.target.value)} 
              placeholder="Tulis isi paragraf di sini..." 
              rows={3} 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-sm font-medium text-[#1B2D4F] leading-relaxed" 
            />
          </div>
        </div>
      );
    }

    if (block.type === "ul" || block.type === "ol") {
      return (
        <div className="border border-slate-100 bg-white/80 rounded-2xl mb-4 overflow-hidden shadow-sm">
          {commonHeader(block.type === "ul" ? "Daftar Biasa" : "Daftar Bernomor", block.type === "ul" ? "•" : "1.")}
          <div className="p-4 space-y-2">
            {block.items.map((item, iIdx) => (
              <div key={iIdx} className="flex gap-2">
                <span className="mt-2.5 text-slate-400 font-bold text-xs flex-shrink-0 w-4 text-center">{block.type === "ol" ? `${iIdx + 1}.` : "•"}</span>
                <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[iIdx] = e.target.value;
                    updateBlock(idx, "items", newItems);
                  }} 
                  placeholder="Masukkan isi item..." 
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-xs font-semibold text-[#1B2D4F]" 
                />
                <button type="button" onClick={() => {
                  const newItems = [...block.items];
                  newItems.splice(iIdx, 1);
                  updateBlock(idx, "items", newItems);
                }} className="text-red-400 hover:text-red-600 px-2 font-bold text-xs bg-red-50/50 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition duration-100">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => updateBlock(idx, "items", [...block.items, ""])} className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100/50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg mt-2 transition active:scale-95 duration-100">+ Tambah Item</button>
          </div>
        </div>
      );
    }

    if (block.type === "image") {
      return (
        <div className="border border-slate-100 bg-white/80 rounded-2xl mb-4 overflow-hidden shadow-sm">
          {commonHeader("Gambar / Foto", "🖼️")}
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {block.url ? (
                <div className="w-full sm:w-28 h-28 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative flex-shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={block.url} alt="preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full sm:w-28 h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                  <span className="text-2xl mb-1">🖼️</span>
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Kosong</span>
                </div>
              )}
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5 ml-1">File Gambar</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={block.url} 
                      onChange={(e) => updateBlock(idx, "url", e.target.value)} 
                      placeholder="/uploads/... atau https://..." 
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-xs font-semibold text-[#1B2D4F]" 
                    />
                    <button type="button" onClick={() => triggerUpload(idx)} className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition active:scale-95 duration-100">Upload</button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5 ml-1">Keterangan (Caption)</label>
                  <input 
                    type="text" 
                    value={block.caption || ""} 
                    onChange={(e) => updateBlock(idx, "caption", e.target.value)} 
                    placeholder="Tulis caption gambar di sini..." 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-xs font-semibold text-[#1B2D4F]" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "video") {
      return (
        <div className="border border-slate-100 bg-white/80 rounded-2xl mb-4 overflow-hidden shadow-sm">
          {commonHeader("Video Player", "▶️")}
          <div className="p-4 space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5 ml-1">URL Youtube/Vimeo</label>
              <input 
                type="text" 
                value={block.url} 
                onChange={(e) => updateBlock(idx, "url", e.target.value)} 
                placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..." 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-xs font-semibold text-[#1B2D4F]" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5 ml-1">Keterangan Video (Aksesibilitas)</label>
              <input 
                type="text" 
                value={block.caption || ""} 
                onChange={(e) => updateBlock(idx, "caption", e.target.value)} 
                placeholder="Tulis judul atau keterangan video..." 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 text-xs font-semibold text-[#1B2D4F]" 
              />
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "slides") {
      return (
        <div className="border border-slate-100 bg-white/80 rounded-2xl mb-4 overflow-hidden shadow-sm">
          {commonHeader("Banner Slider (Multi-Slide)", "📑")}
          <div className="p-4 space-y-3 bg-slate-50/50">
            {block.items.map((slide, sIdx) => (
              <div key={sIdx} className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 relative">
                <button type="button" onClick={() => {
                  const newItems = [...block.items];
                  newItems.splice(sIdx, 1);
                  updateBlock(idx, "items", newItems);
                }} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full w-6 h-6 flex items-center justify-center border border-red-100/60 font-bold text-xs transition active:scale-95 duration-100">✕</button>
                
                {slide.url ? (
                  <div className="w-full sm:w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.url} alt="slide" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full sm:w-20 h-20 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                    <span className="text-xl">🖼️</span>
                  </div>
                )}
                <div className="flex-1 space-y-2 pr-6">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={slide.url} 
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[sIdx].url = e.target.value;
                        updateBlock(idx, "items", newItems);
                      }} 
                      placeholder="URL Gambar Slide..." 
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs font-semibold text-[#1B2D4F]" 
                    />
                    <button type="button" onClick={() => triggerUpload(idx, sIdx)} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition active:scale-95 duration-100">Upload</button>
                  </div>
                  <input 
                    type="text" 
                    value={slide.caption || ""} 
                    onChange={(e) => {
                      const newItems = [...block.items];
                      newItems[sIdx].caption = e.target.value;
                      updateBlock(idx, "items", newItems);
                    }} 
                    placeholder="Caption Slide..." 
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs font-semibold text-[#1B2D4F]" 
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => updateBlock(idx, "items", [...block.items, { url: "", caption: "" }])} className="text-xs font-extrabold text-blue-600 bg-white border border-slate-200/50 hover:bg-slate-50 py-3 rounded-2xl w-full shadow-sm hover:shadow transition active:scale-98 duration-100 flex items-center justify-center gap-1.5">+ Tambah Slide Baru</button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input for uploads */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      {blocks.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Belum ada konten</p>
          <p className="text-[11px] text-slate-400 font-semibold">Gunakan menu di bawah untuk menyusun artikel materi Anda</p>
        </div>
      ) : (
        <div className="space-y-1">
          {blocks.map((block, idx) => (
            <div key={idx}>{renderBlockEditor(block, idx)}</div>
          ))}
        </div>
      )}

      {/* Visual Block Toolbox Grid */}
      <div className="border border-dashed border-blue-300 bg-blue-50/30 p-5 rounded-[2rem] shadow-inner">
        <p className="text-[11px] font-extrabold text-blue-800 mb-3 uppercase tracking-widest flex items-center gap-1.5 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-ping" />
          Klik untuk Tambah Elemen Blok
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <button type="button" onClick={() => addBlock("p")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">📝 Paragraf</button>
          <button type="button" onClick={() => addBlock("h2")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">🏷️ Judul Bab (H2)</button>
          <button type="button" onClick={() => addBlock("h3")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">🏷️ Sub-Bab (H3)</button>
          <button type="button" onClick={() => addBlock("image")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">🖼️ Gambar Tunggal</button>
          <button type="button" onClick={() => addBlock("slides")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">📑 Banner Slider</button>
          <button type="button" onClick={() => addBlock("video")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">▶️ Video Youtube</button>
          <button type="button" onClick={() => addBlock("ul")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">• Daftar Poin</button>
          <button type="button" onClick={() => addBlock("ol")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center">1. Daftar Nomor</button>
          <button type="button" onClick={() => addBlock("callout")} className="px-4 py-3 bg-white border border-slate-100 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-bold rounded-2xl shadow-sm hover:shadow transition active:scale-95 duration-100 flex items-center gap-2 justify-center col-span-2 sm:col-span-1">💡 Kotak Catatan</button>
        </div>
      </div>
    </div>
  );
}
