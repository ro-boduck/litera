/**
 * GET  /api/materi      — list all materials (public)
 * POST /api/materi      — create material (admin only)
 */

import { NextResponse } from "next/server";
import { getAllMaterials, createMaterial } from "../../../lib/db";
import { getAdminSession } from "../../../lib/auth";

export async function GET() {
  try {
    const materials = getAllMaterials();
    return NextResponse.json(materials);
  } catch (err) {
    console.error("[API] GET /api/materi:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.cat || !body.title || !body.desc) {
      return NextResponse.json(
        { error: "cat, title, and desc are required" },
        { status: 400 }
      );
    }

    const { id } = createMaterial(body);
    const created = { id, ...body };
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/materi:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
