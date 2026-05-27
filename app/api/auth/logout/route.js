/**
 * @fileoverview Authentication Endpoint: Admin Logout.
 * Provides a clean session invalidation mechanism by purging the HttpOnly authorization cookie.
 */

import { NextResponse } from "next/server";
import { COOKIE_NAME } from "../../../../lib/auth";

/**
 * Handles POST requests to terminate the administrator session.
 * Overwrites the active authentication cookie with an empty string and sets its maxAge to 0 to force client-side expiration.
 * @returns {NextResponse} Response confirming successful session termination.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
