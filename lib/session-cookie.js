"use client";

/**
 * Frontend-owned copy of the `awaown_session` routing hint.
 *
 * The API also sets an `awaown_session` cookie, but when the frontend and API
 * live on different domains (Vercel + Railway) that cookie is scoped to the API
 * host and the Next.js middleware (proxy.ts) — which runs on the frontend host —
 * can't read it. So the frontend writes its own first-party copy here: a plain,
 * non-secret list of the dashboards this browser is signed into. The real auth
 * is still the JWT / refresh cookie; this only decides which shell to render.
 */
const NAME = "awaown_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function readRoles() {
  if (typeof document === "undefined") return new Set();
  const m = document.cookie.match(/(?:^|;\s*)awaown_session=([^;]*)/);
  const raw = m ? decodeURIComponent(m[1]) : "";
  return new Set(
    raw
      .split(",")
      .map((r) => r.trim().toLowerCase())
      .filter(Boolean),
  );
}

function writeRoles(roles) {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  if (roles.size === 0) {
    document.cookie = `${NAME}=; path=/; max-age=0; SameSite=Lax${secure}`;
    return;
  }
  const value = encodeURIComponent([...roles].join(","));
  document.cookie = `${NAME}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function markSignedIn(role) {
  if (!role) return;
  const roles = readRoles();
  roles.add(String(role).toLowerCase());
  writeRoles(roles);
}

export function markSignedOut(role) {
  const roles = readRoles();
  if (role) roles.delete(String(role).toLowerCase());
  else roles.clear();
  writeRoles(roles);
}

export function signedInRoles() {
  return [...readRoles()];
}
