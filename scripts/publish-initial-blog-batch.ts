import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import type { Media, Post } from "../payload-types";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const initialDraftNumbers = Array.from(
  { length: 100 },
  (_, index) => index + 1,
);
const apply = process.argv.includes("--apply");
const confirmedSite = process.argv
  .find((arg) => arg.startsWith("--confirm-site="))
  ?.split("=")[1];

type Draft = {
  n: number;
  slug: string;
  title: string;
  metaTitle: string;
  excerpt: string;
  primaryKeyword: string;
  markdown: string;
  faqs: { question: string; answer: string }[];
  sources: { title: string; url: string }[];
};

const editorialRevisions: Record<
  number,
  readonly (readonly [string, string])[]
> = {
  2: [
    [
      "Add links to the current site, the analytics login if you have one, and the name of the person who can approve.",
      "Add links to the current site, read-only analytics access if available, and the name of the person who can approve.",
    ],
  ],
  10: [
    [
      "Share the login for the inbox or the calendar with that person before you publish. A password in someone's head is not a handoff.",
      "Grant that person access to the inbox or calendar through their own account before you publish. A password in someone's head is not a handoff.",
    ],
    ["https://tryhanabi.com/#services", "https://www.tryhanabi.com/#services"],
  ],
  49: [
    ["https://tryhanabi.com/#services", "https://www.tryhanabi.com/#services"],
  ],
  91: [
    [
      "Hanabi's article pages can include FAQ schema when a post has FAQs, next to the article data.",
      "Hanabi's article pages show FAQs but emit article and breadcrumb schema, not FAQ schema. Google retired FAQ rich results, so the visible answers matter more than adding that markup.",
    ],
  ],
  95: [
    [
      "Hanabi's articles can emit FAQ schema when a post includes FAQs, along with the article data and breadcrumbs.",
      "Hanabi's articles show their FAQs but emit article and breadcrumb schema, not FAQ schema. Google retired FAQ rich results, so the visible answers matter more than adding that markup.",
    ],
  ],
};

function revisedContent(content: Post["content"], draft: Draft) {
  const revised = structuredClone(content);
  const counts = new Map<string, number>();
  const replacements = editorialRevisions[draft.n] ?? [];
  for (const [, replacement] of replacements) {
    if (!draft.markdown.includes(replacement)) {
      throw new Error(`${draft.slug} is missing its reviewed wording`);
    }
  }
  function visit(value: unknown) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    const node = value as Record<string, unknown>;
    for (const [key, child] of Object.entries(node)) {
      if (typeof child === "string") {
        let updated = child;
        for (const [original, replacement] of replacements) {
          if (updated.includes(original)) {
            updated = updated.replace(original, replacement);
            counts.set(original, (counts.get(original) ?? 0) + 1);
          }
        }
        node[key] = updated.replaceAll(
          "https://tryhanabi.com/",
          "https://www.tryhanabi.com/",
        );
      } else {
        visit(child);
      }
    }
  }
  visit(revised);
  for (const [original, replacement] of replacements) {
    if (
      (counts.get(original) ?? 0) !== 1 &&
      !JSON.stringify(content).includes(replacement)
    ) {
      throw new Error(
        `${draft.slug} needs a manual content revision: ${original}`,
      );
    }
  }
  return revised;
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function mediaIds(content: Post["content"]): number[] {
  const ids = new Set<number>();
  function visit(value: unknown) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    const node = value as Record<string, unknown>;
    if (node.type === "upload" && node.relationTo === "media") {
      const media = node.value;
      if (typeof media === "number") ids.add(media);
      if (media && typeof media === "object" && "id" in media) {
        const id = (media as { id: unknown }).id;
        if (typeof id === "number") ids.add(id);
      }
    }
    Object.values(node).forEach(visit);
  }
  visit(content);
  return [...ids];
}

async function verifyMedia(media: Media, publicBase: string) {
  const urls = [
    media.url,
    media.sizes?.thumbnail?.url,
    media.sizes?.card?.url,
    media.sizes?.social?.url,
    media.sizes?.wide?.url,
  ].filter((url): url is string => Boolean(url));
  if (!urls.length || !media.alt?.trim()) {
    throw new Error(`Media ${media.id} lacks a URL or alt text`);
  }
  await Promise.all(
    urls.map(async (url) => {
      if (!url.startsWith(publicBase)) {
        throw new Error(`Media ${media.id} has a non-R2 URL: ${url}`);
      }
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok)
        throw new Error(
          `Media ${media.id} returned ${response.status}: ${url}`,
        );
    }),
  );
}

async function main() {
  requiredEnv("DATABASE_URL");
  requiredEnv("PAYLOAD_SECRET");
  const publicBase = `${requiredEnv("PAYLOAD_MEDIA_BASE_URL").replace(/\/+$/, "")}/blog/`;
  const { SITE_URL } = await import("../lib/site-url");
  if (SITE_URL !== "https://www.tryhanabi.com") {
    throw new Error(`Expected the canonical production site, got ${SITE_URL}`);
  }
  if (apply && confirmedSite !== "www.tryhanabi.com") {
    throw new Error("--apply requires --confirm-site=www.tryhanabi.com");
  }

  const drafts = initialDraftNumbers.map(
    (number) =>
      JSON.parse(
        readFileSync(
          path.join(
            root,
            "content/blog-drafts",
            `${String(number).padStart(3, "0")}.json`,
          ),
          "utf8",
        ),
      ) as Draft,
  );
  const batchSlugs = new Set(drafts.map((draft) => draft.slug));
  const titles = new Set<string>();
  const metaTitles = new Set<string>();
  const keywords = new Set<string>();
  for (const draft of drafts) {
    const words = draft.markdown.trim().split(/\s+/).length;
    if (
      words < 900 ||
      !draft.metaTitle?.trim() ||
      draft.metaTitle.length > 60 ||
      draft.excerpt.length < 80 ||
      draft.excerpt.length > 220 ||
      !draft.primaryKeyword?.trim()
    ) {
      throw new Error(`${draft.slug} needs content or metadata review`);
    }
    for (const [set, value] of [
      [titles, draft.title.toLowerCase()],
      [metaTitles, draft.metaTitle.toLowerCase()],
      [keywords, draft.primaryKeyword.toLowerCase()],
    ] as const) {
      if (set.has(value)) throw new Error(`${draft.slug} duplicates ${value}`);
      set.add(value);
    }
    const linkedSlugs = [
      ...draft.markdown.matchAll(/\]\(\/blog\/([a-z0-9-]+)(?:[?#][^)]*)?\)/g),
    ].map((match) => match[1]);
    for (const slug of linkedSlugs) {
      if (!batchSlugs.has(slug)) {
        throw new Error(
          `${draft.slug} links to an unpublished article: ${slug}`,
        );
      }
    }
    if (draft.faqs.length < 3 || draft.sources.length < 1) {
      throw new Error(`${draft.slug} needs editorial review`);
    }
    for (const source of draft.sources) {
      if (new URL(source.url).protocol !== "https:") {
        throw new Error(`${draft.slug} has a non-HTTPS source`);
      }
    }
  }

  const config = (await import("../payload.config")).default;
  const payload = await getPayload({ config });
  const posts: Post[] = [];
  const revisions = new Map<number, Post["content"]>();
  const checkedMedia = new Set<number>();
  for (const [index, draft] of drafts.entries()) {
    const result = await payload.find({
      collection: "posts",
      where: { slug: { equals: draft.slug } },
      depth: 0,
      limit: 1,
      draft: true,
      overrideAccess: true,
    });
    const post = result.docs[0];
    if (
      !post ||
      post.title !== draft.title ||
      post.noIndex ||
      post.canonicalURL
    ) {
      throw new Error(`${draft.slug} differs from the reviewed draft`);
    }
    if (post._status !== "draft" && post._status !== "published") {
      throw new Error(`${draft.slug} has an unexpected status`);
    }
    const storedLinkedSlugs = [
      ...JSON.stringify(post.content).matchAll(/\/blog\/([a-z0-9-]+)/g),
    ].map((match) => match[1]);
    for (const slug of storedLinkedSlugs) {
      if (!batchSlugs.has(slug)) {
        throw new Error(
          `${draft.slug} stores an unpublished article link: ${slug}`,
        );
      }
    }
    posts.push(post);
    revisions.set(post.id, revisedContent(post.content, draft));

    const hero = post.heroImage;
    const ids = new Set(mediaIds(post.content));
    ids.add(typeof hero === "number" ? hero : hero.id);
    for (const id of ids) {
      if (checkedMedia.has(id)) continue;
      const media = await payload.findByID({
        collection: "media",
        id,
        overrideAccess: true,
      });
      await verifyMedia(media, publicBase);
      checkedMedia.add(id);
    }
    if ((index + 1) % 10 === 0) {
      console.log(`Verified ${index + 1}/${drafts.length} posts`);
    }
  }

  console.log(
    JSON.stringify(
      {
        site: SITE_URL,
        posts: posts.map((post) => ({
          slug: post.slug,
          status: post._status,
        })),
        verifiedMedia: checkedMedia.size,
        mode: apply ? "apply" : "dry-run",
      },
      null,
      2,
    ),
  );
  if (!apply) return;

  for (const [index, post] of posts.entries()) {
    if (post._status === "published") continue;
    const draft = drafts[index];
    const heroImage =
      typeof post.heroImage === "number" ? post.heroImage : post.heroImage.id;
    await payload.update({
      collection: "posts",
      id: post.id,
      draft: false,
      overrideAccess: true,
      data: {
        _status: "published",
        publishedAt: new Date().toISOString(),
        excerpt: draft.excerpt,
        meta: {
          title: draft.metaTitle,
          description: draft.excerpt,
          image: heroImage,
        },
        content: revisions.get(post.id),
      },
    });
    console.log(`Published ${post.slug}`);
  }
}

main().then(
  () => process.exit(0),
  (error: unknown) => {
    console.error(error);
    process.exit(1);
  },
);
