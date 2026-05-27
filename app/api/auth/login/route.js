/**
 * @fileoverview Authentication Endpoint: Admin Login.
 * Handles credential verification, triggers automatic initial administrator seeding if zero accounts exist,
 * signs JWT session tokens, and exposes a secure HttpOnly cookie session mechanism.
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminByUsername, adminCount, createAdmin } from "../../../../lib/db";
import { signToken, COOKIE_NAME, MAX_AGE_SECONDS } from "../../../../lib/auth";

/**
 * Handles POST requests for administrator authentication.
 * If no administrators exist in the database, the credentials provided in the request body
 * are automatically registered as the primary administrator account (seeding setup mode).
 * @param {Request} request The Next.js incoming request object containing `{ username, password }` in the JSON body.
 * @returns {Promise<NextResponse>} Clean HTTP response containing success status and HTTP cookie configuration.
 */
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Auto-seed first admin if none exist (setup mode)
    if ((await adminCount()) === 0) {
      const hash = await bcrypt.hash(password, 12);
      await createAdmin(username, hash);
    }

    const admin = await getAdminByUsername(username);
    if (!admin) {
      return NextResponse.json({ error: "Kredensial tidak valid" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Kredensial tidak valid" }, { status: 401 });
    }

    const token = signToken({ id: admin.id, username: admin.username });

    const response = NextResponse.json({ success: true, username: admin.username });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[API] POST /api/auth/login:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
