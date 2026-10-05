import type { Author, Category, Media, Post } from "@/payload-types";

export function asMedia(value: Media | number | null | undefined) {
  return typeof value === "object" && value ? value : null;
}

export function asAuthor(value: Author | number) {
  return typeof value === "object" ? value : null;
}

export function asCategory(value: Category | number) {
  return typeof value === "object" ? value : null;
}

export function imageSource(
  value: Media | number | null | undefined,
  size: "card" | "social" | "thumbnail" | "wide" = "wide",
) {
  const media = asMedia(value);
  if (!media) return null;

  const resized = media.sizes?.[size];
  const url = resized?.url ?? media.url;
  if (!url) return null;

  return {
    alt: media.alt,
    height: resized?.height ?? media.height ?? 1080,
    url,
    width: resized?.width ?? media.width ?? 1920,
  };
}

export function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function postAuthors(post: Pick<Post, "authors">) {
  return (post.authors ?? [])
    .map(asAuthor)
    .filter((author): author is Author => Boolean(author));
}

export function postCategories(post: Pick<Post, "categories">) {
  return (post.categories ?? [])
    .map(asCategory)
    .filter((category): category is Category => Boolean(category));
}
