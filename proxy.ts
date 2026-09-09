import { NextRequest, NextResponse } from "next/server";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Route prefix → the dashboard role that may enter it. The real auth check
// (JWT + /auth/me + onboarding) still runs client-side in AppFrame; this only
// stops a logged-out visitor from ever rendering a gated shell.
const GUARDED: { prefix: string; role: string }[] = [
  { prefix: "/dashboard", role: "customer" },
  { prefix: "/merchant", role: "merchant" },
  { prefix: "/partner", role: "partner" },
  { prefix: "/admin", role: "admin" },
];

const MAINT_COOKIE = "awaown_maint_ok";

// The admin panel and its login always stay reachable during maintenance.
function isAdminArea(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/login/admin" ||
    pathname.startsWith("/login/admin/")
  );
}

async function maintenanceGate(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;
  if (isAdminArea(pathname) || pathname === "/maintenance") return null;

  // Unlock: visiting any page with ?access=<key> validates it server-side and,
  // if correct, drops a cookie that lets this browser through until it expires.
  const accessKey = req.nextUrl.searchParams.get("access");
  if (accessKey) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("access");
    const res = NextResponse.redirect(clean);
    try {
      const r = await fetch(`${API}/site/unlock`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: accessKey }),
      });
      if (r.ok) {
        res.cookies.set(MAINT_COOKIE, "1", {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: "lax",
          secure: true,
        });
      }
    } catch {
      /* backend unreachable - let the redirect through without the cookie */
    }
    return res;
  }

  if (req.cookies.get(MAINT_COOKIE)) return null;

  try {
    const r = await fetch(`${API}/site/status`, { cache: "no-store" });
    if (r.ok) {
      const s = (await r.json()) as { maintenance?: boolean };
      if (s.maintenance) {
        const url = req.nextUrl.clone();
        url.pathname = "/maintenance";
        url.search = "";
        return NextResponse.rewrite(url);
      }
    }
  } catch {
    /* fail open: never block the site because the status check failed */
  }
  return null;
}

function dashboardGuard(req: NextRequest): NextResponse {
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
  // carrying `next` so the sign-in flow returns here.
  const login = new URL(`/login/${match.role}`, req.url);
  login.searchParams.set("next", pathname + req.nextUrl.search);
  return NextResponse.redirect(login);
}

export async function proxy(req: NextRequest) {
  const maint = await maintenanceGate(req);
  if (maint) return maint;
  return dashboardGuard(req);
}

export const config = {
  matcher: [
    // everything except Next internals and static assets
    "/((?!_next/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|txt|xml|woff2?|ttf|map)$).*)",
  ],
};
