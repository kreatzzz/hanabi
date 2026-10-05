export const DEFAULT_MARKETING_ASSET_BASE_URL =
  "https://pub-97f138351df2462c98a4566c40b0d2ec.r2.dev";

export const MARKETING_ASSET_VERSION = "v1";

export const MARKETING_ASSET_BASE_URL = (
  process.env.NEXT_PUBLIC_MARKETING_ASSET_BASE_URL ??
  DEFAULT_MARKETING_ASSET_BASE_URL
).replace(/\/+$/, "");

/** Builds a public URL for an immutable image in the marketing R2 bucket. */
export function marketingAssetUrl(assetPath: string): string {
  const normalizedPath = assetPath
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${MARKETING_ASSET_BASE_URL}/${MARKETING_ASSET_VERSION}/${normalizedPath}`;
}

/** Images that use generated low-quality placeholders in RevealImage. */
export const BLUR_ASSET_PATHS = [
  "projects/ballaratboxsports1.png",
  "projects/ballaratboxsports2.png",
  "projects/ballaratboxsports3.png",
  "projects/dtc1.png",
  "projects/dtc2.png",
  "projects/dtc3.png",
  "projects/gotnextDashboard.png",
  "projects/gotnextHero.png",
  "projects/leadly1.png",
  "projects/leadly2.png",
  "projects/thomasbewick1.png",
  "projects/thomasbewick2.png",
  "projects/tradeMoai1.png",
  "projects/tradeMoai2.png",
  "projects/wabisabi1.png",
  "projects/wabisabi2.png",
  "projects/wabisabi3.png",
  "whyus/code.png",
  "whyus/communication.png",
  "whyus/flexible.png",
  "whyus/quality.png",
  "whyus/speed.png",
] as const;
