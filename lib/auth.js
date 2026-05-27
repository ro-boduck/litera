/**
 * @fileoverview Authentication utility functions for LITERA CMS.
 * Handles JWT token generation, verification, and server-side session extraction.
 * Session tokens are stored in HttpOnly, Secure cookies to prevent XSS-based theft.
 */

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET ?? "litera-cms-secret-change-in-prod-2026";
const COOKIE_NAME = "litera_admin_token";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

/**
 * Signs a JWT payload with the application secret.
 * @param {object} payload - The user/admin data payload to sign.
 * @returns {string} The signed JWT string.
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE_SECONDS });
}

/**
 * Verifies a JWT token string.
 * @param {string} token - The raw JWT token string from cookies.
 * @returns {object|null} The decoded token payload if valid, or null if expired/invalid.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extracts and decodes the active admin session payload from cookies.
 * This function can only be run in Server Components or Server Route Handlers.
 * @returns {Promise<object|null>} Decoded admin session payload, or null if unauthenticated.
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { COOKIE_NAME, MAX_AGE_SECONDS };
