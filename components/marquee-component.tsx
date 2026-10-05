"use client";

import { SeamlessMarquee } from "@/components/seamless-marquee";
import Image from "next/image";
import ShowreelVideo from "@/components/showreel-video";
import { memo } from "react";
import { marketingAssetUrl } from "@/lib/marketing-assets";

const MARQUEE_SPEED = 64;
const HERO_PROJECT_ASPECT_RATIO = "45 / 32";
const KNOWN_LCP_ITEMS = new Set(["compopsDashboard"]);

const MarqueeItem = memo(function MarqueeItem({
  item,
  index,
}: {
  item: string;
  index: number;
}) {
  const shouldLoadImmediately = index < 4 || KNOWN_LCP_ITEMS.has(item);

  return (
    <div
      className="relative h-52 shrink-0 overflow-hidden rounded-lg sm:h-72 md:h-80"
      style={{ aspectRatio: HERO_PROJECT_ASPECT_RATIO }}
    >
      <Image
        src={marketingAssetUrl(`hero-projects/${item}.png`)}
        alt=""
        fill
        sizes="(max-width: 640px) 293px, (max-width: 768px) 405px, 450px"
        className="object-cover"
        loading={shouldLoadImmediately ? "eager" : "lazy"}
        priority={shouldLoadImmediately}
      />
    </div>
  );
});

export default function MarqueeComponent({ items }: { items: string[] }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
      <SeamlessMarquee speed={MARQUEE_SPEED}>
        <div className="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
          <ShowreelVideo />
          {items.map((item, index) => (
            <MarqueeItem key={`${item}-${index}`} item={item} index={index} />
          ))}
        </div>
      </SeamlessMarquee>
    </div>
  );
}
