import type { MetadataRoute } from "next";
import { getSitemapContent } from "@/lib/blog/data";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 900;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, categories, authors } = await getSitemapContent();
  const indexablePosts = posts.filter(
    (post) => !post.noIndex && !post.canonicalURL,
  );
  const latestForCategory = new Map<number, string>();
  const latestForAuthor = new Map<number, string>();
  let latestPostUpdate: string | undefined;

  for (const post of indexablePosts) {
    if (!latestPostUpdate || post.updatedAt > latestPostUpdate) {
      latestPostUpdate = post.updatedAt;
    }
    for (const category of post.categories) {
      const id = typeof category === "number" ? category : category.id;
      const previous = latestForCategory.get(id);
      if (!previous || post.updatedAt > previous) {
        latestForCategory.set(id, post.updatedAt);
      }
    }
    for (const author of post.authors) {
      const id = typeof author === "number" ? author : author.id;
      const previous = latestForAuthor.get(id);
      if (!previous || post.updatedAt > previous) {
        latestForAuthor.set(id, post.updatedAt);
      }
    }
  }

  return [
    {
      url: absoluteUrl("/"),
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latestPostUpdate,
    },
    ...indexablePosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
    })),
    ...categories
      .filter((category) => latestForCategory.has(category.id))
      .map((category) => ({
        url: absoluteUrl(`/blog/category/${category.slug}`),
        lastModified: latestForCategory.get(category.id),
      })),
    ...authors
      .filter((author) => latestForAuthor.has(author.id))
      .map((author) => ({
        url: absoluteUrl(`/blog/author/${author.slug}`),
        lastModified: latestForAuthor.get(author.id),
      })),
  ];
}
