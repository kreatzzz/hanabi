"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef } from "react";

const SeamlessMarqueeDuplicateContext = createContext(false);

/** Whether the current child is rendered in the visual duplicate copy. */
export function useSeamlessMarqueeDuplicate() {
  return useContext(SeamlessMarqueeDuplicateContext);
}

type SeamlessMarqueeProps = {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  speed?: number;
};

export function SeamlessMarquee({
  children,
  className = "",
  direction = "left",
  pauseOnHover = true,
  speed = 64,
}: SeamlessMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef(0);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;

    if (!track || !group) {
      return;
    }

    let frameId = 0;
    let lastTime = 0;

    const measure = () => {
      const nextDistance = group.getBoundingClientRect().width;

      if (nextDistance <= 0) {
        return;
      }

      distanceRef.current = nextDistance;
      offsetRef.current %= nextDistance;
    };

    const observer = new ResizeObserver(measure);
    observer.observe(group);
    measure();

    const tick = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
      }

      const elapsed = (time - lastTime) / 1000;
      lastTime = time;

      const distance = distanceRef.current;

      if (distance > 0 && !pausedRef.current) {
        offsetRef.current = (offsetRef.current + elapsed * speed) % distance;

        const offset =
          direction === "left"
            ? -offsetRef.current
            : offsetRef.current - distance;

        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      frameId = requestAnimationFrame(tick);
    };

    // Only run the animation loop while the marquee is actually on screen and
    // the tab is visible — otherwise it burns main-thread + compositor work
    // every frame animating something nobody can see.
    let onScreen = true;
    let tabVisible = true;

    const start = () => {
      if (frameId !== 0) return;
      lastTime = 0; // reset so resuming doesn't jump by the paused duration
      frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frameId === 0) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const sync = () => {
      if (onScreen && tabVisible) start();
      else stop();
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "200px" },
    );
    visibility.observe(track);

    const handleVisibilityChange = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    sync();

    return () => {
      stop();
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [direction, speed]);

  return (
    <div
      className={`overflow-hidden ${className}`}
      onPointerEnter={() => {
        if (pauseOnHover) {
          pausedRef.current = true;
        }
      }}
      onPointerLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <SeamlessMarqueeDuplicateContext.Provider value={false}>
          <div ref={groupRef} className="flex shrink-0">
            {children}
          </div>
        </SeamlessMarqueeDuplicateContext.Provider>
        <SeamlessMarqueeDuplicateContext.Provider value={true}>
          <div className="flex shrink-0" aria-hidden="true">
            {children}
          </div>
        </SeamlessMarqueeDuplicateContext.Provider>
      </div>
    </div>
  );
}
