import HangingPaperCranes from "@/components/hanging-paper-cranes";
import WorkCardGallery from "@/components/work-card-gallery";
import type { WorkProjectImages } from "@/data/work-projects";

export type WorkCardProps = {
  title: string;
  category: string;
  description: string;
  images: WorkProjectImages;
};

export default function WorkCard({
  title,
  category,
  description,
  images,
}: WorkCardProps) {
  return (
    <article className="flex w-full flex-col gap-2 sm:gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4 font-mono text-sm font-medium tracking-[0.06em] text-[#6C6C6C] uppercase sm:text-sm">
          <span className="min-w-0 text-pretty text-black">{title}</span>
          <span className="shrink-0 text-right">{category}</span>
        </div>

        <div className="relative overflow-hidden rounded-t-xl rounded-b-none border border-[#E0E0E0] bg-[#F9F9F9]">
          <HangingPaperCranes variant="card" seed={title} />
          <div className="relative z-10 p-4 sm:p-5 md:p-6">
            <WorkCardGallery images={images} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center rounded-t-none rounded-b-xl border border-[#E0E0E0] bg-[#F9F9F9] px-5 py-3 sm:px-8">
        <p className="font-inter max-w-2xl text-center text-base leading-relaxed font-normal text-[#1a1a1a] sm:text-[17px]">
          {description}
        </p>
      </div>
    </article>
  );
}
