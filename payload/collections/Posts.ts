import type { CollectionConfig } from "payload";
import { authenticated, publishedOrAuthenticated } from "../access";
import { slugField } from "../fields/slug";
import { validateRequiredUrl, validateUrl } from "../fields/url";
import {
  revalidateBlogAfterChange,
  revalidateBlogAfterDelete,
} from "../hooks/revalidate-blog";
import { SITE_URL } from "../../lib/site-url";

const previewUrl = (slug?: string | null) => {
  const params = new URLSearchParams({
    slug: slug ?? "",
    secret: process.env.PAYLOAD_PREVIEW_SECRET ?? "",
  });

  return `${SITE_URL}/api/draft?${params.toString()}`;
};

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: "Blog",
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedAt", "updatedAt"],
    preview: (doc) =>
      previewUrl(typeof doc.slug === "string" ? doc.slug : null),
    livePreview: {
      url: ({ data }) =>
        previewUrl(typeof data.slug === "string" ? data.slug : null),
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  defaultSort: "-publishedAt",
  versions: {
    drafts: {
      autosave: {
        interval: 800,
      },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
  hooks: {
    afterChange: [revalidateBlogAfterChange],
    afterDelete: [revalidateBlogAfterDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 90,
    },
    slugField(),
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      minLength: 80,
      maxLength: 220,
      admin: {
        description:
          "A direct summary used on blog cards and as the SEO description fallback.",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "authors",
      type: "relationship",
      relationTo: "authors",
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: "faqs",
      label: "Frequently asked questions",
      type: "array",
      admin: {
        description:
          "Optional. Visible on the article; no FAQ structured data is emitted.",
      },
      fields: [
        {
          name: "question",
          type: "text",
          required: true,
        },
        {
          name: "answer",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "sources",
      type: "array",
      admin: {
        description: "Citations and further reading shown beneath the article.",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
          validate: validateRequiredUrl,
        },
        {
          name: "publisher",
          type: "text",
        },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData?._status === "published" && !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "canonicalURL",
      label: "Canonical URL override",
      type: "text",
      validate: validateUrl,
      admin: {
        description:
          "Leave blank unless this article was first published elsewhere.",
        position: "sidebar",
      },
    },
    {
      name: "noIndex",
      label: "Hide from search engines",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
