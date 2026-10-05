"use client";

import Image from "next/image";
import {
  siFigma,
  siFramer,
  siGooglegemini,
  type SimpleIcon,
} from "simple-icons";
import { InlineMarquee } from "./inline-marquee";
import { marketingAssetUrl } from "@/lib/marketing-assets";

const DESIGN_TOP_BADGES = [
  "Web Design",
  "Landing Revamp",
  "App Design",
  "Illustrations",
  "UI/UX",
  "Branding",
];

type DesignTool = {
  label: string;
  accent: string;
  icon: SimpleIcon | "illustrator";
};

const DESIGN_TOOLS: DesignTool[] = [
  {
    label: "Framer",
    icon: siFramer,
    accent: "#9B8FFF",
  },
  {
    label: "Figma",
    icon: siFigma,
    accent: "#F24E1E",
  },
  {
    label: "Gemini",
    icon: siGooglegemini,
    accent: "#4285F4",
  },
  {
    label: "Adobe Illustrator",
    icon: "illustrator",
    accent: "#FF6A00",
  },
];

function SimpleIconMark({
  icon,
  className,
}: {
  icon: SimpleIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label={icon.title}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function IllustratorMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-label="Adobe Illustrator"
    >
      <path
        fill="currentColor"
        d="M9.1 16.9 7.5 21H6.1L10 11h1.7l3.9 10h-1.5l-1.6-4.1H9.1Zm.4-1.2h2.6L10.8 12h-.1l-1.2 3.7ZM17.4 21v-7.4H16V21h1.4Zm.2-9.4c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9Z"
      />
    </svg>
  );
}

export function DesignCard({ projects }: { projects: string[] }) {
  return (
    <div
      style={{
        backgroundImage: `url('${marketingAssetUrl("gradients/mesh2.webp")}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative mx-auto flex h-[380px] w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl inset-shadow-sm inset-shadow-pink-600 sm:h-[400px] sm:max-w-[400px]"
    >
      <div className="pt-6 pb-3 sm:pt-7 sm:pb-3">
        <InlineMarquee direction="right" speed={24}>
          <div className="flex shrink-0 gap-2 pr-2 pb-0.5">
            {DESIGN_TOP_BADGES.map((badge) => (
              <span
                key={badge}
                className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-black/70 shadow-sm inset-shadow-2xs inset-shadow-white/15 backdrop-blur-sm text-shadow-2xs sm:text-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </InlineMarquee>
      </div>

      <div className="flex flex-1 items-center overflow-hidden py-3">
        <InlineMarquee direction="left" speed={48}>
          <div className="flex shrink-0 items-center gap-3 pr-3">
            {projects.map((project) => (
              <div
                key={project}
                className="shrink-0 overflow-hidden rounded-[2px]"
                style={{ width: 180, height: 130 }}
              >
                <Image
                  src={marketingAssetUrl(`hero-projects/${project}.png`)}
                  alt={project}
                  width={180}
                  height={130}
                  sizes="180px"
                  quality={82}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </InlineMarquee>
      </div>

      <div className="pt-3 pb-1 sm:pb-0">
        <InlineMarquee direction="right" speed={26}>
          <div className="flex shrink-0 gap-2 pr-2 pb-0.5">
            {DESIGN_TOOLS.map((tool) => (
              <span
                key={tool.label}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-black/70 shadow-sm inset-shadow-2xs inset-shadow-white/15 backdrop-blur-sm text-shadow-2xs sm:text-sm"
              >
                {tool.icon === "illustrator" ? (
                  <IllustratorMark className="size-4 -translate-y-px text-black/70" />
                ) : (
                  <SimpleIconMark
                    icon={tool.icon}
                    className="size-4 text-black/70"
                  />
                )}
                {tool.label}
              </span>
            ))}
          </div>
        </InlineMarquee>
      </div>

      <div className="flex flex-col gap-2 p-5 pt-2 sm:pt-4">
        <h4 className="text-2xl font-medium">Design</h4>
        <p>
          We design polished interfaces that feel clear, premium, and effortless
          for the people using them.
        </p>
      </div>
    </div>
  );
}
