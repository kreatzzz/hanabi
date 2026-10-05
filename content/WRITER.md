# Draft writer instructions

Write unpublished articles for the Hanabi studio blog. The guidelines live in `docs/seo-geo.md`.

- Posts 001–100 use `content/blog-plan.json`.
- Posts 101–500 use `content/blog-plan-500.json`.

Write one JSON file per assignment at `content/blog-drafts/NNN.json`, where NNN is the zero-padded `n` from the plan.

## JSON shape

```json
{
  "n": 1,
  "slug": "from-the-plan",
  "title": "Under 90 characters",
  "metaTitle": "Under 60 characters",
  "excerpt": "80 to 220 characters. A direct summary, not a tease.",
  "category": "from-the-plan",
  "primaryKeyword": "from-the-plan",
  "alt": "Describes the actual photograph, then why it sits with this article.",
  "caption": "Short caption. End with: Photograph via Unsplash.",
  "faqs": [
    { "question": "", "answer": "" },
    { "question": "", "answer": "" },
    { "question": "", "answer": "" }
  ],
  "sources": [{ "title": "", "url": "", "publisher": "" }],
  "markdown": "Body only. No H1."
}
```

## Article

- 1,500 to 1,900 words in `markdown`. This is the length that can rank for an agency query without padding. Do not stop at 1,100. Do not pass 1,900 by repeating a point.
- Start with the answer. Two short paragraphs a stranger could quote.
- Then six or seven `##` sections. Use `###` only when a section has real parts. The importer places two photographs after later headings, so the sections must be real, not labels.
- Short paragraphs. A list when the reader is choosing or checking.
- Use the primary keyword in the title and once in the first paragraph. Do not repeat it as a slogan.
- Cover the `angle` in the plan. That angle is what makes this post different from its neighbors.
- Include the plan's `cta` URL once, in a sentence that matches the article. Anchor text should say what the reader gets, such as Hanabi's services, selected work, or an intro call. Also mention workwithhanabi@gmail.com only if the plan says to.
- Link one sibling with a markdown link to `/blog/{sibling}` using the sibling slug from the plan. The sentence should say why that piece is next.
- Three FAQs. Each answer stands alone in two to four sentences.
- `sources`: include two items from the approved list in `docs/seo-geo.md` only when the article actually uses that source. If the article does not need an outside number, still cite one relevant document you truly relied on, and do not invent a statistic to justify a citation.
- Do not invent Hanabi revenue, awards, headcount, timelines, or client quotes. Public projects you may name: Down the Cove (ecommerce migration and redesign), Thomas Bewick (editorial heritage site), Ballarat Box Sports, Wabisabi, Got Next, Leadly, Trade Moai. The client portal holds brand files, docs, and updates after delivery. The studio designs and builds. Stack names that are true: Next.js, React, TypeScript, Tailwind, Motion, Prisma, PostgreSQL, Vercel. Design tools: Figma, Framer, Illustrator.
- Voice: a careful studio talking to a founder. No "in today's landscape," no "delve," no fake urgency.

## Images

Do not put images in the markdown. The importer attaches the photographs from the plan.

For posts 101–500, `images[0]` is the hero and `scenes[0]` is what is actually in that frame. The `alt` field must describe `scenes[0]`, then one short clause about the article. The importer writes the alt text for the two inline photographs from `scenes[1]` and `scenes[2]`. Do not describe a different picture. Do not stuff the keyword into the alt text.

For posts 001–100, `image` is the hero and `scene` is what is in the frame. Alt text must match that scene.

## Checks before you save

- Title length <= 90
- Meta title length <= 60
- Excerpt length between 80 and 220
- Word count between 1500 and 1900
- The CTA URL appears once
- The sibling `/blog/` link appears once
- Valid JSON
