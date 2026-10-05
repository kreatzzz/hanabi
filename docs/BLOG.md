# Hanabi blog and Payload CMS

Payload manages the public blog at `/cms`. It is separate from Hanabi's existing `/admin` client-management area.

## First-time setup

1. Set `NEXT_PUBLIC_SITE_URL=https://www.tryhanabi.com`, `PAYLOAD_SECRET`, `PAYLOAD_PREVIEW_SECRET`, and `PAYLOAD_CRON_SECRET` in production. See `.env.example`. The apex redirects to `www`, so canonical URLs must use `www`.
2. Point `PAYLOAD_DATABASE_URL` at the CMS database, or leave it empty to use `DATABASE_URL`. Payload owns only the `payload` Postgres schema; Prisma continues to own the existing `public` schema.
3. Apply the checked-in Payload migrations before building or starting the application:

   ```bash
   bun run payload:migrate
   ```

4. Sign in to the existing Hanabi admin at `/admin`, then open `/admin/cms-setup`. Enter a new CMS password there to create the first Payload account for `deydevelops@gmail.com`. The public Payload first-user page and registration endpoint are blocked, so a stranger cannot claim the account before you do.

Payload email delivery is not configured yet. Until an email adapter is added, password-reset messages are logged by the server instead of reaching the user. Keep the first user's credentials in a secure password manager and plan email delivery before routine editorial use.

Do not set `PAYLOAD_DB_PUSH=true` against a shared or production database. That switch is only for rapid work against a disposable local database.

## Publishing an article

Create content in this order:

1. Upload media with useful alt text. The hero image should work at 16:9 and at 1200×630 for social sharing.
2. Create an author profile with a public bio.
3. Create one or more categories with clear descriptions.
4. Create the post, write its direct summary in `excerpt`, and fill the SEO fields.
5. Add sources for factual claims and FAQs only when they are genuinely answered by the article.
6. Use Preview to inspect the draft, check that all internal article links point to published posts, set `publishedAt` to the actual release time, then publish or schedule it.

Only records with `_status=published` and a `publishedAt` time in the past are exposed publicly. Published article and listing data is cached for up to five minutes to keep article responses fast. Draft previews bypass that cache. Saving or deleting a post invalidates the public data cache and revalidates blog, feed, and sitemap paths.

For the initial release, `bun run payload:publish-initial` checks the first 100 mutually linked drafts, their metadata, media, and source URLs. It is a dry run by default. Run it only after the deployed blog and R2 images work, using `NEXT_PUBLIC_SITE_URL=https://www.tryhanabi.com`, `PAYLOAD_MEDIA_BASE_URL`, `PAYLOAD_SECRET`, and the production `DATABASE_URL`. To publish after inspecting its output, add `--apply --confirm-site=www.tryhanabi.com`. The script sets each publication date at release time, reconciles older imported excerpts and SEO titles against the reviewed draft files, and skips posts already published. The other 400 drafts remain unpublished for later editorial review. This command uses Node for the Payload/Lexical runtime because Bun currently hits a Lexical module initialization error; Bun remains the script runner.

Scheduled publishing also needs a job runner. On a long-running host, run:

```bash
bun run payload:jobs
```

On a serverless host, call `/cms-api/payload-jobs/run?queue=default` at least once per minute with `Authorization: Bearer $PAYLOAD_CRON_SECRET`. The endpoint is denied when the secret is absent or invalid.

## Public routes

- `/blog`: archive and featured article
- `/blog/[slug]`: article page
- `/blog/category/[slug]`: topic archive
- `/blog/author/[slug]`: author archive
- `/blog/feed.xml`: RSS feed
- `/sitemap.xml`: public URLs from Payload
- `/robots.txt`: crawler rules, with portal and CMS paths blocked

Article pages emit `BlogPosting` and `BreadcrumbList` JSON-LD. FAQs remain visible content, but [Google retired FAQ rich results in 2026](https://developers.google.com/search/updates). Articles also expose canonical, Open Graph, Twitter, author, publication, and modification metadata.

## Media storage

Local development falls back to the ignored `media/` directory. Production should set all five variables below to enable the Cloudflare R2 adapter:

- `PAYLOAD_R2_BUCKET`
- `PAYLOAD_R2_ACCESS_KEY_ID`
- `PAYLOAD_R2_SECRET_ACCESS_KEY`
- `PAYLOAD_R2_ENDPOINT`
- `PAYLOAD_MEDIA_BASE_URL`

These credentials are deliberately distinct from the client portal's `R2_*` variables. Blog objects use the `blog/` prefix.

The 500 imported drafts originally created media in the ignored local `media/` directory. To reconcile those existing production records, run `scripts/sync-blog-media-to-r2.ts` with `DIRECT_URL` and the five `PAYLOAD_R2_*`/`PAYLOAD_MEDIA_BASE_URL` variables above. The script is a dry run by default; it verifies filenames and byte counts before any write. After checking the exact bucket and public URL in its output, run it with `--apply --confirm-bucket=<bucket>`. It uploads only referenced files, verifies R2 object byte counts and hashes, then updates the media URLs in one database transaction. Never remove local source files until the public image URLs have been tested.

New CMS uploads use the same `blog/` prefix and receive unique per-upload object keys. Do not repurpose the portal bucket or overwrite existing blog objects.

Payload uploads directly from the browser when R2 is enabled. The bucket CORS policy must allow `PUT` requests from the canonical `www` origin and allow the `Content-Type` and `If-None-Match` request headers.

Use this policy as the starting point, replacing the example origin with the exact production origin:

```json
[
  {
    "AllowedOrigins": ["https://example.com"],
    "AllowedMethods": ["GET", "HEAD", "PUT"],
    "AllowedHeaders": ["Content-Type", "If-None-Match"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Schema changes

After changing a Payload collection or field:

```bash
bun run payload:generate-types
bun run payload:generate-importmap
bun run payload:migrate:create descriptive_name
bunx tsc --noEmit
bun run build
```

Generate migrations against a development database and review the SQL before applying them elsewhere. Commit the generated migration, `payload-types.ts`, and admin import map together with the config change.
