import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const isVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

    if (isVercelBlob) {
      // Use Vercel Blob Storage
      const blob = await put(filename, file, { access: 'public' });
      return NextResponse.json({ url: blob.url });
    } else {
      // Local file system fallback
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filepath = path.join(uploadDir, filename);

      try {
        await writeFile(filepath, buffer);
      } catch (e) {
        await mkdir(uploadDir, { recursive: true });
        await writeFile(filepath, buffer);
      }

      return NextResponse.json({ url: `/uploads/${filename}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
