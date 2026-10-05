import { getPosts } from "@/lib/blog/data";
import { postAuthors } from "@/lib/blog/presenters";
import { absoluteUrl } from "@/lib/site-url";

export const revalidate = 900;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { docs } = await getPosts({ limit: 50 });
  const feedUrl = absoluteUrl("/blog/feed.xml");
  const items = docs
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      const authors = postAuthors(post)
        .map((author) => author.name)
        .join(", ");

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid isPermaLink="true">${escapeXml(url)}</guid>
  <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
  ${authors ? `<dc:creator>${escapeXml(authors)}</dc:creator>` : ""}
  <description>${escapeXml(post.excerpt)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>Hanabi Blog</title>
  <link>${escapeXml(absoluteUrl("/blog"))}</link>
  <description>Practical notes on product design, web development, brand systems, and digital experiences.</description>
  <language>en</language>
  <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
