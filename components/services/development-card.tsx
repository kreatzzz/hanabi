"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { marketingAssetUrl } from "@/lib/marketing-assets";

const ORBIT_RADIUS = 100;
const CIRCLE_SIZE = 40;
const CIRCLE_COUNT = 12;

type ThemeOptions = {
  dark: string;
  light: string;
};

type SvglSvg = {
  id: number;
  title: string;
  category: string | string[];
  route: string | ThemeOptions;
  url: string;
  wordmark?: string | ThemeOptions;
  brandUrl?: string;
};

function resolveSvglRoute(route: SvglSvg["route"]): string {
  if (typeof route === "string") return route;
  // This card uses a light surface, so prefer the "light" asset.
  return route.light ?? route.dark;
}

type OrbitLogo = {
  label: string;
  candidates: Array<SvglSvg["title"]>;
};

const ORBIT_LOGOS: OrbitLogo[] = [
  { label: "Next.js", candidates: ["Next.js", "NextJS", "nextjs"] },
  { label: "React", candidates: ["React"] },
  { label: "Node.js", candidates: ["Node.js", "NodeJS", "Node"] },
  { label: "Bun", candidates: ["Bun", "Bun.sh"] },
  { label: "Tailwind", candidates: ["Tailwind CSS", "Tailwind"] },
  { label: "Motion", candidates: ["Motion", "Framer Motion", "Framer"] },
  { label: "TypeScript", candidates: ["TypeScript", "Typescript"] },
  { label: "Express", candidates: ["Express", "Express.js", "ExpressJS"] },
  { label: "Prisma", candidates: ["Prisma"] },
  { label: "Vercel", candidates: ["Vercel"] },
  { label: "PostgreSQL", candidates: ["PostgreSQL", "Postgres"] },
  { label: "Zod", candidates: ["Zod"] },
];

function ChakraOrbit() {
  const [mounted, setMounted] = useState(false);
  const [logoRoutes, setLogoRoutes] = useState<Record<string, string>>({});
  const orbitRotate = useMotionValue(0);
  const iconRotate = useTransform(orbitRotate, (v) => -v);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const controls = animate(orbitRotate, 360, {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    });
    return () => controls.stop();
  }, [mounted, orbitRotate]);

  useEffect(() => {
    if (!mounted) return;

    const controller = new AbortController();

    async function loadSvgl() {
      try {
        const res = await fetch("https://api.svgl.app", {
          signal: controller.signal,
          headers: { accept: "application/json" },
        });
        if (!res.ok) return;

        const all = (await res.json()) as SvglSvg[];
        const byTitle = new Map(all.map((s) => [s.title.toLowerCase(), s]));

        const routes: Record<string, string> = {};
        for (const logo of ORBIT_LOGOS) {
          const hit = logo.candidates
            .map((t) => byTitle.get(t.toLowerCase()))
            .find(Boolean);
          if (hit) routes[logo.label] = resolveSvglRoute(hit.route);
        }
        setLogoRoutes(routes);
      } catch {
        // If SVGL is rate-limited/unavailable, we just render the orbit circles.
      }
    }

    void loadSvgl();
    return () => controller.abort();
  }, [mounted]);

  if (!mounted) return null;

  const orbitItems = ORBIT_LOGOS.slice(0, CIRCLE_COUNT);

  return (
    <div
      className="pointer-events-none absolute -top-10 left-1/2"
      style={{ transform: "translateX(-50%)" }}
    >
      <motion.div
        style={{
          rotate: orbitRotate,
          width: 0,
          height: 0,
          position: "relative",
        }}
      >
        {orbitItems.map((logo, i) => {
          const angle = (2 * Math.PI * i) / CIRCLE_COUNT;
          const x = ORBIT_RADIUS * Math.cos(angle);
          const y = ORBIT_RADIUS * Math.sin(angle);
          const src = logoRoutes[logo.label];
          return (
            <div
              key={logo.label}
              className="absolute grid place-items-center rounded-full bg-white/35 shadow-sm inset-shadow-2xs inset-shadow-white/40"
              style={{
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                left: x - CIRCLE_SIZE / 2,
                top: y - CIRCLE_SIZE / 2,
              }}
            >
              {src ? (
                <motion.div
                  // Counter-rotate from the same motion value to avoid drift.
                  style={{ rotate: iconRotate, willChange: "transform" }}
                >
                  <img
                    src={src}
                    alt={logo.label}
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] opacity-95"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </motion.div>
              ) : null}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export function DevelopmentCard() {
  return (
    <div
      style={{
        backgroundImage: `url('${marketingAssetUrl("gradients/mesh1.webp")}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative mx-auto flex h-[380px] w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl inset-shadow-sm inset-shadow-orange-600 sm:h-[400px] sm:max-w-[400px]"
    >
      <ChakraOrbit />
      <div className="flex-1">
        <Image
          src="/logo-dark.png"
          alt="Hanabi Logo"
          width={100}
          height={100}
          sizes="100px"
          quality={82}
          loading="lazy"
          className="absolute inset-x-0 top-1/4 m-auto"
        />
      </div>
      <div className="w-full px-5">
        <div className="flex items-center justify-start gap-1.5 pb-0.5">
          <div className="rounded-full bg-emerald-950/55 px-3 py-1 text-xs font-medium text-white shadow-sm inset-shadow-2xs inset-shadow-white/10 backdrop-blur-sm text-shadow-2xs sm:px-4 sm:text-sm">
            Automation
          </div>
          <div className="rounded-full bg-emerald-950/55 px-3 py-1 text-xs font-medium text-white shadow-sm inset-shadow-2xs inset-shadow-white/10 backdrop-blur-sm text-shadow-2xs sm:px-4 sm:text-sm">
            Web & App
          </div>
          <div className="rounded-full bg-emerald-950/55 px-3 py-1 text-xs font-medium text-white shadow-sm inset-shadow-2xs inset-shadow-white/10 backdrop-blur-sm text-shadow-2xs sm:px-4 sm:text-sm">
            MVP
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 p-5 pt-2 sm:pt-4">
        <h4 className="text-2xl font-medium">Development</h4>
        <p>
          We craft beautiful, intuitive interfaces for digital platforms, that
          are easy to launch, scale, maintain.
        </p>
      </div>
    </div>
  );
}
