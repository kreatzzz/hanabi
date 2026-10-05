import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogIndex } from "@/components/blog/blog-index";
import { getPosts } from "@/lib/blog/data";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ page: string }>;
};

function parsePage(value: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = parsePage((await params).page);
  if (!page) return {};

  return {
    title: `Blog archive, page ${page}`,
    description: `Browse page ${page} of Hanabi's writing on product design, web development, and digital experiences.`,
    alternates: {
      canonical: `/blog/page/${page}`,
    },
    openGraph: {
      type: "website",
      url: `/blog/page/${page}`,
      title: `Hanabi Blog, page ${page}`,
      description: `Browse page ${page} of Hanabi's writing on product design and web development.`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Hanabi Blog, page ${page}`,
      description: `Browse page ${page} of Hanabi's writing on product design and web development.`,
    },
  };
}

export default async function BlogArchivePage({ params }: PageProps) {
  const page = parsePage((await params).page);
  if (!page) notFound();
  if (page === 1) redirect("/blog");

  const result = await getPosts({ page, limit: 10 });
  if (page > result.totalPages) notFound();

  return (
    <main className="px-5 pt-36 pb-28 sm:px-8 lg:pt-44">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <p className="font-mono text-sm font-medium tracking-[0.08em] text-[#e84519] uppercase">
            Hanabi journal
          </p>
          <h1 className="mt-4 text-5xl leading-none font-medium tracking-[-0.05em]">
            Archive
          </h1>
          <p className="mt-4 text-neutral-500">Page {page}</p>
        </header>
        <BlogIndex result={result} page={page} />
      </div>
    </main>
  );
}
