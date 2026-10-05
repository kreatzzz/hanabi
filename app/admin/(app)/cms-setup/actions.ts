"use server";

import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { requireAdmin } from "@/lib/auth";

const CMS_OWNER_EMAIL = "deydevelops@gmail.com";

export type CmsSetupState = { error?: string };

export async function createCmsOwner(
  _previous: CmsSetupState,
  formData: FormData,
): Promise<CmsSetupState> {
  await requireAdmin();

  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 14 || password.length > 128) {
    return { error: "Choose a password between 14 and 128 characters." };
  }
  if (password !== confirmation) {
    return { error: "The passwords do not match." };
  }

  const config = (await import("@/payload.config")).default;
  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "users",
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs.length) {
    return { error: "The CMS already has an account. Sign in at /cms." };
  }

  await payload.create({
    collection: "users",
    overrideAccess: true,
    data: {
      email: CMS_OWNER_EMAIL,
      name: "Dey",
      password,
    },
  });
  redirect("/cms/login");
}
