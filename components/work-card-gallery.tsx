import type { ReactNode } from "react";

import type { WorkProjectImage } from "@/data/work-projects";
import RevealImage from "@/components/reveal-image";

type GalleryProps = {
  images: readonly WorkProjectImage[];
  layout?: "screens";
  mobileImageCorners?: "rounded" | "square";
  mobileThreeLayout?: "stacked" | "side-by-side";
  desktopThreeLayout?: "overlap" | "side-by-side";
};

/** Shared canvas — taller so tiles read at portfolio scale */
const galleryViewport =
  "relative h-[320px] w-full sm:h-[440px] md:h-[420px] lg:h-[500px] xl:h-[540px]";

function TileFill({
  image,
  mobileImageCorners = "rounded",
  sizes,
}: {
  image: WorkProjectImage;
  mobileImageCorners?: "rounded" | "square";
  sizes: string;
}) {
  const radiusClass = "rounded-none";

  return (
    <div
      className={`relative h-full min-h-0 w-full overflow-hidden ${radiusClass}`}
    >
      {image.mobileSrc && (
        <div className="absolute inset-0 block sm:hidden">
          <RevealImage
            src={image.mobileSrc}
            alt={image.alt}
            fill
            loading="lazy"
            sizes={sizes}
            className={`${radiusClass} object-contain`}
            wrapperClassName="absolute inset-0"
          />
        </div>
      )}
      <div
        className={`absolute inset-0 ${image.mobileSrc ? "hidden sm:block" : ""}`}
      >
        <RevealImage
          src={image.src}
          alt={image.alt}
          fill
          loading="lazy"
          sizes={sizes}
          className={`${radiusClass} object-contain`}
          wrapperClassName="absolute inset-0"
        />
      </div>
    </div>
  );
}

/**
 * Layout rules (wireframe):
 * 1 — single large tile centered with margin.
 * 2 — side-by-side on desktop, stacked vertically on mobile.
 * 3 — stacked collage; img[2] foremost at bottom.
 * 4 — 2×2 grid.
 */

function GalleryOne({
  image,
  mobileImageCorners,
}: {
  image: WorkProjectImage;
  mobileImageCorners?: "rounded" | "square";
}) {
  return (
    <div className="flex h-full w-full items-center justify-center px-1 sm:px-2">
      <div className="relative aspect-16/10 h-[88%] w-auto max-w-[92%]">
        <TileFill
          image={image}
          mobileImageCorners={mobileImageCorners}
          sizes="(max-width: 1152px) 85vw, 900px"
        />
      </div>
    </div>
  );
}

function GalleryTwo({
  images,
  mobileImageCorners,
}: {
  images: readonly [WorkProjectImage, WorkProjectImage];
  mobileImageCorners?: "rounded" | "square";
}) {
  return (
    <>
      <div className="flex h-full w-full flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4 md:hidden">
        <div className="relative flex-1">
          <TileFill
            image={images[0]}
            mobileImageCorners={mobileImageCorners}
            sizes="(max-width: 640px) 85vw, 42vw"
          />
        </div>
        <div className="relative flex-1">
          <TileFill
            image={images[1]}
            mobileImageCorners={mobileImageCorners}
            sizes="(max-width: 640px) 85vw, 42vw"
          />
        </div>
      </div>

      <div className="relative hidden h-full w-full md:block">
        <div className="absolute top-[4%] left-[4%] z-10 h-[72%] w-[56%]">
          <TileFill image={images[0]} sizes="(max-width: 1152px) 56vw, 640px" />
        </div>

        <div className="absolute right-[4%] bottom-[4%] z-20 h-[72%] w-[56%]">
          <TileFill image={images[1]} sizes="(max-width: 1152px) 56vw, 640px" />
        </div>
      </div>
    </>
  );
}

function GalleryThree({
  images,
  mobileImageCorners,
  mobileLayout = "stacked",
  desktopLayout = "overlap",
}: {
  images: readonly [WorkProjectImage, WorkProjectImage, WorkProjectImage];
  mobileImageCorners?: "rounded" | "square";
  mobileLayout?: "stacked" | "side-by-side";
  desktopLayout?: "overlap" | "side-by-side";
}) {
  const collageTileClass =
    "aspect-[1440/1024] shadow-[0_18px_44px_-30px_rgba(0,0,0,0.55)]";

  return (
    <>
      {mobileLayout === "side-by-side" ? (
        <div className="grid h-full w-full grid-cols-2 items-center gap-2 p-2 sm:gap-3 sm:p-4 md:hidden">
          <div className="relative h-full min-h-0">
            <TileFill
              image={images[0]}
              mobileImageCorners={mobileImageCorners}
              sizes="(max-width: 640px) 45vw, 42vw"
            />
          </div>
          <div className="relative h-full min-h-0">
            <TileFill
              image={images[2]}
              mobileImageCorners={mobileImageCorners}
              sizes="(max-width: 640px) 45vw, 42vw"
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:hidden">
          {[images[0], images[2]].map((image) => (
            <div key={image.src} className="relative min-h-0 flex-1">
              <TileFill
                image={image}
                mobileImageCorners={mobileImageCorners}
                sizes="(max-width: 640px) 82vw, 42vw"
              />
            </div>
          ))}
        </div>
      )}

      {desktopLayout === "side-by-side" ? (
        <div className="hidden h-full w-full gap-4 p-5 md:flex">
          <div className="relative flex-1">
            <TileFill image={images[0]} sizes="33vw" />
          </div>
          <div className="relative flex-1">
            <TileFill image={images[1]} sizes="33vw" />
          </div>
          <div className="relative flex-1">
            <TileFill image={images[2]} sizes="33vw" />
          </div>
        </div>
      ) : (
        <div className="relative hidden h-full w-full items-center justify-center md:flex">
          <div className="relative h-full w-full max-w-[1680px] lg:w-[98%] xl:w-[97%]">
            <div
              className={`absolute top-[1%] left-[0%] z-30 w-[49%] lg:top-[0%] lg:left-[1%] lg:w-[46%] xl:left-[2%] xl:w-[44%] ${collageTileClass}`}
            >
              <TileFill
                image={images[0]}
                sizes="(max-width: 1024px) 47vw, (max-width: 1280px) 43vw, 710px"
              />
            </div>
            <div
              className={`absolute top-[12%] right-[-2%] z-40 w-[49%] lg:top-[11%] lg:right-[-1%] lg:w-[46%] xl:top-[10%] xl:right-[0%] xl:w-[44%] ${collageTileClass}`}
            >
              <TileFill
                image={images[1]}
                sizes="(max-width: 1024px) 47vw, (max-width: 1280px) 43vw, 710px"
              />
            </div>
            <div
              className={`absolute bottom-[0%] left-[46%] z-20 w-[45%] -translate-x-1/2 lg:left-[47%] lg:w-[43%] xl:left-[48%] xl:w-[41%] ${collageTileClass}`}
            >
              <TileFill
                image={images[2]}
                sizes="(max-width: 1024px) 43vw, (max-width: 1280px) 40vw, 660px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryFour({
  images,
  mobileImageCorners,
}: {
  images: readonly [
    WorkProjectImage,
    WorkProjectImage,
    WorkProjectImage,
    WorkProjectImage,
  ];
  mobileImageCorners?: "rounded" | "square";
}) {
  return (
    <div className="grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3 md:gap-4">
      {images.map((image, i) => (
        <TileFill
          key={`${image.src}-${i}`}
          image={image}
          mobileImageCorners={mobileImageCorners}
          sizes="(max-width: 1152px) 48vw, 640px"
        />
      ))}
    </div>
  );
}

export default function WorkCardGallery({
  images,
  mobileImageCorners = "rounded",
  mobileThreeLayout = "stacked",
  desktopThreeLayout = "overlap",
  layout,
}: GalleryProps) {
  if (layout === "screens") {
    const visibility = ["block", "hidden min-[480px]:block", "hidden md:block"];
    return (
      <div className="grid h-[400px] grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:h-[440px] sm:gap-6 md:h-[420px] md:grid-cols-3 lg:h-[500px] xl:h-[540px]">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={"relative h-full min-w-0 " + visibility[index]}
          >
            <RevealImage
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(max-width: 479px) 230px, (max-width: 767px) 40vw, (max-width: 1023px) 27vw, 250px"
              className="object-contain"
              wrapperClassName="absolute inset-0"
            />
          </div>
        ))}
      </div>
    );
  }

  let inner: ReactNode;

  switch (images.length) {
    case 1:
      inner = (
        <GalleryOne image={images[0]} mobileImageCorners={mobileImageCorners} />
      );
      break;
    case 2:
      inner = (
        <GalleryTwo
          images={
            [images[0], images[1]] as readonly [
              WorkProjectImage,
              WorkProjectImage,
            ]
          }
          mobileImageCorners={mobileImageCorners}
        />
      );
      break;
    case 3:
      inner = (
        <GalleryThree
          mobileLayout={mobileThreeLayout}
          desktopLayout={desktopThreeLayout}
          images={
            [images[0], images[1], images[2]] as readonly [
              WorkProjectImage,
              WorkProjectImage,
              WorkProjectImage,
            ]
          }
          mobileImageCorners={mobileImageCorners}
        />
      );
      break;
    case 4:
      inner = (
        <GalleryFour
          images={
            [images[0], images[1], images[2], images[3]] as readonly [
              WorkProjectImage,
              WorkProjectImage,
              WorkProjectImage,
              WorkProjectImage,
            ]
          }
          mobileImageCorners={mobileImageCorners}
        />
      );
      break;
    default:
      inner = null;
  }

  return <div className={galleryViewport}>{inner}</div>;
}
