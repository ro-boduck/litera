/**
 * DELETE /api/messages/[id]   — delete a specific user message (admin session only)
 */

import { NextResponse } from "next/server";
import { deleteMessage } from "../../../../lib/db";
import { getAdminSession } from "../../../../lib/auth";

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
