import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogIndex } from "@/components/blog/blog-index";
import { getCategoryBySlug, getPosts } from "@/lib/blog/data";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string; page: string }> };

function parsePage(value: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, page: pageValue } = await params;
  const [category, page] = await Promise.all([
    getCategoryBySlug(slug),
    Promise.resolve(parsePage(pageValue)),
  ]);
  if (!category || !page) return {};

  return {
    title: `${category.name}, page ${page}`,
    description: `${category.description} Page ${page}.`,
    alternates: { canonical: `/blog/category/${category.slug}/page/${page}` },
    openGraph: {
      type: "website",
      url: `/blog/category/${category.slug}/page/${page}`,
      title: `${category.name} articles, page ${page}`,
      description: `${category.description} Page ${page}.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} articles, page ${page}`,
      description: `${category.description} Page ${page}.`,
    },
  };
}

export default async function CategoryArchivePage({ params }: PageProps) {
  const { slug, page: pageValue } = await params;
  const page = parsePage(pageValue);
  if (!page) notFound();
  if (page === 1) redirect(`/blog/category/${slug}`);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const result = await getPosts({ categoryId: category.id, page, limit: 24 });
  if (page > result.totalPages) notFound();

  return (
    <main className="px-5 pt-36 pb-28 sm:px-8 lg:pt-44">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-sm font-medium tracking-[0.08em] text-[#e84519] uppercase">
            Topic
          </p>
          <h1 className="mt-4 text-5xl leading-none font-medium tracking-[-0.05em] sm:text-6xl">
            {category.name}
          </h1>
          <p className="mt-4 text-neutral-500">Page {page}</p>
        </header>
        <BlogIndex
          result={result}
          page={page}
          pathPrefix={`/blog/category/${category.slug}/page`}
        />
      </div>
    </main>
  );
}
