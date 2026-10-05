import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { authenticated } from "../access";
import {
  revalidateBlogAfterChange,
  revalidateBlogAfterDelete,
} from "../hooks/revalidate-blog";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
    useAsTitle: "alt",
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
  upload: {
    staticDir: path.resolve(projectRoot, "media"),
    adminThumbnail: "thumbnail",
    focalPoint: true,
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        height: 320,
        position: "centre",
      },
      {
        name: "card",
        width: 960,
        height: 640,
        position: "centre",
      },
      {
        name: "social",
        width: 1200,
        height: 630,
        position: "centre",
      },
      {
        name: "wide",
        width: 1920,
        height: 1080,
        position: "centre",
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Describe the image for people using screen readers.",
      },
    },
    {
      name: "caption",
      type: "textarea",
    },
  ],
};
