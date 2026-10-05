"use client";
import { useEffect, useRef } from "react";
import { marketingAssetUrl } from "@/lib/marketing-assets";

export default function ShowreelVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden && !reducedMotion.matches)
        void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
    };
  }, []);
  return (
    <div
      className="flex h-52 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white py-4 sm:h-72 sm:py-6 md:h-80"
      style={{ aspectRatio: "45 / 32" }}
    >
      <video
        ref={videoRef}
        className="h-full w-auto max-w-full object-contain"
        style={{ aspectRatio: "480 / 1044" }}
        src={marketingAssetUrl("hero-projects/go-gym-reel.mp4")}
        poster={marketingAssetUrl("hero-projects/go-gym-poster.webp")}
        aria-label="Go Gym product and onboarding showreel"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
      />
    </div>
  );
}
