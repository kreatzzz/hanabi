import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import { MARKETING_ASSET_BASE_URL } from "./lib/marketing-assets";

const remotePatterns = [new URL(`${MARKETING_ASSET_BASE_URL}/**`)];
if (process.env.PAYLOAD_MEDIA_BASE_URL) {
  remotePatterns.push(
    new URL(`${process.env.PAYLOAD_MEDIA_BASE_URL.replace(/\/$/, "")}/**`),
  );
}

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "codevps.tailc7cd0f.ts.net",
    "100.86.129.41",
    "7d08-2401-4900-1c46-c3d0-bc48-99ba-b14a-99fd.ngrok-free.app",
    "*.ngrok-free.app",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 128, 180, 256, 320, 384, 512, 640],
    minimumCacheTTL: 31536000,
    qualities: [70, 75, 80, 82, 85, 90, 92],
    remotePatterns,
  },
};

export default withPayload(nextConfig);
