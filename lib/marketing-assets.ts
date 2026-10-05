export const DEFAULT_MARKETING_ASSET_BASE_URL =
  "https://pub-97f138351df2462c98a4566c40b0d2ec.r2.dev";

export const MARKETING_ASSET_VERSION = "v1";

export const MARKETING_ASSET_BASE_URL = (
  process.env.NEXT_PUBLIC_MARKETING_ASSET_BASE_URL ??
  DEFAULT_MARKETING_ASSET_BASE_URL
).replace(/\/+$/, "");

// New portfolio exports stay bundled until published to the marketing bucket.
const BUNDLED_MARKETING_ASSETS = new Set([
  "projects/compops-dashboard.webp",
  "projects/compops-organizations.webp",
  "projects/go-gym-splash.webp",
  "projects/go-gym-activity.webp",
  "projects/go-gym-workouts.webp",
  "projects/go-gym-me.webp",
  "hero-projects/compopsDashboard.png",
  "hero-projects/compopsOrganizations.png",
  "hero-projects/go-gym-reel.mp4",
  "hero-projects/go-gym-poster.webp",
]);

/** Resolves marketing assets through the shared delivery adapter. */
export function marketingAssetUrl(assetPath: string): string {
  const normalizedPath = assetPath
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  if (BUNDLED_MARKETING_ASSETS.has(normalizedPath)) return `/${normalizedPath}`;

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
  "projects/compops-dashboard.webp",
  "projects/compops-organizations.webp",
  "projects/go-gym-splash.webp",
  "projects/go-gym-activity.webp",
  "projects/go-gym-workouts.webp",
  "projects/go-gym-me.webp",
  "projects/leadly1.png",
  "projects/leadly2.png",
  "projects/thomasbewick1.png",
  "projects/thomasbewick2.png",
  "projects/tradeMoai1.png",
  "projects/tradeMoai2.png",
  "projects/wabisabi1.png",
  "projects/wabisabi2.png",
  "whyus/code.png",
  "whyus/communication.png",
  "whyus/flexible.png",
  "whyus/quality.png",
  "whyus/speed.png",
] as const;
