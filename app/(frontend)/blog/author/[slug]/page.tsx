import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/blog/blog-index";
import { JsonLd } from "@/components/blog/json-ld";
import { getAuthorBySlug, getPosts } from "@/lib/blog/data";
import { imageSource } from "@/lib/blog/presenters";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const author = await getAuthorBySlug((await params).slug);
  if (!author) return {};

  return {
    title: `${author.name}, author`,
    description: author.bio,
    alternates: { canonical: `/blog/author/${author.slug}` },
    openGraph: {
      type: "website",
      url: `/blog/author/${author.slug}`,
      title: `${author.name} | Hanabi Blog`,
      description: author.bio,
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} | Hanabi Blog`,
      description: author.bio,
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const author = await getAuthorBySlug((await params).slug);
  if (!author) notFound();
  const [result, avatar] = await Promise.all([
    getPosts({ authorId: author.id, limit: 24 }),
    Promise.resolve(imageSource(author.avatar, "thumbnail")),
  ]);
  if (result.totalDocs === 0) notFound();

  return (
    <main className="px-5 pt-36 pb-28 sm:px-8 lg:pt-44">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": author.slug === "hanabi" ? "Organization" : "Person",
          ...(author.slug === "hanabi"
            ? { "@id": absoluteUrl("/#organization") }
            : {}),
          name: author.name,
          description: author.bio,
          image: avatar ? absoluteUrl(avatar.url) : undefined,
          ...(author.slug === "hanabi"
            ? {}
            : { jobTitle: author.role ?? undefined }),
          sameAs: [author.website, author.linkedIn].filter(Boolean),
          url: absoluteUrl(`/blog/author/${author.slug}`),
        }}
      />
      <div className="mx-auto max-w-7xl">
        <header className="mb-14 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-center">
          {avatar ? (
            <Image
              src={avatar.url}
              alt={avatar.alt}
              width={144}
              height={144}
              className="size-28 rounded-full object-cover sm:size-36"
            />
          ) : null}
          <div>
            <p className="font-mono text-sm font-medium tracking-[0.08em] text-[#e84519] uppercase">
              Author
            </p>
            <h1 className="mt-2 text-5xl leading-none font-medium tracking-[-0.05em]">
              {author.name}
            </h1>
            {author.role ? (
              <p className="mt-2 text-neutral-500">{author.role}</p>
            ) : null}
            <p className="mt-4 text-lg leading-relaxed tracking-[-0.02em] text-neutral-600">
              {author.bio}
            </p>
          </div>
        </header>
        <BlogIndex
          result={result}
          page={1}
          pathPrefix={`/blog/author/${author.slug}/page`}
        />
      </div>
    </main>
  );
}
