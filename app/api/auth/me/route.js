/**
 * GET /api/auth/me
 * Returns current session info (used by client to check auth state).
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "../../../../lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, username: session.username });
}
