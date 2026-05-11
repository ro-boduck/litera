/**
 * GET    /api/materi/[id]   — single material (public)
 * PUT    /api/materi/[id]   — update material (admin only)
 * DELETE /api/materi/[id]   — delete material (admin only)
 */

import { NextResponse } from "next/server";
import { getMaterialById, updateMaterial, deleteMaterial } from "../../../../lib/db";
import { getAdminSession } from "../../../../lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const material = getMaterialById(id);
    if (!material) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(material);
  } catch (err) {
    console.error("[API] GET /api/materi/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.cat || !body.title || !body.desc) {
      return NextResponse.json(
        { error: "cat, title, and desc are required" },
        { status: 400 }
      );
    }

    const changes = updateMaterial(id, body);
    if (changes === 0) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    const updated = getMaterialById(id);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[API] PUT /api/materi/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const changes = deleteMaterial(id);
    if (changes === 0) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] DELETE /api/materi/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
