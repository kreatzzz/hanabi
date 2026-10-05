import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/payload-types";
import {
  formatPostDate,
  imageSource,
  postAuthors,
  postCategories,
} from "@/lib/blog/presenters";

export function BlogCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  const image = imageSource(post.heroImage, featured ? "wide" : "card");
  const authors = postAuthors(post);
  const categories = postCategories(post);

  return (
    <article
      className={
        featured
          ? "group grid overflow-hidden rounded-[2rem] border border-black/8 bg-[#f4f2ed] lg:grid-cols-[1.2fr_1fr]"
          : "group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-black/8 bg-white"
      }
    >
      <Link
        href={`/blog/${post.slug}`}
        className={
          featured
            ? "relative min-h-72 overflow-hidden bg-neutral-200 lg:min-h-[30rem]"
            : "relative aspect-[3/2] overflow-hidden bg-neutral-200"
        }
        aria-label={`Read ${post.title}`}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority={featured}
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 56vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
          />
        ) : null}
      </Link>

      <div
        className={
          featured
            ? "flex flex-col justify-center p-7 sm:p-10 lg:p-14"
            : "flex flex-1 flex-col p-6"
        }
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium tracking-normal text-neutral-500">
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
          {categories.slice(0, 2).map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="rounded-full bg-black/5 px-2.5 py-1 hover:bg-black/10"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <h2
          className={
            featured
              ? "mt-5 text-3xl leading-tight font-medium sm:text-4xl"
              : "mt-4 text-2xl leading-tight font-medium"
          }
        >
          <Link
            href={`/blog/${post.slug}`}
            className="decoration-1 underline-offset-4 hover:underline"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 leading-relaxed tracking-[-0.02em] text-neutral-600">
          {post.excerpt}
        </p>

        {authors.length ? (
          <p className="mt-auto pt-7 text-sm tracking-normal text-neutral-500">
            By {authors.map((author) => author.name).join(" and ")}
          </p>
        ) : null}
      </div>
    </article>
  );
}
