# AwaOwn Backend Plan & Todo

> Merged doc. Two sources fed this:
> 1. The **auth/infra plan** (OTP onboarding, dashboard tokens, VPS) — this file.
> 2. The **"make the dummy real" feature backlog** — 4 rounds of PM feedback captured
>    while the frontend was built as client-only simulation. Full detail lives in the
>    Claude memory `awaown_backend_todo.md`
>    (`~/.claude/projects/c--dev-work-awaown/memory/`). Section 15 below is the
>    condensed index of it.

---

## ✅ Milestones 1–6 shipped (2026-08-31) — full marketplace, backend + frontend

- **M1** OTP auth foundation · **M2** auth frontend wiring (RTK Query, `useAuthBootstrap`,
  OTP UI, skeletons).
- **M3–4** Customer domain: catalog, cart, wishlist, addresses, wallet, orders +
  checkout + **escrow state machine**, reviews, notifications.
- **M5** Merchant domain (products CRUD, orders + confirm-ready, payouts + 2.5% fee,
  store profile, KYC submit) and Partner domain (marketplace, store listings +
  discount, earnings, withdrawals, store customization, KYC). Cross-role escrow split
  verified end-to-end.
- **M6** Admin panel: overview KPIs, merchant/partner moderation + KYC review, customer
  directory, order oversight, **product approval as a real publish gate**, finance +
  **refunds that move money**, automations toggle, coupons, campaigns, team roles,
  settings, audit log, global search.

**Not wired to backend yet** (backend exists where noted): `app/admin/content`
(HomepageEditor), `app/admin/marketing`, `app/admin/reports`; public storefronts
`/store/[code]` & `/shop/[slug]`; Next middleware guard. Media = base64, payments =
mock gateway, KYC = admin review queue. Run `cd backend && npx prisma migrate reset &&
npm run seed` to clear local test noise.

Demo logins (OTP prints to the API console): `customer@ / merchant@ / partner@ /
admin@awaown.com`.

<details><summary>Original milestone breakdown</summary>

## ✅ Milestones 1–4 shipped (2026-08-31)

- **M1 — OTP auth foundation** (see below).
- **M2 — auth frontend wiring**: RTK Query (`lib/api/*`), reworked `authSlice`,
  `useAuthBootstrap` guard (replaces the `localStorage.awaown_auth` check), OTP
  login/signup/onboarding UI, skeleton primitives (`components/ui/skeleton.jsx`).
- **M3–4 — customer domain, backend + frontend, verified end-to-end**:
  catalog (categories/products/detail/search/reviews), cart (with partner-link
  pricing), wishlist, addresses, wallet (mock top-up), orders + checkout + **escrow
  state machine** (direct + partner sales, 20% partner platform fee, coupons,
  `confirm-delivery` releases escrow), notifications. Every customer dashboard page
  wired to RTK Query with `isLoading`/`isFetching` + skeleton loaders. Seed provisions
  `customer@ / merchant@ / partner@awaown.com` + 8 products + coupons.

**Run:** `cd backend && npm run start:dev` (:3001), `npm run dev` (:3000).
Log in as `customer@awaown.com` (OTP prints to the API console).

### ⏳ Remaining — M5+: merchant / partner / admin dashboards
Schema already in place; needs backend modules + frontend wiring for `app/merchant/**`,
`app/partner/**`, `app/admin/**`. See §12 for the feature backlog.

---

## ✅ Milestone 1 — OTP auth foundation

The `backend/` NestJS + Prisma API is built and verified end-to-end against local
Postgres. See `backend/README.md` to run it. Sprint 1 below is complete except the
items explicitly deferred to Milestone 2 (frontend) / 3 (deploy). Test users from
verification remain in the local dev DB — `cd backend && npx prisma migrate reset`
to wipe, then `npm run seed`.

Verified: register → OTP (console/Mailtrap) → verify → tokens + httpOnly cookie →
onboarding (customer/merchant/partner, auto slug + referral code) → `/auth/me` →
refresh with rotation → **refresh-token reuse revokes the whole session family** →
per-dashboard token isolation (a customer-secret token claiming MERCHANT is rejected) →
OTP lockout after 5 attempts → 60s resend cooldown → admin OTP login (no register) →
uniform error envelope → audit rows for every action.

---

## 0) Where we are

- Frontend: Next.js 16 app at repo root. Customer / merchant / partner / admin
  dashboards **all built already** as client-only simulation — Redux slices
  (`lib/store/*Slice.js`) + `localStorage` persistence, no server.
- Auth today: `app/login/{customer,merchant,partner,admin}/page.js` dispatch a fake
  `login()` with `dummyUser` after a 900ms `setTimeout`. Guard is a direct
  `localStorage.getItem("awaown_auth")` read in `app/Components/Dashboard/AppFrame.js`
  and `app/dashboard/layout.tsx`. Password + social-button UI exists but does nothing.
- Goal now: **replace the auth simulation with a real NestJS + PostgreSQL backend**,
  starting with **email-OTP onboarding + login** (no passwords, no social login).

## 1) Stack & repo layout

- **Backend:** NestJS + Prisma + PostgreSQL, in a `backend/` folder at the repo root
  (same repo, standalone-intended — mirrors the cevver project the owner built the same
  way). Frontend calls `NEXT_PUBLIC_API_URL/api/*`.
- **ORM:** Prisma (migrations, `prisma studio` alongside pgAdmin).
- **Email:** provider abstraction — Nodemailer (Mailtrap) for local dev, Resend for
  staging/prod, chosen by `EMAIL_PROVIDER` env var.
- **OTP / rate-limit store:** a Postgres table to start. Redis only if/when it hurts.
- **Process/deploy:** PM2 or systemd on the VPS, Nginx reverse proxy, Let's Encrypt TLS.

## 2) VPS + database — answering the owner's questions

**"How do I test online, not just locally?"**
- Everyday dev stays local: local Postgres + `npm run start:dev` for the API +
  `next dev` for the frontend. Fast loop, no VPS involved.
- The VPS is a **staging** target. You deploy to it to prove the things localhost
  can't: TLS, CORS between real domains, env vars, real email sending, DB connectivity,
  reverse proxy. Point a `.env.staging` / Vercel-style env at the frontend
  (`NEXT_PUBLIC_API_URL=https://api-staging.awaown.com`) and hit it from your browser /
  Postman.
- Lifecycle: change locally → run backend tests → push branch → deploy to VPS →
  hit endpoint from browser/Postman → check rows in pgAdmin → confirm token + dashboard.

**"Do I need to host the database somewhere else?"**
- **No, not to start.** Install PostgreSQL on the same VPS as the API. One box, simplest
  to learn. This is fine for a pre-launch / low-traffic app.
- Connect pgAdmin from home to the VPS DB over an **SSH tunnel** (don't expose 5432 to
  the public internet — keep `listen_addresses='localhost'` and tunnel in). pgAdmin has
  built-in SSH tunnel support: host `localhost:5432` *through* SSH to the VPS.
- Move to managed Postgres (Neon / Supabase / DigitalOcean Managed DB / Railway) later
  **only** when you want automated backups + point-in-time restore + easy scaling. At
  that point the API keeps running on the VPS and just points `DATABASE_URL` at the
  managed host. Nothing else changes.
- Either way: automated `pg_dump` to off-box storage from day one.

## 3) Auth model — OTP only

**Sign up**
1. User picks account type (customer / merchant / partner) — admin is invite-only.
2. Enters full name + email.
3. `POST /api/auth/{role}/register` → backend creates a `pending` user, generates OTP,
   emails it. No token yet.
4. `POST /api/auth/{role}/verify` with the code → user becomes `active`,
   `email_verified_at` set → backend returns access + refresh tokens.
5. Frontend collects role-specific profile fields →
   `POST /api/onboarding/complete` → profile row created, onboarding marked done.
6. Welcome email. Redirect to the role dashboard.

**Login**
1. User enters email at `/login/{role}`.
2. `POST /api/auth/{role}/login` → OTP emailed (only if a user with that email + role
   exists; response is identical either way so it doesn't leak which emails are
   registered).
3. `POST /api/auth/{role}/login/verify` with the code → access + refresh tokens.

**Resend / recovery**
- `POST /api/auth/resend-otp` with `{ email, purpose }`.
- Rate limits: per-email and per-IP. Cooldown between sends (e.g. 60s). Max N sends per
  hour. Invalidate all prior OTPs of that purpose when a new one is issued.

**OTP security**
- 6 digits, 5-minute expiry.
- Store a **hash** (bcrypt/argon2), never the raw code.
- Max 5 verify attempts per code, then it's burned.
- Constant-ish response timing; generic error messages ("invalid or expired code").
- Every request / verify / failure written to `audit_logs`.

## 4) Dashboard-scoped tokens

Each dashboard gets its own token — being signed in as a customer must not grant
merchant/partner/admin access even for the same email.

- **Access token (JWT, ~15 min):** `{ sub, role, dashboard, sessionId, email, iat, exp }`
  where `dashboard` ∈ `customer_dashboard | merchant_dashboard | partner_dashboard |
  admin_dashboard`. Signed with a per-audience secret or carries an `aud` claim guards
  check.
- **Refresh token (~7–30 days):** opaque, stored **hashed** in `refresh_tokens`, one row
  per session, **rotated** on every use, revocable. Reuse of a rotated token → revoke
  the whole session family (theft detection).
- **Transport:** `httpOnly; Secure; SameSite=Lax` cookies, name-scoped per dashboard
  (`awaown_customer_rt` etc.) so tokens don't collide when one browser is logged into
  two roles. Access token returned in the JSON body, held in memory by the frontend.
  *(This replaces the current `localStorage.awaown_auth` guard — see §6.)*
- **Guards:** `CustomerGuard`, `MerchantGuard`, `PartnerGuard`, `AdminGuard`, plus a
  generic `RolesGuard`. Guard checks role **and** `dashboard` claim.

## 5) Database schema — first migration

**users** (auth identity only)
`id uuid pk · email citext · role enum · status enum(pending,active,blocked) ·
full_name · email_verified_at · last_login_at · created_at · updated_at`
— unique on `(email, role)` so one email can hold separate customer + merchant records.

**otp_codes**
`id · user_id fk (nullable until user exists) · email · purpose enum · code_hash ·
expires_at · attempts int · consumed_at · created_at · request_ip`

**refresh_tokens / sessions**
`id · user_id fk · dashboard · token_hash · family_id · user_agent · ip ·
expires_at · revoked_at · created_at · rotated_from`

**audit_logs**
`id · actor_user_id (nullable) · action · target_type · target_id · metadata jsonb ·
ip · user_agent · created_at`

**customer_profiles / merchant_profiles / partner_profiles / admin_profiles**
each `user_id fk unique` + role fields:
- customer: phone, delivery info (later)
- merchant: business_name, store_name, store_slug, phone, category, state, address
- partner: display_name, referral_code (unique), audience/brand profile, platforms[],
  payout_preference
- admin: team_role enum, provisioned_by

**onboarding_progress** (optional): `user_id · step · completed_at`

Principle: auth data and profile data stay separate.

## 6) Frontend wiring (Sprint 2)

- New `lib/api/client.ts` fetch wrapper (base URL from `NEXT_PUBLIC_API_URL`, sends
  cookies, retries once on 401 via `/auth/refresh`).
- New `lib/api/auth.ts` — all auth calls.
- Rework `authSlice.js`: real `user` + `dashboard`, `setAuth` / `clearAuth`, no
  `dummyUser`.
- Replace `/login/{role}` password forms with the 2-step OTP form (email → code →
  redirect). Replace `/signup` with role-aware OTP onboarding.
- Replace the `localStorage.awaown_auth` guard in `AppFrame.js` / `dashboard/layout.tsx`.
  Preferred: **Next.js middleware** checks the refresh cookie and redirects
  server-side (kills the hydration-race the memory documents). Keep a lightweight
  client check for token-in-memory expiry only.
- "Resend code" UI state + cooldown timer.
- Per-role: on 401 from that dashboard's API, bounce to that role's `/login/{role}`.
- **Heed `AGENTS.md`:** read `node_modules/next/dist/docs/` before writing Next 16
  middleware / route code — the API may differ from training data.

## 7) Security checklist (from day one)

- HTTPS only · Helmet · strict CORS allowlist (staging + prod frontend origins only).
- Rate limiting on every `/auth/*` endpoint (`@nestjs/throttler`), tighter on OTP.
- No password field anywhere in this release.
- OTP + refresh tokens stored hashed.
- Refresh-token rotation + reuse detection.
- Audit logs: register, login attempts, OTP requests, verify failures, role changes,
  token refresh, admin actions.
- Admin: invite-only, stricter throttle, separate secret.
- All input validated server-side (`class-validator` DTOs, `ValidationPipe` whitelist).
- Never trust frontend authorization checks.
- Secrets in `.env` (gitignored), `.env.example` committed.

## 8) Local dev & testing

- Frontend `localhost:3000`, API `localhost:3001`, local Postgres (Docker or native).
- pgAdmin + `prisma studio` for inspection.
- Nodemailer → Mailtrap inbox for OTP emails locally.
- `backend/.env.example` + frontend `.env.local.example` committed.
- Seed script: one admin, and optionally the demo customer/merchant/partner so the
  existing dashboards have data.

## 9) Backend folder structure

```
backend/
  src/
    main.ts
    app.module.ts
    prisma/            prisma.service.ts, schema.prisma, migrations, seed.ts
    config/            env validation
    common/            guards, decorators, filters, interceptors, throttler
    auth/              controller, service, dto, guards, strategies, token.service
    otp/               otp.service (generate/verify/rate-limit)
    users/
    onboarding/
    mail/              mail.service + provider abstraction (nodemailer | resend)
    audit/
```

## 10) API endpoints — first pass

```
POST /api/auth/:role/register          role ∈ customer|merchant|partner
POST /api/auth/:role/verify            { email, code } → tokens
POST /api/auth/:role/login             { email } → 200 (OTP sent)
POST /api/auth/:role/login/verify      { email, code } → tokens
POST /api/auth/resend-otp              { email, purpose }
POST /api/auth/refresh                 (refresh cookie) → new access token
POST /api/auth/logout                  revoke current session
GET  /api/auth/me                      current user + profile + dashboard
POST /api/admin/auth/login             invite-only, OTP
POST /api/onboarding/complete          role-specific profile fields
GET  /api/users/profile
```

---

## 11) Sprint plan

**Sprint 1 — auth foundation** ✅ complete
- [x] NestJS skeleton in `backend/`, Prisma + Postgres wired, `.env.example`
- [x] First migration: users, otp_codes, sessions, audit_logs, *_profiles
- [x] OTP service: generate, hash, expire, attempt-limit, rate-limit
- [x] Mail abstraction: Nodemailer(Mailtrap) + Resend, `EMAIL_PROVIDER` switch, OTP template
- [x] `register` + `verify` (all 3 self-serve roles)
- [x] `login` + `login/verify`
- [x] Token service: access JWT + rotating refresh, dashboard-scoped, reuse detection
- [x] Per-dashboard `DashboardGuard` factory (`CustomerGuard`/`MerchantGuard`/… ) — built,
      mounted from Sprint 2 when role-specific routes land
- [x] `resend-otp`, `refresh`, `logout`, `me`
- [x] `@nestjs/throttler` global + tight per-route on `/auth/*`, audit logging
- [x] `onboarding/complete` + profile creation per role (auto store-slug / referral-code)
- [x] Admin OTP login (invite/seed only, no register route)
- [x] Seed script (`npm run seed` → provisions `ADMIN_SEED_EMAIL`)

**Sprint 2 — frontend wiring**
- [ ] `lib/api/client.ts` + `lib/api/auth.ts`
- [ ] Rework `authSlice`, drop `dummyUser` from auth
- [ ] OTP onboarding flow UI (replace `/signup`)
- [ ] OTP login UI per role (replace password forms)
- [ ] Resend-code UI + cooldown
- [ ] Replace `localStorage` auth guard with Next middleware
- [ ] Per-role 401 → correct `/login/{role}`

**Sprint 3 — deploy & harden**
- [ ] VPS: Postgres install, DB + least-priv users, SSH-tunnel pgAdmin
- [ ] Deploy API (PM2/systemd) + Nginx + Let's Encrypt
- [ ] Frontend staging env → staging API
- [ ] Prod security pass (Helmet, CORS, throttle tuning, secret rotation)
- [ ] `pg_dump` backup cron off-box
- [ ] End-to-end OTP + email + token test from staging
- [ ] Log/error-handling review

---

## 12) "Make the dummy real" backlog — condensed index

Full detail (4 rounds of PM feedback, per-feature "client now / backend needs") is in
the Claude memory file. These come **after** auth, roughly in this order:

| Area | What the backend must add |
| --- | --- |
| **Unified product catalog** | Customer catalog (`lib/dashboard-data.js` / `shop-data.js`) and merchant catalog (`state.merchant.products`) are **separate, unsynced datasets** — flagged 4× as the #1 architecture gap. One `products` table with real `merchant_id` / `partner_id`, `seller_type`. |
| **Categories** | One `categories` table, admin-editable. Client taxonomy has churned 3× as hand-maintained constants. |
| **Product media** | Object storage (S3/Cloudinary) + signed uploads + CDN URLs + image resize + video transcode. Currently base64 in `localStorage` (`lib/file-utils.js`) — does not scale. |
| **Product types** | simple / variable / group(bundle) / digital. `product_variants` table with structured `{attribute_type, value}` (not one free-text label). Digital = secure gated signed download, not public CDN URL. Required-field set differs by `deliveryType`. |
| **Partner program** | per-product `offerCommission` + `partnerProfitAmount` (flat ₦, min ₦1,000). Only enrolled products appear to partners. Server-enforce the minimum + the partner discount cap (≤ their own profit). |
| **Partner attribution** | **not built at all** — `?ref=` / `?product=` links copy to clipboard but nothing reads them. Need capture (cookie/session) → persist through cart → write `referred_by_partner_id` on the order. Prereq for partner earnings. |
| **Orders** | One `orders` table + `order_status_history`. Customer and merchant currently read two unsynced dummy arrays. Status machine: placed → escrow_held → processing → shipped → delivered → escrow_released. |
| **Escrow** | Holds funds until delivery confirmed. Release event fans out to merchant payout eligibility + partner earnings clearing. Refund request pauses release. |
| **Payments** | Paystack Checkout for buyers; Paystack Transfers for merchant payouts (2.5% fee) + partner withdrawals. Multi-gateway selectable (Paystack/Flutterwave/OPay/Stripe) per admin settings. Nothing real exists yet. |
| **Payouts / withdrawals** | Real bank rails + payout queue/worker + webhook-driven status (`processing → paid / failed`). |
| **KYC** | Most obviously faked piece — `VerificationModal` auto-approves after 2.5s. Need real ID-verification provider (Smile Identity / Youverify) or admin review queue. Two ID images (front+back) + selfie. Gates payout/withdraw. |
| **Confidentiality rule** | Merchants must never see AwaOwn's 20% cut of partner profit; partners must never see the merchant-side fee. Enforce **server-side** (field-level perms / per-role response shapes), not by UI omission. |
| **Merchant/partner storefronts** | Real slugs, `storeBanner/storeLogo/storeBio` + (merchant only) `state/address/phone`. Partner-only customization suite: `storeTheme/storeAccent/storeFont/storeProfileImage` (9 accents, 12 font pairings). |
| **Admin panel** | Almost entirely UI toggles with no effect: Automation Center (no engine), Team RBAC (cosmetic dropdown — needs real route/action perms), Settings toggles (maintenance mode, 2FA — inert), refund approval (doesn't move money), global search (client substring over seed arrays), homepage content editor (not wired to real homepage), audit log (hardcoded actor), email campaigns (no send). |
| **Notifications** | Real-time notifications for all roles: orders, payments, verification, withdrawals, refunds, support. |
| **Undo buffer** | The `useUndoBuffer()` 8s client `setTimeout` pattern (7+ admin actions) → real delayed/cancellable job type. |

</details>
