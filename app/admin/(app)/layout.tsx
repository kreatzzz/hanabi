import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";
import { getTheme } from "@/lib/theme";
import { logoutAdmin } from "@/app/admin/actions";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggleButton } from "@/components/theme-toggle";
import { ThemeSync } from "@/components/theme-sync";
import { Button, buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Hanabi Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const theme = await getTheme();

  return (
    <div
      data-theme-root
      className={cn(
        "bg-muted/30 text-foreground min-h-svh",
        theme === "dark" && "dark",
      )}
    >
      <header className="bg-background/90 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo size={24} />
            <span className="text-sm font-semibold tracking-tight">Hanabi</span>
            <span className="text-muted-foreground bg-muted rounded-md px-1.5 py-0.5 text-[0.68rem] font-medium">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/admin/cms-setup"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Blog CMS
            </Link>
            <ThemeToggleButton />
            <form action={logoutAdmin}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
      <Toaster position="bottom-right" />
      <ThemeSync theme={theme} />
    </div>
  );
}
