import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Bikin nama file unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Path public/uploads (pastikan folder ada, tapi kita bisa pakai process.cwd)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Kita asumsikan folder uploads sudah ada, kalau belum nanti bikin pakai script atau manual
    try {
      await writeFile(filepath, buffer);
    } catch (e) {
      // Coba bikin foldernya kalau gagal (Error: ENOENT)
      const { mkdir } = require('fs/promises');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filepath, buffer);
    }

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
