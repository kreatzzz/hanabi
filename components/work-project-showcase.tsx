"use client";

import { useState } from "react";
import RevealImage from "@/components/reveal-image";
import type { WorkProjectImage, WorkProjectVideo } from "@/data/work-projects";

export default function WorkProjectShowcase({
  images,
  videos,
}: {
  images: readonly WorkProjectImage[];
  videos: readonly WorkProjectVideo[];
}) {
  const [selected, setSelected] = useState(0);
  const video = videos[selected];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex min-w-0 flex-col items-center gap-3">
        <div className="w-full max-w-[250px] overflow-hidden rounded-2xl bg-[#101010] shadow-[0_12px_28px_-18px_rgba(0,0,0,0.5)]">
          <video
            key={video.src}
            controls
            playsInline
            preload="none"
            poster={video.poster}
            aria-label={video.alt}
            className="aspect-[1766/3840] w-full object-contain"
          >
            <source src={video.src} type="video/mp4" />
            <a href={video.src}>Watch {video.label}</a>
          </video>
        </div>
        <div
          role="group"
          aria-label="Choose a Go Gym video"
          className="flex flex-wrap justify-center gap-1 rounded-full bg-[#F0F0F0] p-1"
        >
          {videos.map((item, index) => (
            <button
              key={item.src}
              type="button"
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={`min-h-11 cursor-pointer rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#FF6600] ${selected === index ? "bg-white text-black shadow-sm" : "text-[#6C6C6C] hover:text-black"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-4">
        {images.map((image) => (
          <div
            key={image.src}
            className="relative aspect-[45/32] w-full overflow-hidden rounded-lg outline outline-black/5 lg:aspect-auto lg:h-[250px]"
          >
            <RevealImage
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 85vw, 600px"
              className="object-contain"
              wrapperClassName="absolute inset-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
