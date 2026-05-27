/**
 * @fileoverview Individual Material Route Handler Endpoint.
 * Serves public GET requests for single course material items, and provides authenticated PUT (update)
 * and DELETE (removal) operations for administration.
 */

import { NextResponse } from "next/server";
import { getMaterialById, updateMaterial, deleteMaterial } from "../../../../lib/db";
import { getAdminSession } from "../../../../lib/auth";

/**
 * Handles GET requests to retrieve a single educational material record by ID.
 * Accessible publicly.
 * @param {Request} request Next.js request object.
 * @param {object} context Route handler context parameters.
 * @param {Promise<{id: string}>} context.params Async route params containing the material ID.
 * @returns {Promise<NextResponse>} Material record, 404 error if not found, or 500 server error status.
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const material = await getMaterialById(id);
    if (!material) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(material);
  } catch (err) {
    console.error("[API] GET /api/materi/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles PUT requests to update an existing educational material record.
 * Requires active administrator authentication. Validates input schema properties (`cat`, `title`, and `desc`).
 * @param {Request} request Next.js request object containing updated properties in JSON format.
 * @param {object} context Route handler context parameters.
 * @param {Promise<{id: string}>} context.params Async route params containing the material ID.
 * @returns {Promise<NextResponse>} Updated database record, or HTTP error status codes (401, 400, 404, 500).
 */
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

    const changes = await updateMaterial(id, body);
    if (changes === 0) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    const updated = await getMaterialById(id);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[API] PUT /api/materi/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to remove an educational material record.
 * Requires active administrator authentication.
 * @param {Request} request Next.js request object.
 * @param {object} context Route handler context parameters.
 * @param {Promise<{id: string}>} context.params Async route params containing the material ID.
 * @returns {Promise<NextResponse>} Success confirmation payload, or HTTP error status codes (401, 404, 500).
 */
export async function DELETE(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const changes = await deleteMaterial(id);
    if (changes === 0) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] DELETE /api/materi/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
