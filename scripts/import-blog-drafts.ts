import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload, type SanitizedConfig } from "payload";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import type { Post } from "../payload-types";

type Faq = { question: string; answer: string };
type Source = { title: string; url: string; publisher?: string };
type DraftFile = {
  n: number;
  slug: string;
  title: string;
  metaTitle: string;
  excerpt: string;
  category: string;
  alt: string;
  caption: string;
  faqs: Faq[];
  sources: Source[];
  markdown: string;
};

type PlanItem = {
  n: number;
  slug: string;
  title?: string;
  image?: string;
  images?: string[];
  scenes?: string[];
  category: string;
};

type LexicalContent = Post["content"];
type LexicalNode = LexicalContent["root"]["children"][number];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile() {
  const text = readFileSync(path.join(root, ".env"), "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index);
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function wordCount(markdown: string) {
  return markdown.split(/\s+/).filter(Boolean).length;
}

function imageKeys(item: PlanItem) {
  if (item.images && item.images.length >= 3) return item.images.slice(0, 3);
  if (item.image) return [item.image];
  return [];
}

function uploadNode(mediaId: number): LexicalNode {
  return {
    type: "upload",
    version: 3,
    format: "",
    id: randomBytes(12).toString("hex"),
    fields: {},
    relationTo: "media",
    value: mediaId,
  };
}

function countUploads(content: LexicalContent | null | undefined) {
  return (content?.root?.children ?? []).filter(
    (node) => node.type === "upload",
  ).length;
}

function insertInlineUploads(content: LexicalContent, mediaIds: number[]) {
  const children = content.root.children;
  const headingIndexes: number[] = [];
  children.forEach((node, index) => {
    if (node.type === "heading" && node.tag === "h2")
      headingIndexes.push(index);
  });
  const slots = [1, 3]
    .map((position) => headingIndexes[position])
    .filter((index): index is number => index !== undefined);
  const placements = mediaIds.map((id, index) => ({
    id,
    after: slots[index] ?? Math.max(0, children.length - 1),
  }));
  placements
    .sort((left, right) => right.after - left.after)
    .forEach((placement) => {
      children.splice(placement.after + 1, 0, uploadNode(placement.id));
    });
  return content;
}

function altFromScene(scene: string | undefined, title: string) {
  const picture = scene?.trim() || "A photograph from the studio library.";
  const subject = title.trim().replace(/\.$/, "");
  return `${picture} It accompanies an article about ${subject}.`;
}

const categoryDescriptions: Record<string, string> = {
  Websites:
    "Notes on homepages, landing pages, and the structure of a company site.",
  "Product Design":
    "Interface decisions for founders shaping an early product.",
  Brand: "Identity, voice, and the small system a team will actually use.",
  Engineering:
    "How Hanabi builds public sites: speed, ownership, and maintainable code.",
  "Design systems":
    "Tokens, components, and the few decisions that keep a product coherent.",
  Automation:
    "Practical automation, bots, and AI features with a human still in the loop.",
  Ecommerce:
    "Shops, product pages, checkout, and migrations for brands that are not marketplaces.",
  "Studio Practice":
    "How to hire, brief, and work with a design and development studio.",
};

async function main() {
  loadEnvFile();
  if (!process.env.PAYLOAD_SECRET) {
    process.env.PAYLOAD_SECRET = "local-draft-import-secret";
  }
  const importedConfig = (await import("../payload.config")).default as
    | SanitizedConfig
    | Promise<SanitizedConfig>;
  const config = await importedConfig;

  const firstPlan = JSON.parse(
    readFileSync(path.join(root, "content/blog-plan.json"), "utf8"),
  ) as PlanItem[];
  const inboundPlan = JSON.parse(
    readFileSync(path.join(root, "content/blog-plan-500.json"), "utf8"),
  ) as PlanItem[];
  const plan = [...firstPlan, ...inboundPlan];
  const planBySlug = new Map(plan.map((item) => [item.slug, item]));
  const scenes = JSON.parse(
    readFileSync(path.join(root, "content/image-scenes.json"), "utf8"),
  ) as Record<string, string>;
  const stockKeys = Object.keys(scenes);

  function companionKeys(hero: string) {
    const index = Math.max(0, stockKeys.indexOf(hero));
    const first = stockKeys[(index + 11) % stockKeys.length] ?? stockKeys[0];
    let second = stockKeys[(index + 23) % stockKeys.length] ?? stockKeys[1];
    if (!first || !second || second === first || second === hero) {
      second = stockKeys[(index + 5) % stockKeys.length] ?? first;
    }
    return [first, second].filter((key): key is string => Boolean(key));
  }

  const payload = await getPayload({ config });
  const editorConfig = await editorConfigFactory.default({
    config: payload.config,
  });

  const authorLookup = await payload.find({
    collection: "authors",
    where: { slug: { equals: "hanabi" } },
    limit: 1,
    overrideAccess: true,
  });
  const author =
    authorLookup.docs[0] ??
    (await payload.create({
      collection: "authors",
      overrideAccess: true,
      data: {
        name: "Hanabi",
        slug: "hanabi",
        role: "Product design and web development studio",
        bio: "Hanabi is a product design and web development studio. The studio writes about clear websites, brand systems, and product interfaces for founders.",
        website: "https://tryhanabi.com",
        linkedIn: "https://www.linkedin.com/company/hanabilabs",
      },
    }));

  const categoryIds = new Map<string, number>();
  for (const [name, description] of Object.entries(categoryDescriptions)) {
    const existing = await payload.find({
      collection: "categories",
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    });
    const doc =
      existing.docs[0] ??
      (await payload.create({
        collection: "categories",
        overrideAccess: true,
        data: {
          name,
          description,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      }));
    categoryIds.set(name, doc.id);
  }

  const draftsDir = path.join(root, "content/blog-drafts");
  let created = 0;
  let skipped = 0;
  let illustrated = 0;
  const problems: string[] = [];

  async function createMedia(key: string, alt: string, caption: string) {
    return payload.create({
      collection: "media",
      overrideAccess: true,
      data: {
        alt: alt.trim(),
        caption: caption.trim() || "Photograph via Unsplash.",
      },
      filePath: path.join(root, "content/stock", `${key}.jpg`),
    });
  }

  async function illustrateExisting(
    post: {
      id: number;
      title?: string | null;
      content?: LexicalContent | null;
    },
    planItem: PlanItem,
  ) {
    const content = post.content;
    if (!content?.root?.children || countUploads(content) >= 2) return false;
    const keys = imageKeys(planItem);
    const extras =
      keys.length >= 3
        ? keys.slice(1, 3)
        : companionKeys(keys[0] ?? "calm-desk");
    const title = post.title?.trim() || planItem.title || planItem.slug;
    const mediaIds: number[] = [];
    for (const [index, key] of extras.entries()) {
      const scene =
        keys.length >= 3 ? planItem.scenes?.[index + 1] : scenes[key];
      const media = await createMedia(
        key,
        altFromScene(scene, title),
        "Photograph via Unsplash.",
      );
      mediaIds.push(media.id);
    }
    await payload.update({
      collection: "posts",
      id: post.id,
      draft: true,
      overrideAccess: true,
      data: { content: insertInlineUploads(content, mediaIds) },
    });
    return true;
  }

  for (const item of plan) {
    const filePath = path.join(
      draftsDir,
      `${String(item.n).padStart(3, "0")}.json`,
    );
    let draft: DraftFile;
    try {
      draft = JSON.parse(readFileSync(filePath, "utf8")) as DraftFile;
    } catch (error) {
      problems.push(`${item.n}: missing or invalid json (${String(error)})`);
      continue;
    }

    const words = wordCount(draft.markdown);
    const excerptLength = draft.excerpt.trim().length;
    if (draft.slug !== item.slug) problems.push(`${item.n}: slug mismatch`);
    if (draft.title.length > 90) problems.push(`${item.n}: title too long`);
    if (draft.metaTitle.length > 60)
      problems.push(`${item.n}: meta title too long`);
    if (excerptLength < 80 || excerptLength > 220)
      problems.push(`${item.n}: excerpt length ${excerptLength}`);
    const wordFloor = item.n >= 101 ? 1400 : 900;
    if (words < wordFloor) problems.push(`${item.n}: only ${words} words`);
    if (!draft.faqs || draft.faqs.length < 3)
      problems.push(`${item.n}: needs 3 faqs`);
    if (!draft.alt.trim()) problems.push(`${item.n}: missing alt`);

    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: draft.slug } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
    });
    if (existing.docs[0]) {
      const added = await illustrateExisting(
        existing.docs[0] as {
          id: number;
          title?: string | null;
          content?: LexicalContent | null;
        },
        planBySlug.get(draft.slug) ?? item,
      );
      if (added) {
        illustrated += 1;
        console.log(`illustrated ${item.n} ${draft.slug}`);
      } else {
        skipped += 1;
      }
      continue;
    }

    const planItem = planBySlug.get(draft.slug);
    if (!planItem) {
      problems.push(`${item.n}: not in plan`);
      continue;
    }
    const categoryId = categoryIds.get(draft.category);
    if (!categoryId) {
      problems.push(`${item.n}: unknown category ${draft.category}`);
      continue;
    }

    const keys = imageKeys(planItem);
    if (!keys[0]) {
      problems.push(`${item.n}: no image`);
      continue;
    }
    const media = await createMedia(
      keys[0],
      draft.alt.trim(),
      draft.caption?.trim() || "Photograph via Unsplash.",
    );
    const inlineIds: number[] = [];
    for (const [index, key] of keys.slice(1).entries()) {
      const inline = await createMedia(
        key,
        altFromScene(planItem.scenes?.[index + 1], draft.title),
        "Photograph via Unsplash.",
      );
      inlineIds.push(inline.id);
    }

    const content = insertInlineUploads(
      convertMarkdownToLexical({
        editorConfig,
        markdown: draft.markdown,
      }) as LexicalContent,
      inlineIds,
    );

    await payload.create({
      collection: "posts",
      draft: true,
      overrideAccess: true,
      data: {
        title: draft.title.trim(),
        slug: draft.slug,
        excerpt: draft.excerpt.trim(),
        heroImage: media.id,
        content,
        authors: [author.id],
        categories: [categoryId],
        faqs: draft.faqs.slice(0, 6).map((faq) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        })),
        sources: (draft.sources ?? [])
          .filter((source) => source.url && source.title)
          .map((source) => ({
            title: source.title.trim(),
            url: source.url.trim(),
            publisher: source.publisher?.trim(),
          })),
        publishedAt: new Date().toISOString(),
        featured: false,
        noIndex: false,
        meta: {
          title: draft.metaTitle.trim(),
          description: draft.excerpt.trim(),
          image: media.id,
        },
        _status: "draft",
      },
    });
    created += 1;
    console.log(`draft ${item.n} ${draft.slug} (${words} words)`);
  }

  console.log(
    JSON.stringify(
      { created, illustrated, skipped, problems: problems.length },
      null,
      2,
    ),
  );
  if (problems.length) {
    console.log(problems.join("\n"));
  }
  const blocking = problems.filter((line) => {
    if (line.includes("missing or invalid json")) return false;
    const short = line.match(/only (\d+) words/);
    if (short && Number(short[1]) >= 1200) return false;
    return true;
  });
  process.exit(blocking.length ? 1 : 0);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
