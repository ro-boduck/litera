/**
 * LITERA — Auth Utilities
 * JWT-based session for the admin CMS.
 *
 * Tokens are stored in an HttpOnly, Secure cookie so they
 * are never accessible from JavaScript (XSS protection).
 */

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET ?? "litera-cms-secret-change-in-prod-2026";
const COOKIE_NAME = "litera_admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE_SECONDS });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Returns the decoded admin payload from the session cookie,
 * or null if not authenticated. Must be called from a Server Component
 * or Route Handler (not client components).
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { COOKIE_NAME, MAX_AGE_SECONDS };
