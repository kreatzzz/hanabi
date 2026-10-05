import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

function revalidateBlogPath(slug?: string | null) {
  try {
    revalidateTag("blog-public", { expire: 0 });
  } catch {
    // Payload scripts run outside a Next.js request, where revalidation has no store.
  }
  try {
    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/blog/feed.xml");

    if (slug) revalidatePath(`/blog/${slug}`);
  } catch {
    // Payload scripts run outside a Next.js request, where revalidation has no store.
  }
}

export const revalidateBlogAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  revalidateBlogPath(doc.slug);

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidateBlogPath(previousDoc.slug);
  }

  return doc;
};

export const revalidateBlogAfterDelete: CollectionAfterDeleteHook = ({
  doc,
}) => {
  revalidateBlogPath(doc.slug);
  return doc;
};
