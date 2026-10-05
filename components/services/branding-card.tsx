"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { marketingAssetUrl } from "@/lib/marketing-assets";

type HoveredIndex = 0 | 1 | 2 | null;

const SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 18,
  mass: 0.75,
  bounce: 0.5,
};

function isActive(hovered: HoveredIndex, i: 0 | 1 | 2) {
  return hovered === i;
}

function isInactive(hovered: HoveredIndex, i: 0 | 1 | 2) {
  return hovered !== null && hovered !== i;
}

export function BrandingCard() {
  const [cardHovered, setCardHovered] = useState<HoveredIndex>(null);
  return (
    <div
      style={{
        backgroundImage: `url('${marketingAssetUrl("gradients/mesh3.webp")}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="relative mx-auto flex h-[380px] w-full max-w-[calc(100vw-2rem)] flex-col rounded-2xl bg-white/70 inset-shadow-sm inset-shadow-black sm:h-[400px] sm:max-w-[400px]"
    >
      <div className="relative flex flex-1 flex-col">
        <div className="relative h-full rotate-0">
          <div
            className="absolute inset-0"
            onMouseLeave={() => setCardHovered(null)}
          >
            <motion.div
              onMouseEnter={() => setCardHovered(0)}
              animate={{
                x: isActive(cardHovered, 0)
                  ? 10
                  : isInactive(cardHovered, 0)
                    ? -8
                    : 0,
                y: isActive(cardHovered, 0)
                  ? -50
                  : isInactive(cardHovered, 0)
                    ? 10
                    : 0,
                scale: isActive(cardHovered, 0)
                  ? 1.18
                  : isInactive(cardHovered, 0)
                    ? 0.96
                    : 1,
                rotate: isActive(cardHovered, 0)
                  ? -5
                  : isInactive(cardHovered, 0)
                    ? -22
                    : -15,
                opacity: isInactive(cardHovered, 0) ? 0.85 : 1,
                zIndex: isActive(cardHovered, 0)
                  ? 30
                  : isInactive(cardHovered, 0)
                    ? 10
                    : 20,
              }}
              transition={SPRING}
              className={cn(
                "absolute top-[44px] left-[16px] h-[190px] w-[190px] overflow-hidden rounded-none shadow-[0_28px_50px_-28px_rgba(0,0,0,0.65)] will-change-transform sm:top-[40px] sm:left-[35px] sm:h-[200px] sm:w-[200px]",
              )}
            >
              <Image
                src={marketingAssetUrl("Hanabi-branding/Desktop - 144.png")}
                alt="Ballarat Box Sports"
                width={1024}
                height={768}
                sizes="200px"
                quality={82}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              onMouseEnter={() => setCardHovered(1)}
              animate={{
                x: isActive(cardHovered, 1)
                  ? -30
                  : cardHovered === 0
                    ? 20
                    : cardHovered === 2
                      ? -55
                      : -15,
                y: isActive(cardHovered, 1)
                  ? -44
                  : isInactive(cardHovered, 1)
                    ? 12
                    : 0,
                scale: isActive(cardHovered, 1)
                  ? 1.2
                  : isInactive(cardHovered, 1)
                    ? 0.96
                    : 1,
                rotate: isActive(cardHovered, 1)
                  ? 0
                  : cardHovered === 0
                    ? 2
                    : cardHovered === 2
                      ? -10
                      : -2,
                opacity: isInactive(cardHovered, 1) ? 0.85 : 1,
                zIndex: isActive(cardHovered, 1)
                  ? 30
                  : isInactive(cardHovered, 1)
                    ? 10
                    : 20,
              }}
              transition={SPRING}
              className="absolute top-[40px] left-[92px] h-[190px] w-[190px] overflow-hidden rounded-none shadow-[0_26px_46px_-28px_rgba(0,0,0,0.7)] will-change-transform sm:top-[35px] sm:left-[106px] sm:h-[200px] sm:w-[200px]"
            >
              <Image
                src={marketingAssetUrl("Hanabi-branding/Desktop - 113.png")}
                alt="Nectar"
                width={1024}
                height={768}
                sizes="200px"
                quality={82}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              onMouseEnter={() => setCardHovered(2)}
              animate={{
                x: isActive(cardHovered, 2)
                  ? -34
                  : isInactive(cardHovered, 2)
                    ? 12
                    : 0,
                y: isActive(cardHovered, 2)
                  ? -55
                  : isInactive(cardHovered, 2)
                    ? 10
                    : -10,
                scale: isActive(cardHovered, 2)
                  ? 1.18
                  : isInactive(cardHovered, 2)
                    ? 0.96
                    : 1,
                rotate: isActive(cardHovered, 2)
                  ? 5
                  : isInactive(cardHovered, 2)
                    ? 16
                    : 12,
                opacity: isInactive(cardHovered, 2) ? 0.85 : 1,
                zIndex: isActive(cardHovered, 2)
                  ? 30
                  : isInactive(cardHovered, 2)
                    ? 10
                    : 20,
              }}
              transition={SPRING}
              className="absolute top-[56px] right-[14px] h-[190px] w-[190px] overflow-hidden rounded-none shadow-[0_28px_50px_-28px_rgba(0,0,0,0.65)] sm:top-[50px] sm:right-[30px] sm:h-[200px] sm:w-[200px]"
            >
              <Image
                src={marketingAssetUrl("Hanabi-branding/Hanabi 6.png")}
                alt="Hibari"
                width={1024}
                height={768}
                sizes="200px"
                quality={82}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-20">
            <div className="px-5">
              <div className="relative z-10 flex items-center gap-2 pb-0.5">
                <div className="rounded-full bg-emerald-950/55 px-3 py-1 text-xs font-medium text-white shadow-sm inset-shadow-2xs inset-shadow-white/10 backdrop-blur-sm text-shadow-2xs sm:px-4 sm:text-sm">
                  Logo & Brand Identity
                </div>
                <div className="rounded-full bg-emerald-950/55 px-3 py-1 text-xs font-medium text-white shadow-sm inset-shadow-2xs inset-shadow-white/10 backdrop-blur-sm text-shadow-2xs sm:px-4 sm:text-sm">
                  Brand Strategy
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-5 pt-2 sm:pt-4">
              <h4 className="text-2xl font-medium text-black">Branding</h4>
              <p className="text-black/90">
                We shape memorable brand systems with the clarity, tone, and
                visuals your audience can trust.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
