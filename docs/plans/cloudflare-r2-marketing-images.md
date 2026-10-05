# Cloudflare R2 marketing image migration

## Status

Complete on 2026-08-25.

## Goal

Move public-site content imagery from the application bundle into a dedicated Cloudflare R2 bucket without changing the rendered design or the separate portal upload system.

## Context and constraints

- The homepage currently serves project, service, team, gradient, and footer imagery from `public/`.
- Client portal uploads already use a different R2 bucket through `lib/r2.ts`.
- Hanabi logos, client logos, favicons, app icons, social icons, kites, the web manifest, and Open Graph artwork remain local.
- Production builds must continue to work without mandatory environment variables.

## Chosen architecture

- Store marketing images in the dedicated `hanabi-marketing-assets` bucket.
- Use immutable `v1/` object keys that preserve the existing content folders.
- Centralize public URL construction in `lib/marketing-assets.ts`.
- Allow a future custom delivery domain through `NEXT_PUBLIC_MARKETING_ASSET_BASE_URL`, with the current managed R2 domain as the fallback.
- Replace build-time filesystem discovery for hero projects with an explicit manifest.
- Generate reveal placeholders by fetching the canonical R2 URLs.

## Non-goals

- Moving brand shell or client-logo files.
- Changing portal upload behavior or portal R2 credentials.
- Deploying the application or editing hosted environment variables.
- Redesigning components or changing motion.

## Implementation

1. Create the R2 bucket and enable public delivery.
2. Upload selected images under `v1/` with content types and immutable cache headers.
3. Verify every object against its local byte count.
4. Route marketing image references through the URL helper and configure Next.js remote images.
5. Update the blur generator and maintenance documentation.
6. Remove migrated images from `public/` only after remote verification.

## Validation

- Uploaded 72 objects totaling 108,223,736 bytes.
- Matched every R2 object to its source byte count and SHA-256 metadata.
- Confirmed representative PNG and WebP files return HTTP 200 with the expected content type and byte count.
- Regenerated all 22 remote blur placeholders.
- Passed Prettier, `bunx tsc --noEmit`, and `bun run build`.
- Confirmed brand shell files remain local and no credential appears in the repository diff.

## Risks

- The managed `r2.dev` domain is suitable as an immediate endpoint but Cloudflare recommends a custom domain for production traffic.
- Immutable keys require a new version or filename when image bytes change.
- Removing local images makes R2 availability part of homepage rendering.
