import Link from "next/link";
import { BlogCard } from "./blog-card";
import type { PaginatedDocs } from "payload";
import type { Post } from "@/payload-types";

type BlogIndexProps = {
  result: PaginatedDocs<Post>;
  page: number;
  pathPrefix?: string;
  showFeatured?: boolean;
};

export function BlogIndex({
  result,
  page,
  pathPrefix = "/blog/page",
  showFeatured = false,
}: BlogIndexProps) {
  const featured = showFeatured && page === 1 ? result.docs[0] : undefined;
  const posts = featured ? result.docs.slice(1) : result.docs;

  return (
    <>
      {featured ? (
        <div className="mb-12">
          <BlogCard post={featured} featured />
        </div>
      ) : null}

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-black/15 px-6 py-20 text-center text-neutral-500">
          No published articles yet.
        </div>
      )}

      {result.totalPages > 1 ? (
        <nav
          className="mt-12 flex items-center justify-between border-t border-black/10 pt-6"
          aria-label="Blog pagination"
        >
          {result.hasPrevPage ? (
            <Link
              href={
                page === 2 && pathPrefix === "/blog/page"
                  ? "/blog"
                  : `${pathPrefix}/${page - 1}`
              }
              rel="prev"
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm tracking-normal text-neutral-500">
            Page {page} of {result.totalPages}
          </span>
          {result.hasNextPage ? (
            <Link
              href={`${pathPrefix}/${page + 1}`}
              rel="next"
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  );
}
