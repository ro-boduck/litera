/**
 * @fileoverview Educational Materials Management API Endpoint.
 * Serves public GET requests to fetch all courses/materials and handles authenticated POST requests
 * for administrative material registration/creation.
 */

import { NextResponse } from "next/server";
import { getAllMaterials, createMaterial } from "../../../lib/db";
import { getAdminSession } from "../../../lib/auth";

/**
 * Handles GET requests to retrieve a list of all educational materials.
 * Accessible publicly without active authentication.
 * @returns {Promise<NextResponse>} List of material database records or 500 server error status.
 */
export async function GET() {
  try {
    const materials = await getAllMaterials();
    return NextResponse.json(materials);
  } catch (err) {
    console.error("[API] GET /api/materi:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles POST requests to register a new educational material block.
 * Requires active administrator authentication. Validates input schema properties (`cat`, `title`, and `desc`).
 * @param {Request} request Next.js request object containing material properties in JSON format.
 * @returns {Promise<NextResponse>} Metadata of the registered database record, or HTTP error status codes (401, 400, 500).
 */
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

    const { id } = await createMaterial(body);
    const created = { id, ...body };
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/materi:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
