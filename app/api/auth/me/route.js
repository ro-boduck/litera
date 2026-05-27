/**
 * @fileoverview Authentication Endpoint: Active Session Query.
 * Allows client-side layers to securely verify the active administrator session state and retrieve identity details.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";

/**
 * Handles GET requests to check the current administrator session status.
 * Reads the secure HttpOnly cookie, decodes and verifies the JWT, and returns authenticated user metadata if valid.
 * @returns {Promise<NextResponse>} Authentication details (authenticated status and username) or 401 Unauthorized status.
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, username: session.username });
}
