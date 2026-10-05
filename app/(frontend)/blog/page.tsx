import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";
import { JsonLd } from "@/components/blog/json-ld";
import { getPosts } from "@/lib/blog/data";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ideas on design, development, and digital products",
  description:
    "Practical notes from Hanabi on product design, web development, brand systems, and building clearer digital experiences.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Hanabi Blog",
    description:
      "Practical notes on product design, web development, brand systems, and digital experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hanabi Blog",
    description:
      "Practical notes on product design, web development, brand systems, and digital experiences.",
  },
};

export default async function BlogPage() {
  const result = await getPosts({ page: 1, limit: 10 });

  return (
    <main className="px-5 pt-36 pb-28 sm:px-8 lg:pt-44">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Hanabi Blog",
          description: metadata.description,
          url: absoluteUrl("/blog"),
          publisher: {
            "@type": "Organization",
            "@id": absoluteUrl("/#organization"),
            name: "Hanabi",
            url: absoluteUrl("/"),
          },
          blogPost: result.docs.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.publishedAt,
            url: absoluteUrl(`/blog/${post.slug}`),
          })),
        }}
      />

      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl sm:mb-16">
          <p className="font-mono text-sm font-medium tracking-[0.08em] text-[#e84519] uppercase">
            Hanabi journal
          </p>
          <h1 className="mt-4 text-5xl leading-[0.98] font-medium tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
            Clear thinking for better digital products.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed tracking-[-0.02em] text-neutral-600 sm:text-xl">
            Practical notes on design, engineering, brand systems, and the
            choices that make digital work feel simple.
          </p>
        </header>

        <BlogIndex result={result} page={1} showFeatured />
      </div>
    </main>
  );
}
