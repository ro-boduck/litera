/**
 * @fileoverview Contact Messages API Endpoint.
 * Serves public POST requests to submit user messages/queries and authenticated GET requests
 * for administrators to review submitted user communications.
 */

import { NextResponse } from "next/server";
import { getAllMessages, createMessage } from "../../../lib/db";
import { getAdminSession } from "../../../lib/auth";

/**
 * Handles GET requests to retrieve a list of all contact messages.
 * Requires active administrator authentication.
 * @returns {Promise<NextResponse>} List of user message records, or HTTP error status codes (401, 500).
 */
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

/**
 * Handles POST requests to submit a new contact message.
 * Accessible publicly. Validates required schema properties (`name`, `email`, and `message`).
 * @param {Request} request Next.js request object containing the message properties in JSON format.
 * @returns {Promise<NextResponse>} The created message object metadata, or 400 Bad Request if validation fails.
 */
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
