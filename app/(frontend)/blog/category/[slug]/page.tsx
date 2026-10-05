import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/blog/blog-index";
import { JsonLd } from "@/components/blog/json-ld";
import { getCategoryBySlug, getPosts } from "@/lib/blog/data";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: {
      type: "website",
      url: `/blog/category/${category.slug}`,
      title: category.name,
      description: category.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Hanabi Blog`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const result = await getPosts({ categoryId: category.id, limit: 24 });
  if (result.totalDocs === 0) notFound();

  return (
    <main className="px-5 pt-36 pb-28 sm:px-8 lg:pt-44">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: category.name,
          description: category.description,
          url: absoluteUrl(`/blog/category/${category.slug}`),
        }}
      />
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-sm font-medium tracking-[0.08em] text-[#e84519] uppercase">
            Topic
          </p>
          <h1 className="mt-4 text-5xl leading-none font-medium tracking-[-0.05em] sm:text-6xl">
            {category.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed tracking-[-0.02em] text-neutral-600">
            {category.description}
          </p>
        </header>
        <BlogIndex
          result={result}
          page={1}
          pathPrefix={`/blog/category/${category.slug}/page`}
        />
      </div>
    </main>
  );
}
