import config from "@payload-config";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getPayload, type Where } from "payload";
import type { Author, Category, Post } from "@/payload-types";

const getPayloadClient = cache(() => getPayload({ config }));

function publicPostConditions(): Where[] {
  return [
    {
      _status: {
        equals: "published",
      },
    },
    {
      publishedAt: {
        less_than_equal: new Date().toISOString(),
      },
    },
  ];
}

type PostListOptions = {
  page?: number;
  limit?: number;
  categoryId?: Category["id"];
  authorId?: Author["id"];
  excludeId?: Post["id"];
};

export const getPosts = unstable_cache(
  async ({
    page = 1,
    limit = 12,
    categoryId,
    authorId,
    excludeId,
  }: PostListOptions = {}) => {
    const payload = await getPayloadClient();
    const conditions: Where[] = publicPostConditions();

    if (categoryId) {
      conditions.push({ categories: { contains: categoryId } });
    }
    if (authorId) {
      conditions.push({ authors: { contains: authorId } });
    }
    if (excludeId) {
      conditions.push({ id: { not_equals: excludeId } });
    }

    return payload.find({
      collection: "posts",
      depth: 2,
      draft: false,
      limit,
      overrideAccess: false,
      page,
      sort: "-publishedAt",
      where: { and: conditions },
    });
  },
  ["blog-post-list"],
  { tags: ["blog-public"], revalidate: 300 },
);

async function findPostBySlug(slug: string, includeDraft: boolean) {
  const payload = await getPayloadClient();
  const conditions: Where[] = [{ slug: { equals: slug } }];

  if (!includeDraft) conditions.push(...publicPostConditions());

  const result = await payload.find({
    collection: "posts",
    depth: 2,
    draft: includeDraft,
    limit: 1,
    overrideAccess: includeDraft,
    pagination: false,
    where: { and: conditions },
  });

  return result.docs[0] ?? null;
}

const getCachedPublicPostBySlug = unstable_cache(
  (slug: string) => findPostBySlug(slug, false),
  ["blog-public-post"],
  { tags: ["blog-public"], revalidate: 300 },
);

export const getPostBySlug = cache((slug: string, includeDraft = false) =>
  includeDraft ? findPostBySlug(slug, true) : getCachedPublicPostBySlug(slug),
);

export const getCategoryBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "categories",
        depth: 1,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: { slug: { equals: slug } },
      });
      return result.docs[0] ?? null;
    },
    ["blog-category"],
    { tags: ["blog-public"], revalidate: 300 },
  ),
);

export const getAuthorBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const payload = await getPayloadClient();
      const result = await payload.find({
        collection: "authors",
        depth: 1,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: { slug: { equals: slug } },
      });
      return result.docs[0] ?? null;
    },
    ["blog-author"],
    { tags: ["blog-public"], revalidate: 300 },
  ),
);

export async function getSitemapContent() {
  const payload = await getPayloadClient();
  const [posts, categories, authors] = await Promise.all([
    payload.find({
      collection: "posts",
      depth: 0,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      sort: "-publishedAt",
      where: { and: publicPostConditions() },
    }),
    payload.find({
      collection: "categories",
      depth: 0,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
    }),
    payload.find({
      collection: "authors",
      depth: 0,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
    }),
  ]);

  return {
    posts: posts.docs,
    categories: categories.docs,
    authors: authors.docs,
  };
}
