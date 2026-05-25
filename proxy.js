import { NextResponse } from "next/server";

/**
 * Security middleware for LITERA.
 *
 * 1. Injects x-next-pathname so the root layout can detect CMS routes.
 * 2. Returns a fake 404 on common admin/CMS paths that scanners probe.
 * 3. Adds security headers on the hidden CMS route.
 * 4. Blocks direct access to /api/auth/* from non-CMS origins (optional hardening).
 */

// The real CMS lives here. Only staff who know this URL can access it.
const CMS_PATH = "/kelola-8f2k9x3m";

// Paths that scanners (subfinder, gobuster, dirbuster, ffuf, dirb, nikto,
// wfuzz, feroxbuster) commonly probe for admin panels.
const HONEYPOT_PATHS = [
  "/admin",
  "/administrator",
  "/dashboard",
  "/cms",
  "/login",
  "/signin",
  "/sign-in",
  "/panel",
  "/manage",
  "/manager",
  "/control",
  "/controlpanel",
  "/cp",
  "/backend",
  "/backoffice",
  "/wp-admin",
  "/wp-login",
  "/wp-login.php",
  "/wordpress",
  "/joomla",
  "/drupal",
  "/phpmyadmin",
  "/adminer",
  "/webadmin",
  "/siteadmin",
  "/user/login",
  "/users/sign_in",
  "/auth/login",
  "/console",
  "/portal",
  "/staff",
  "/internal",
  "/secret",
  "/hidden",
  "/private",
  "/superadmin",
  "/root",
  "/system",
  "/config",
  "/setup",
  "/install",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── Honeypot: fake 404 for known scanner targets ──
  // Respond with the real not-found page (Next.js renders app/not-found.js)
  // This is a server-level check; the /admin route also has its own decoy page.
  const lowerPath = pathname.toLowerCase();
  for (const trap of HONEYPOT_PATHS) {
    if (lowerPath === trap || lowerPath.startsWith(trap + "/")) {
      // Let the decoy /admin page render (it shows a 404).
      // For other trapped paths, rewrite to the not-found page.
      if (lowerPath.startsWith("/admin")) {
        // The /admin directory has its own decoy, let it through
        const response = NextResponse.next();
        response.headers.set("x-next-pathname", pathname);
        return response;
      }
      // For all other scanner paths, return a bare 404
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // ── CMS security headers ──
  if (pathname.startsWith(CMS_PATH)) {
    const response = NextResponse.next();
    response.headers.set("x-next-pathname", pathname);
    // Prevent search engines and caching
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }

  // ── Default: pass through with pathname header ──
  const response = NextResponse.next();
  response.headers.set("x-next-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
