import type { Field } from "payload";

export function formatSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugField(sourceField = "title"): Field {
  return {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    index: true,
    admin: {
      description:
        "Used in the public URL. It updates only when this field is empty.",
      position: "sidebar",
    },
    hooks: {
      beforeValidate: [
        ({ data, value }) => {
          const source = value || data?.[sourceField];
          return typeof source === "string" ? formatSlug(source) : value;
        },
      ],
    },
  };
}
