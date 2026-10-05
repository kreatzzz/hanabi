# Blog launch readiness

## Goal

Make the Payload blog buildable, keep its media durable in Cloudflare R2, make public URLs and search metadata consistent, and release the first 100 connected articles without exposing unfinished drafts.

## Scope and decisions

- Keep the existing Payload and Prisma schema split. Do not recreate the 500 imported drafts.
- Use the existing `hanabi-marketing-assets` R2 bucket under the dedicated `blog/` prefix. Reconcile the imported media records only after verifying each referenced object is present with the expected byte count.
- Use `https://www.tryhanabi.com` as the public canonical host because production redirects the apex there.
- Keep unpublished posts out of the sitemap and public archive. Include category and author archives only when they have published posts.
- Publish drafts 1–100 as a connected first batch after validating their titles, descriptions, links, sources, media, and outdated claims. Their article links remain within the batch. The other 400 drafts remain unpublished.
- Search Console submission belongs to the site owner after the live sitemap is verified.

## Validation

1. Typecheck and production build pass on the branch and in the PR deployment.
2. Every production media record resolves to an R2 object with the recorded byte count. Verify representative public image URLs.
3. Verify `/blog`, representative articles, `/robots.txt`, `/sitemap.xml`, and `/blog/feed.xml` on the production host.
4. Check metadata, canonicals, structured data, and broken links on desktop and mobile.
5. Confirm the sitemap lists only canonical, indexable public URLs and returns valid XML.

## Risks and status

- The production database has 500 drafts and 1,500 media records. On September 25, the 6,239 referenced local files were uploaded under R2 `blog/`, verified by byte count and SHA-256, and all 1,500 media URLs were reconciled. The local source directory remains untouched.
- PR #19 passes its Vercel deployment checks. Its preview is protected by Vercel login, so an unauthenticated visual check is still pending.
- The production Payload database has no CMS user. The public first-user page and endpoint are blocked; the owner creates the account through the existing authenticated Hanabi admin. Payload email delivery is not configured, so password reset email is not available yet.
- Many imported excerpts and SEO titles predate the reviewed draft files. The release script reconciles them as it publishes; it does not overwrite published CMS edits.
- Google's guidance favors original, people-first content and warns against scaled pages created mainly to manipulate rankings. Publishing 100 pages does not by itself guarantee traffic or indexing.
- The first-100 dry run verified all 100 draft records and 300 referenced media records against public R2 URLs. The local production build and typecheck pass with the CMS bootstrap route.
- Publishing or merging to production is a separate release decision; do not infer it from a passing local build.
- Search indexing and field Core Web Vitals cannot be verified from code alone. The owner will submit the live sitemap to Search Console.

Status: media repaired, first-100 dry run passing, local production build passing. Updated PR deployment checks, production release, live-route validation, and first publication remain pending. The owner's CMS password must be set through `/admin/cms-setup` after deployment.
