/**
 * GET  /api/messages     — list all user messages (admin session only)
 * POST /api/messages     — create a user message (public)
 */

import { NextResponse } from "next/server";
import { getAllMessages, createMessage } from "../../../lib/db";
import { getAdminSession } from "../../../lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await getAllMessages();
    return NextResponse.json(messages);
  } catch (err) {
    console.error("[API] GET /api/messages:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 }
      );
    }

    const { id } = await createMessage(body);
    const created = { id, ...body };
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/messages:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
