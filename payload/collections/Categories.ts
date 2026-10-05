import type { CollectionConfig } from "payload";
import { authenticated } from "../access";
import { slugField } from "../fields/slug";
import {
  revalidateBlogAfterChange,
  revalidateBlogAfterDelete,
} from "../hooks/revalidate-blog";

export const Categories: CollectionConfig = {
  slug: "categories",
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
      name: "description",
      type: "textarea",
      required: true,
      maxLength: 300,
    },
  ],
};
