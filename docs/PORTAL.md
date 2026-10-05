# Client & Admin Portal

A password-protected portal for Hanabi's clients — brand system, downloadable
assets, handoff docs, and a running progress log — plus an internal admin console
to manage it all.

Inspired by studio "living brand guideline" portals: each client logs in with a
project handle + password and gets a polished, self-serve workspace.

## Surfaces

| Route                 | Access         | What it is                                                |
| --------------------- | -------------- | --------------------------------------------------------- |
| `/portal/login`       | Public         | Project + password gate (mirrors the reference video)     |
| `/portal`             | Client session | Overview — status, quick links, latest updates            |
| `/portal/brand`       | Client session | Colors (click-to-copy), typography, logo downloads        |
| `/portal/assets`      | Client session | Downloadable banners, icons, files                        |
| `/portal/docs`        | Client session | Handoff docs (markdown), listed + individually rendered   |
| `/portal/updates`     | Client session | Changelog-style progress timeline                         |
| `/admin/login`        | Public         | Admin password gate                                       |
| `/admin`              | Admin session  | Client list                                               |
| `/admin/clients/[id]` | Admin session  | Per-client editor: settings, brand, assets, docs, updates |

The marketing site (`/`) is untouched. Smooth-scroll (Lenis) is automatically
disabled on `/portal` and `/admin` so the app surfaces scroll natively.

## Architecture

- **Next.js 16 App Router**, Tailwind v4, shadcn (`base-nova`).
- **Postgres (Neon) + Prisma 7** via the Neon driver adapter (`lib/db.ts`).
  Connection URLs live in `prisma.config.ts`; models in `prisma/schema.prisma`.
- **Auth** — signed httpOnly JWT session cookies (`jose`), one per surface
  (`hanabi_portal`, `hanabi_admin`). Route protection is enforced in `proxy.ts`
  (Next 16's proxy/middleware). Passwords hashed with `bcryptjs`.
- **File storage** — Cloudflare R2 (S3-compatible) via `lib/r2.ts`. Uploads go
  through the admin-guarded `POST /api/admin/upload` route. This portal bucket
  is separate from the public marketing-image bucket described in the root
  README.
- **Markdown** — `react-markdown` + `remark-gfm`, styled in
  `components/portal/markdown.tsx` (trusted, admin-authored; raw HTML disabled).

Key files:

```
prisma/schema.prisma          data model
prisma.config.ts              Prisma 7 datasource + seed config
lib/db.ts                     Prisma client (Neon adapter)
lib/session.ts                edge-safe JWT sign/verify (used by proxy.ts)
lib/auth.ts                   server-side session + password helpers
lib/r2.ts                     Cloudflare R2 upload/delete
proxy.ts                      route protection for /portal and /admin
app/portal/**                 client portal
app/admin/**                  admin console
app/api/admin/upload          R2 upload endpoint (admin only)
app/api/clients/[slug]/updates  GitHub-monitor ingest endpoint
```

## Setup

1. **Environment** — copy `.env.example` to `.env` and fill in:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — Neon **pooled** connection (runtime).
   - `DIRECT_URL` — Neon **direct** connection (migrations).
   - `SESSION_SECRET` — `openssl rand -base64 32`
   - `ADMIN_PASSWORD_HASH` — `bun run hash "your-admin-password"`
   - `UPDATES_API_TOKEN` — `openssl rand -hex 24`
   - `R2_*` — Cloudflare R2 credentials + public bucket URL.

2. **Migrate** the schema to Neon:

   ```bash
   bun run db:migrate      # dev: creates + applies a migration
   # or, against an existing prod db:
   bun run db:deploy
   ```

3. **Seed** sample clients (optional, prints each portal password):

   ```bash
   bun run db:seed
   ```

4. **Run**:

   ```bash
   bun run dev
   ```

Helper scripts: `db:generate`, `db:migrate`, `db:deploy`, `db:push`, `db:seed`,
`db:studio`, `hash`.

## Admin workflow

1. Sign in at `/admin/login` with the admin password.
2. **New client** → set name, handle, password, accent.
3. In the client editor tabs:
   - **Settings** — rename, change handle, reset password, accent, archive/delete.
   - **Brand** — add colors and typefaces.
   - **Assets** — upload logos/banners/icons/files to R2 (logos surface under
     the client's Brand page; the rest under Assets).
   - **Docs** — author handoff docs in markdown (write/preview).
   - **Updates** — post progress entries.

## Updates ingest API (for the AI GitHub monitor)

Append a progress entry to a client's changelog. Idempotent by `commitSha`.

```
POST /api/clients/:slug/updates
Authorization: Bearer $UPDATES_API_TOKEN
Content-Type: application/json

{
  "title": "Homepage hero shipped",
  "bodyMd": "Implemented the hero marquee and projects grid.",
  "tag": "Build",
  "date": "2026-07-14",         // optional, defaults to now
  "commitSha": "9a9972d...",     // optional; dedupes repeat calls
  "commitUrl": "https://github.com/org/repo/commit/9a9972d"
}
```

Example:

```bash
curl -X POST https://your-site/api/clients/gotnext/updates \
  -H "Authorization: Bearer $UPDATES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy pipeline live","bodyMd":"CI now ships to Vercel on push.","tag":"Build"}'
```

Responses: `201` created · `200` deduped (commit already recorded) ·
`401` bad token · `404` unknown client.

Entries created this way are tagged `source: GITHUB` and show a commit link in
the portal.

## Manual QA checklist

After wiring env + migrating, verify:

- **/portal/login** — project dropdown lists active clients; wrong password
  rejected; correct login lands on `/portal`.
- **/portal** — stat cards and latest updates render; links navigate.
- **/portal/brand** — colors copy on click; type specimens render; logos download.
- **/portal/assets** — image assets preview; downloads work.
- **/portal/docs** + a doc — sidebar sub-links work; markdown renders (headings,
  lists, code, tables); "All docs" back link works.
- **/portal/updates** — grouped by month; commit links (if any) open GitHub.
- **Sign out** (portal sidebar footer) — returns to login; `/portal` now redirects.
- **/admin/login** — wrong password rejected; correct lands on `/admin`.
- **/admin** — client cards show counts; **New client** creates + redirects.
- **Client editor** — Settings save (toast); Brand add/delete color+font; Assets
  upload to R2 + delete; Docs create/edit/delete with live preview; Updates
  create/edit/delete. Confirm changes appear in that client's portal.
- **Archive** a client → it drops from the login dropdown.
- **Updates API** — `curl` the endpoint; entry appears under the client's Updates.

```

```
