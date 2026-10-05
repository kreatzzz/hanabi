function resolveSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const url = explicitUrl ?? (vercelUrl ? `https://${vercelUrl}` : null);

  const parsed = new URL(url ?? "http://localhost:3000");
  if (parsed.hostname === "tryhanabi.com") {
    parsed.hostname = "www.tryhanabi.com";
  }
  return parsed.toString().replace(/\/$/, "");
}

export const SITE_URL = resolveSiteUrl();

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
