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
      // Tampilkan indikator loading (bisa diperbaiki dengan state khusus loading per blok, tapi sederhana saja dulu)
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
    const commonHeader = (title) => (
      <div className="flex justify-between items-center mb-2 bg-slate-50 p-2 rounded border-b">
        <div className="flex gap-2 items-center">
          <span className="text-xs font-bold text-slate-500 uppercase">{title}</span>
          <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0} className="text-slate-400 hover:text-blue-500 disabled:opacity-30">▲</button>
          <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} className="text-slate-400 hover:text-blue-500 disabled:opacity-30">▼</button>
        </div>
        <button type="button" onClick={() => removeBlock(idx)} className="text-xs text-red-500 hover:underline">Hapus</button>
      </div>
    );

    if (block.type === "h2" || block.type === "h3") {
      return (
        <div className="border rounded-lg mb-3 overflow-hidden bg-white">
          {commonHeader(block.type === "h2" ? "Heading (Bab)" : "Sub-heading")}
          <div className="p-3">
            <input type="text" value={block.text} onChange={(e) => updateBlock(idx, "text", e.target.value)} placeholder="Masukkan judul..." className={`w-full px-3 py-2 border rounded outline-none focus:border-blue-500 ${block.type === "h2" ? "font-bold text-lg" : "font-semibold text-base"}`} />
          </div>
        </div>
      );
    }

    if (block.type === "p" || block.type === "callout") {
      return (
        <div className="border rounded-lg mb-3 overflow-hidden bg-white">
          {commonHeader(block.type === "p" ? "Paragraf" : "Catatan / Info")}
          <div className="p-3">
            <textarea value={block.text} onChange={(e) => updateBlock(idx, "text", e.target.value)} placeholder="Isi teks..." rows={3} className="w-full px-3 py-2 border rounded outline-none focus:border-blue-500 text-sm" />
          </div>
        </div>
      );
    }

    if (block.type === "ul" || block.type === "ol") {
      return (
        <div className="border rounded-lg mb-3 overflow-hidden bg-white">
          {commonHeader(block.type === "ul" ? "Daftar Biasa" : "Daftar Bernomor")}
          <div className="p-3 space-y-2">
            {block.items.map((item, iIdx) => (
              <div key={iIdx} className="flex gap-2">
                <span className="mt-2 text-slate-400 text-sm">{block.type === "ol" ? `${iIdx + 1}.` : "•"}</span>
                <input type="text" value={item} onChange={(e) => {
                  const newItems = [...block.items];
                  newItems[iIdx] = e.target.value;
                  updateBlock(idx, "items", newItems);
                }} placeholder="Isi item..." className="w-full px-3 py-1.5 border rounded outline-none focus:border-blue-500 text-sm" />
                <button type="button" onClick={() => {
                  const newItems = [...block.items];
                  newItems.splice(iIdx, 1);
                  updateBlock(idx, "items", newItems);
                }} className="text-red-400 hover:text-red-600 px-1">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => updateBlock(idx, "items", [...block.items, ""])} className="text-xs text-blue-600 font-medium mt-1">+ Tambah Item</button>
          </div>
        </div>
      );
    }

    if (block.type === "image") {
      return (
        <div className="border rounded-lg mb-3 overflow-hidden bg-white">
          {commonHeader("Gambar / Foto")}
          <div className="p-3 space-y-3">
            <div className="flex gap-3">
              {block.url ? (
                <div className="w-24 h-24 bg-slate-100 rounded border relative flex-shrink-0">
                  <img src={block.url} alt="preview" className="w-full h-full object-cover rounded" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-slate-50 border border-dashed rounded flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                  <span className="text-2xl mb-1">🖼</span>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">File Gambar</label>
                  <div className="flex gap-2">
                    <input type="text" value={block.url} onChange={(e) => updateBlock(idx, "url", e.target.value)} placeholder="/uploads/... atau https://..." className="flex-1 px-3 py-1.5 border rounded outline-none focus:border-blue-500 text-sm" />
                    <button type="button" onClick={() => triggerUpload(idx)} className="px-3 py-1.5 bg-slate-100 border rounded text-sm hover:bg-slate-200">Upload</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium block mb-1">Keterangan (Caption)</label>
                  <input type="text" value={block.caption || ""} onChange={(e) => updateBlock(idx, "caption", e.target.value)} placeholder="Teks keterangan di bawah gambar..." className="w-full px-3 py-1.5 border rounded outline-none focus:border-blue-500 text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "video") {
      return (
        <div className="border rounded-lg mb-3 overflow-hidden bg-white">
          {commonHeader("Video Youtube/Vimeo")}
          <div className="p-3 space-y-3">
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">URL Embed Video</label>
              <input type="text" value={block.url} onChange={(e) => updateBlock(idx, "url", e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full px-3 py-1.5 border rounded outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Judul Video (Aksesibilitas)</label>
              <input type="text" value={block.caption || ""} onChange={(e) => updateBlock(idx, "caption", e.target.value)} placeholder="Judul video..." className="w-full px-3 py-1.5 border rounded outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "slides") {
      return (
        <div className="border rounded-lg mb-3 overflow-hidden bg-white">
          {commonHeader("Banner Slider / Slides")}
          <div className="p-3 space-y-3 bg-slate-50">
            {block.items.map((slide, sIdx) => (
              <div key={sIdx} className="bg-white p-3 border rounded shadow-sm flex gap-3 relative">
                <button type="button" onClick={() => {
                  const newItems = [...block.items];
                  newItems.splice(sIdx, 1);
                  updateBlock(idx, "items", newItems);
                }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold bg-white rounded-full w-5 h-5 flex items-center justify-center border">✕</button>
                
                {slide.url ? (
                  <div className="w-20 h-20 bg-slate-100 rounded border relative flex-shrink-0">
                    <img src={slide.url} alt="slide" className="w-full h-full object-cover rounded" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-50 border border-dashed rounded flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                    <span className="text-xl">🖼</span>
                  </div>
                )}
                <div className="flex-1 space-y-2 pr-4">
                  <div className="flex gap-2">
                    <input type="text" value={slide.url} onChange={(e) => {
                      const newItems = [...block.items];
                      newItems[sIdx].url = e.target.value;
                      updateBlock(idx, "items", newItems);
                    }} placeholder="URL gambar..." className="flex-1 px-2 py-1 border rounded outline-none focus:border-blue-500 text-xs" />
                    <button type="button" onClick={() => triggerUpload(idx, sIdx)} className="px-2 py-1 bg-slate-100 border rounded text-xs hover:bg-slate-200">Upload</button>
                  </div>
                  <input type="text" value={slide.caption || ""} onChange={(e) => {
                    const newItems = [...block.items];
                    newItems[sIdx].caption = e.target.value;
                    updateBlock(idx, "items", newItems);
                  }} placeholder="Caption slide..." className="w-full px-2 py-1 border rounded outline-none focus:border-blue-500 text-xs" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => updateBlock(idx, "items", [...block.items, { url: "", caption: "" }])} className="text-xs text-blue-600 font-medium px-1 bg-white border py-1.5 rounded w-full shadow-sm">+ Tambah Slide Baru</button>
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
        <div className="text-center py-8 bg-slate-50 border border-dashed rounded-xl">
          <p className="text-slate-500 text-sm mb-2">Belum ada konten.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {blocks.map((block, idx) => (
            <div key={idx}>{renderBlockEditor(block, idx)}</div>
          ))}
        </div>
      )}

      {/* Toolbox */}
      <div className="border border-dashed border-blue-300 bg-blue-50/50 p-4 rounded-xl">
        <p className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide">Tambah Blok Baru</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => addBlock("p")} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs rounded hover:bg-blue-100 transition shadow-sm">Paragraf</button>
          <button type="button" onClick={() => addBlock("h2")} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs rounded hover:bg-blue-100 transition shadow-sm">Bab (H2)</button>
          <button type="button" onClick={() => addBlock("h3")} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs rounded hover:bg-blue-100 transition shadow-sm">Sub-bab (H3)</button>
          <button type="button" onClick={() => addBlock("image")} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs rounded hover:bg-emerald-50 transition shadow-sm">🖼 Gambar / Foto</button>
          <button type="button" onClick={() => addBlock("slides")} className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs rounded hover:bg-emerald-50 transition shadow-sm">📑 Banner Slider</button>
          <button type="button" onClick={() => addBlock("video")} className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 text-xs rounded hover:bg-rose-50 transition shadow-sm">▶ Video</button>
          <button type="button" onClick={() => addBlock("ul")} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs rounded hover:bg-slate-100 transition shadow-sm">Daftar Titik</button>
          <button type="button" onClick={() => addBlock("ol")} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs rounded hover:bg-slate-100 transition shadow-sm">Daftar Nomor</button>
          <button type="button" onClick={() => addBlock("callout")} className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs rounded hover:bg-indigo-50 transition shadow-sm">Catatan (Info)</button>
        </div>
      </div>
    </div>
  );
}
