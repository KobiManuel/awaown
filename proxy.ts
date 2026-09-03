import { NextRequest, NextResponse } from "next/server";

// Route prefix → the dashboard role that may enter it. The real auth check
// (JWT + /auth/me + onboarding) still runs client-side in AppFrame; this only
// stops a logged-out visitor from ever rendering a gated shell.
const GUARDED: { prefix: string; role: string }[] = [
  { prefix: "/dashboard", role: "customer" },
  { prefix: "/merchant", role: "merchant" },
  { prefix: "/partner", role: "partner" },
  { prefix: "/admin", role: "admin" },
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const match = GUARDED.find(
    (g) => pathname === g.prefix || pathname.startsWith(g.prefix + "/"),
  );
  if (!match) return NextResponse.next();

  // `awaown_session` holds every dashboard role this browser is signed into,
  // comma-separated (one browser can hold a customer + merchant session at once).
  const roles = new Set(
    (req.cookies.get("awaown_session")?.value ?? "")
      .split(",")
      .map((r) => r.trim().toLowerCase())
      .filter(Boolean),
  );
  if (roles.has(match.role)) return NextResponse.next();

  // Not signed into the dashboard being requested → send to its own login,
  // carrying `next` so the OTP flow returns here. We deliberately do NOT bounce
  // to whatever other dashboard the browser happens to be signed into.
  const login = new URL(`/login/${match.role}`, req.url);
  login.searchParams.set("next", pathname + req.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/dashboard/:path*", "/merchant/:path*", "/partner/:path*", "/admin/:path*"],
};
