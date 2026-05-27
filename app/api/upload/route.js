/**
 * @fileoverview File Upload API Endpoint.
 * Supports image file uploads for dynamic course materials.
 * Integrates dual storage modes: Vercel Blob Storage for cloud production deployment
 * and a local file system storage fallback for development environments.
 */

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { getAdminSession } from "../../../lib/auth";

const isVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Handles POST requests to upload image files.
 * Requires active administrator authentication to prevent unauthorized uploads.
 * Validates file MIME types and extensions to secure the application against unauthorized executable uploads (XSS/RCE).
 * Dynamically switches upload targets between Vercel Blob Storage and local public/uploads directory.
 * @param {Request} request Next.js request object containing form data with the target 'file'.
 * @returns {Promise<NextResponse>} JSON containing the accessible file URL, or 400/401/500 error status codes.
 */
export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // Validate file type & extension to prevent malicious uploads (XSS/RCE)
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];

    const fileExt = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(fileExt) || !allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak valid. Hanya diperbolehkan mengunggah file gambar (PNG, JPG, JPEG, WEBP, SVG, GIF)." },
        { status: 400 }
      );
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
