import type { Metadata } from "next";
import Link from "next/link";
import { getPayload } from "payload";
import { CmsSetupForm } from "./setup-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Set up blog CMS",
  robots: { index: false, follow: false },
};

export default async function CmsSetupPage() {
  const config = (await import("@/payload.config")).default;
  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "users",
    depth: 0,
    limit: 1,
    overrideAccess: true,
  });

  return (
    <section>
      <h1 className="text-xl font-semibold tracking-tight">Set up blog CMS</h1>
      {existing.docs.length ? (
        <p className="text-muted-foreground mt-3 text-sm">
          The CMS has an account.{" "}
          <Link href="/cms/login" className="underline">
            Sign in to the CMS
          </Link>
          .
        </p>
      ) : (
        <>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm">
            Create the first Payload account for deydevelops@gmail.com. Only a
            signed-in Hanabi admin can use this page; the public first-user
            registration route is blocked.
          </p>
          <CmsSetupForm />
        </>
      )}
    </section>
  );
}
