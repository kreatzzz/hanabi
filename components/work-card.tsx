import HangingPaperCranes from "@/components/hanging-paper-cranes";
import ProjectContributorMasks from "@/components/project-contributor-masks";
import { LinkIcon } from "@/components/ui/link";
import WorkCardGallery from "@/components/work-card-gallery";
import type {
  WorkProjectContributor,
  WorkProjectImages,
} from "@/data/work-projects";

export type WorkCardProps = {
  title: string;
  category: string;
  description: string;
  images: WorkProjectImages;
  galleryLayout?: "screens";
  contributors: readonly WorkProjectContributor[];
  liveUrl?: string;
};

export default function WorkCard({
  title,
  category,
  description,
  images,
  contributors,
  liveUrl,
  galleryLayout,
}: WorkCardProps) {
  return (
    <article className="flex w-full flex-col">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4 font-mono text-sm font-medium tracking-[0.06em] text-[#6C6C6C] uppercase sm:text-sm">
          <span className="flex min-w-0 items-center gap-1.5 text-pretty text-black">
            <span className="min-w-0">{title}</span>
            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${title} live site`}
                className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-black/70 transition-colors duration-200 hover:text-black focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F6F6] focus-visible:outline-none"
              >
                <LinkIcon size={15} aria-hidden="true" />
              </a>
            ) : null}
          </span>
          <span className="shrink-0 text-right">{category}</span>
        </div>

        <div className="relative flex flex-col overflow-visible rounded-xl">
          <div className="relative z-50 overflow-hidden rounded-t-xl rounded-b-none bg-[#FFF] shadow-sm inset-shadow-sm inset-shadow-black/20">
            {galleryLayout !== "screens" ? (
              <HangingPaperCranes
                seed={title}
                variant="card"
                className="hidden md:block"
              />
            ) : null}
            <div className="relative z-10 px-6 pt-4 pb-4 sm:px-9 sm:pt-5 sm:pb-5 md:px-12 md:pt-6 md:pb-6">
              <WorkCardGallery
                layout={galleryLayout}
                images={images}
                mobileImageCorners="rounded"
                mobileThreeLayout={
                  title === "DOWN THE COVE" ? "side-by-side" : "stacked"
                }
                desktopThreeLayout={
                  title === "DOWN THE COVE" ? "side-by-side" : "overlap"
                }
              />
            </div>
            <ProjectContributorMasks contributors={contributors} />
          </div>

          <div
            aria-hidden="true"
            className="relative z-40 h-2 bg-[#F6F6F6] sm:h-3"
          />

          <div className="relative z-10 flex items-center justify-center rounded-t-none rounded-b-xl bg-[#FFF] px-5 py-3 shadow-sm inset-shadow-sm inset-shadow-black/20 sm:px-8">
            <p className="font-inter max-w-2xl text-center text-base leading-relaxed font-normal text-[#1a1a1a] sm:text-[17px]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
