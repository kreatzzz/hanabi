# Payload blog infrastructure

## Goal

Add a production-ready Payload CMS publishing system to Hanabi and expose an SEO-focused public blog without changing the existing client or admin portals.

## Scope

- Mount Payload Admin at `/cms` and its REST API at `/cms-api`.
- Store Payload tables in the `payload` Postgres schema so Prisma-owned tables remain isolated.
- Add authenticated users plus posts, authors, categories, and blog media.
- Support drafts, scheduled publication dates, previews, rich text, FAQs, citations, related content, and per-post SEO metadata.
- Add public blog archive and article routes, XML sitemap, robots rules, RSS, canonical metadata, and structured data.
- Support Cloudflare R2 for production blog media through dedicated `PAYLOAD_R2_*` variables, with local uploads for development.
- Document setup, migrations, first-user creation, and publishing workflow.

## Key decisions

- Payload uses `/cms`, not `/admin`, because Hanabi already owns `/admin`.
- Public data reads enforce collection access and additionally filter for published posts whose publication time has passed.
- Payload shares the existing Postgres server but owns a separate schema. `PAYLOAD_DATABASE_URL` may override `DATABASE_URL` if a separate database is preferred.
- Blog pages are server-rendered and revalidated after CMS changes. Rich text is rendered from Lexical JSON on the server.
- Media URLs come from Payload records. The R2 adapter is enabled only when every required blog-media variable is present.

## Validation

- Generate Payload types and import map.
- Run the focused TypeScript check.
- Run the production build.
- Inspect the final diff and confirm unrelated local changes remain untouched.

## Status

Complete. Payload types and the import map were generated, the initial migration was
applied to a fresh Postgres database, TypeScript and the production build passed,
and the built routes passed runtime smoke tests.
