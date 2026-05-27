/**
 * @fileoverview Individual Contact Message API Endpoint.
 * Serves authenticated DELETE requests for administrators to purge specific user messages/queries by ID.
 */

import { NextResponse } from "next/server";
import { deleteMessage } from "../../../../lib/db";
import { getAdminSession } from "../../../../lib/auth";

/**
 * Handles DELETE requests to remove a user contact message record by ID.
 * Requires active administrator authentication.
 * @param {Request} request Next.js request object.
 * @param {object} context Route handler context parameters.
 * @param {Promise<{id: string}>} context.params Async route params containing the target message ID.
 * @returns {Promise<NextResponse>} Success confirmation payload, or HTTP error status codes (401, 404, 500).
 */
export async function DELETE(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const changes = await deleteMessage(id);
    if (changes === 0) {
      return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] DELETE /api/messages/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
