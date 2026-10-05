"use client";

import Image from "next/image";

import type { WorkProjectContributor } from "@/data/work-projects";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { marketingAssetUrl } from "@/lib/marketing-assets";

const CONTRIBUTOR_META: Record<
  WorkProjectContributor,
  { name: string; mask: string }
> = {
  krish: { name: "Krish", mask: marketingAssetUrl("team/krish.png") },
  dey: { name: "Dey", mask: marketingAssetUrl("team/dey.png") },
  sagarika: {
    name: "Sagarika",
    mask: marketingAssetUrl("team/sagarika.png"),
  },
  arsh: { name: "Arsh", mask: marketingAssetUrl("team/arsh.png") },
};

export default function ProjectContributorMasks({
  contributors,
}: {
  contributors: readonly WorkProjectContributor[];
}) {
  if (contributors.length === 0) return null;

  return (
    <TooltipProvider delay={45} closeDelay={50}>
      <div className="absolute right-3 bottom-3 z-40 flex items-end justify-end sm:right-5 sm:bottom-5">
        {contributors.map((contributor, index) => {
          const meta = CONTRIBUTOR_META[contributor];

          return (
            <Tooltip key={contributor}>
              <TooltipTrigger
                className="group relative block h-9 w-8 shrink-0 overflow-visible outline-none hover:z-10 focus-visible:z-10 sm:h-11 sm:w-9"
                style={{
                  marginLeft: index === 0 ? 0 : "-0.68rem",
                }}
                aria-label={meta.name}
              >
                <Image
                  src={meta.mask}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.16)] transition-transform duration-150 group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
                />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={6}
                className="w-[4.65rem] rounded-full border-black/5 bg-white/95 px-0 py-1 text-center text-xs font-medium text-black shadow-[0_8px_24px_-16px_rgba(0,0,0,0.42)]"
              >
                {meta.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
