import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/blog-card";
import { JsonLd } from "@/components/blog/json-ld";
import { getPostBySlug, getPosts } from "@/lib/blog/data";
import {
  asMedia,
  formatPostDate,
  imageSource,
  postAuthors,
  postCategories,
} from "@/lib/blog/presenters";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const post = await getPostBySlug(slug, isEnabled);
  if (!post) return {};

  const socialImage = imageSource(post.meta?.image ?? post.heroImage, "social");
  const canonical = post.canonicalURL || `/blog/${post.slug}`;
  const title = post.meta?.title || post.title || "Untitled draft";
  const description =
    post.meta?.description || post.excerpt || "Draft article preview.";

  return {
    title,
    description,
    alternates: { canonical },
    robots:
      isEnabled || post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
      authors: postAuthors(post).map((author) =>
        absoluteUrl(`/blog/author/${author.slug}`),
      ),
      images: socialImage
        ? [
            {
              url: socialImage.url,
              width: socialImage.width,
              height: socialImage.height,
              alt: socialImage.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImage ? [socialImage.url] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const post = await getPostBySlug(slug, isEnabled);
  if (!post) notFound();

  const hero = imageSource(post.heroImage, "wide");
  const authors = postAuthors(post);
  const categories = postCategories(post);
  const primaryCategory = categories[0];
  const relatedPosts = primaryCategory
    ? (
        await getPosts({
          categoryId: primaryCategory.id,
          excludeId: post.id,
          limit: 3,
        })
      ).docs
    : [];
  const canonical = post.canonicalURL || absoluteUrl(`/blog/${post.slug}`);
  const schemaImage = imageSource(post.meta?.image ?? post.heroImage, "social");
  const title = post.title || "Untitled draft";
  const faqs = (post.faqs ?? []).filter((faq) => faq.question && faq.answer);
  const sources = (post.sources ?? []).filter(
    (source) => source.title && source.url,
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: canonical,
    headline: title,
    description: post.meta?.description || post.excerpt || undefined,
    image: schemaImage ? [absoluteUrl(schemaImage.url)] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt,
    author: authors.map((author) => ({
      "@type": author.slug === "hanabi" ? "Organization" : "Person",
      ...(author.slug === "hanabi"
        ? { "@id": absoluteUrl("/#organization") }
        : {}),
      name: author.name,
      url: absoluteUrl(`/blog/author/${author.slug}`),
    })),
    publisher: {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "Hanabi",
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/android-chrome-512x512.png"),
      },
    },
    articleSection: categories.map((category) => category.name),
    isAccessibleForFree: true,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      { "@type": "ListItem", position: 3, name: title, item: canonical },
    ],
  };

  return (
    <main className="pt-32 pb-28 lg:pt-40">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      {isEnabled ? (
        <div className="fixed inset-x-0 bottom-5 z-[100] mx-auto flex w-fit items-center gap-3 rounded-full bg-neutral-950 px-4 py-2 text-sm tracking-normal text-white shadow-xl">
          Draft preview
          <Link
            href="/api/draft/disable"
            className="rounded-full bg-white px-3 py-1 text-neutral-950"
          >
            Exit
          </Link>
        </div>
      ) : null}

      <article>
        <header className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <nav
            className="flex flex-wrap justify-center gap-2"
            aria-label="Article categories"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="rounded-full bg-[#f0ede6] px-3 py-1.5 text-xs font-medium tracking-normal text-neutral-700 hover:bg-[#e7e2d8]"
              >
                {category.name}
              </Link>
            ))}
          </nav>
          <h1 className="mt-6 text-4xl leading-[1.02] font-medium tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {post.excerpt ? (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed tracking-[-0.02em] text-neutral-600 sm:text-xl">
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm tracking-normal text-neutral-500">
            {authors.map((author, index) => (
              <span key={author.id}>
                {index > 0 ? " and " : "By "}
                <Link
                  href={`/blog/author/${author.slug}`}
                  rel="author"
                  className="text-neutral-900 hover:underline"
                >
                  {author.name}
                </Link>
              </span>
            ))}
            {authors.length && post.publishedAt ? (
              <span aria-hidden>·</span>
            ) : null}
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {formatPostDate(post.publishedAt)}
              </time>
            ) : null}
          </div>
        </header>

        {hero ? (
          <figure className="mx-auto mt-12 max-w-6xl px-5 sm:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-neutral-200 sm:rounded-[2rem]">
              <Image
                src={hero.url}
                alt={hero.alt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
            {asMedia(post.heroImage)?.caption ? (
              <figcaption className="mt-3 text-center text-sm tracking-normal text-neutral-500">
                {asMedia(post.heroImage)?.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {post.content?.root ? (
          <div className="blog-prose mx-auto mt-14 max-w-3xl px-5 sm:px-8">
            <RichText data={post.content} />
          </div>
        ) : isEnabled ? (
          <div className="mx-auto mt-14 max-w-3xl px-5 sm:px-8">
            <div className="rounded-2xl border border-dashed border-black/20 p-8 text-center text-sm tracking-normal text-neutral-500">
              Add article content in Payload to complete this preview.
            </div>
          </div>
        ) : null}

        {faqs.length ? (
          <section
            className="mx-auto mt-20 max-w-3xl px-5 sm:px-8"
            aria-labelledby="frequently-asked-questions"
          >
            <h2
              id="frequently-asked-questions"
              className="text-3xl font-medium tracking-[-0.04em]"
            >
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {faqs.map((faq) => (
                <details key={faq.id ?? faq.question} className="group py-5">
                  <summary className="cursor-pointer list-none pr-8 text-lg font-medium marker:hidden">
                    {faq.question}
                  </summary>
                  <p className="mt-3 leading-relaxed tracking-[-0.02em] text-neutral-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {sources.length ? (
          <section
            className="mx-auto mt-16 max-w-3xl px-5 sm:px-8"
            aria-labelledby="sources"
          >
            <h2
              id="sources"
              className="text-2xl font-medium tracking-[-0.035em]"
            >
              Sources and further reading
            </h2>
            <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed tracking-normal text-neutral-600">
              {sources.map((source) => (
                <li key={source.id ?? source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-950 underline underline-offset-3"
                  >
                    {source.title}
                  </a>
                  {source.publisher ? `, ${source.publisher}` : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {authors.length ? (
          <section
            className="mx-auto mt-16 max-w-3xl px-5 sm:px-8"
            aria-label="About the authors"
          >
            {authors.map((author) => {
              const avatar = imageSource(author.avatar, "thumbnail");
              return (
                <div
                  key={author.id}
                  className="flex gap-5 rounded-3xl bg-[#f0ede6] p-6 sm:p-8"
                >
                  {avatar ? (
                    <Image
                      src={avatar.url}
                      alt={avatar.alt}
                      width={80}
                      height={80}
                      className="size-16 shrink-0 rounded-full object-cover sm:size-20"
                    />
                  ) : null}
                  <div>
                    <p className="text-xs font-medium tracking-[0.08em] text-neutral-500 uppercase">
                      Written by
                    </p>
                    <h2 className="mt-1 text-xl font-medium">
                      <Link
                        href={`/blog/author/${author.slug}`}
                        className="hover:underline"
                      >
                        {author.name}
                      </Link>
                    </h2>
                    <p className="mt-2 leading-relaxed tracking-[-0.02em] text-neutral-600">
                      {author.bio}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
        ) : null}
      </article>

      {relatedPosts.length ? (
        <section
          className="mx-auto mt-24 max-w-7xl border-t border-black/10 px-5 pt-14 sm:px-8"
          aria-labelledby="related-articles"
        >
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-medium tracking-[0.08em] text-[#e84519] uppercase">
                Keep reading
              </p>
              <h2
                id="related-articles"
                className="mt-2 text-3xl font-medium tracking-[-0.04em]"
              >
                Related articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium underline underline-offset-4"
            >
              All articles
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
