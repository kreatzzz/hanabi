import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogIndex } from "@/components/blog/blog-index";
import { getAuthorBySlug, getPosts } from "@/lib/blog/data";

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
  const [author, page] = await Promise.all([
    getAuthorBySlug(slug),
    Promise.resolve(parsePage(pageValue)),
  ]);
  if (!author || !page) return {};

  return {
    title: `${author.name}, page ${page}`,
    description: `Articles by ${author.name}. Page ${page}.`,
    alternates: { canonical: `/blog/author/${author.slug}/page/${page}` },
    openGraph: {
      type: "website",
      url: `/blog/author/${author.slug}/page/${page}`,
      title: `${author.name} articles, page ${page}`,
      description: `Articles by ${author.name}. Page ${page}.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} articles, page ${page}`,
      description: `Articles by ${author.name}. Page ${page}.`,
    },
  };
}

export default async function AuthorArchivePage({ params }: PageProps) {
  const { slug, page: pageValue } = await params;
  const page = parsePage(pageValue);
  if (!page) notFound();
  if (page === 1) redirect(`/blog/author/${slug}`);

  const author = await getAuthorBySlug(slug);
  if (!author) notFound();
  const result = await getPosts({ authorId: author.id, page, limit: 24 });
  if (page > result.totalPages) notFound();

  return (
    <main className="px-5 pt-36 pb-28 sm:px-8 lg:pt-44">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-sm font-medium tracking-[0.08em] text-[#e84519] uppercase">
            Author
          </p>
          <h1 className="mt-4 text-5xl leading-none font-medium tracking-[-0.05em] sm:text-6xl">
            {author.name}
          </h1>
          <p className="mt-4 text-neutral-500">Page {page}</p>
        </header>
        <BlogIndex
          result={result}
          page={page}
          pathPrefix={`/blog/author/${author.slug}/page`}
        />
      </div>
    </main>
  );
}
