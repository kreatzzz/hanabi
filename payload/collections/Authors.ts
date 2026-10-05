import type { CollectionConfig } from "payload";
import { authenticated } from "../access";
import { slugField } from "../fields/slug";
import { validateUrl } from "../fields/url";
import {
  revalidateBlogAfterChange,
  revalidateBlogAfterDelete,
} from "../hooks/revalidate-blog";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    group: "Blog",
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateBlogAfterChange],
    afterDelete: [revalidateBlogAfterDelete],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    slugField("name"),
    {
      name: "role",
      type: "text",
      admin: {
        description: "Public role, for example Design Director.",
      },
    },
    {
      name: "bio",
      type: "textarea",
      required: true,
      maxLength: 500,
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "website",
      type: "text",
      validate: validateUrl,
    },
    {
      name: "linkedIn",
      label: "LinkedIn URL",
      type: "text",
      validate: validateUrl,
    },
  ],
};
