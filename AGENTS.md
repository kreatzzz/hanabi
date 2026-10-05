# Hanabi — AGENTS.md

Hanabi is a Next.js studio portfolio with a protected client and admin portal plus a Payload-managed public blog. The marketing site is primarily static, while Prisma, Payload, Neon, signed sessions, and Cloudflare R2 support the portal and publishing system.

## Non-Negotiable Core Principles

- Keep the marketing site fast, visually stable, and usable with reduced motion.
- Preserve the separation between public marketing content and authenticated portal data.
- Keep external storage and database concerns behind small, explicit adapters.
- Never commit credentials, generated Prisma clients, build output, or local environment files.

## Note

User instructions take precedence. Keep changes scoped, preserve existing behavior unless the request changes it, and protect unrelated work in a dirty tree. Prefer the smallest model that makes ownership and future edits obvious.

## Project Glossary

- **Marketing assets**: non-brand imagery used by the public homepage, delivered from the dedicated R2 bucket.
- **Brand shell assets**: Hanabi logos, favicons, app icons, the web manifest, social icons, and Open Graph artwork kept in `public/`.
- **Portal assets**: client-uploaded files stored in the separate portal R2 bucket and represented by Prisma `Asset` records.
- **Blog media**: Payload-managed public images stored under the `blog/` prefix with separate `PAYLOAD_R2_*` credentials.
- **Reveal image**: a marketing image rendered with a generated low-quality placeholder and opacity cross-fade.

## Development & Execution Rules

- Use Bun for installs, scripts, and one-off TypeScript execution.
- Run `bun run build` for production verification and `bunx tsc --noEmit` for a focused type check.
- Run `bun run payload:migrate` before production builds when Payload migrations are pending. Payload owns the `payload` Postgres schema; Prisma owns `public`.
- Run Prettier only on files touched by the task.
- Use Tailwind classes and existing shadcn primitives; do not introduce competing UI foundations.
- Build marketing image URLs through `lib/marketing-assets.ts`. Do not scatter bucket domains through components.
- Treat `NEXT_PUBLIC_MARKETING_ASSET_BASE_URL` as the optional delivery-domain override. The checked-in default keeps builds environment-independent.
- Keep R2 object keys versioned. A changed image should use a new asset version or key so immutable caches cannot serve stale bytes.
- Keep portal upload configuration in the existing `R2_*` variables. Marketing storage must not repurpose the portal bucket.
- Keep Payload at `/cms` and its API at `/cms-api`; `/admin` remains the existing client-management interface.
- Update `README.md` when image ownership, asset paths, or maintenance commands change.
- For external writes, resolve the exact provider, account, bucket, and object prefix first. Verify uploaded byte counts before deleting Git-tracked source images.
