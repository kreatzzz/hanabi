"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/reveal";
import RevealImage from "@/components/reveal-image";
import { marketingAssetUrl } from "@/lib/marketing-assets";

type WhyUsItem = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  icon: "code" | "quality" | "flexible" | "speed" | "communication";
  iconClassName: string;
  variant: "top" | "bottom";
};

const WHY_US_ITEMS: WhyUsItem[] = [
  {
    title: "Quality",
    description: "Every detail is reviewed with care before it reaches users.",
    image: {
      src: marketingAssetUrl("whyus/quality.png"),
      alt: "Quality gradient with shield icon",
    },
    icon: "quality",
    iconClassName: "text-[#22C55E]/70",
    variant: "top",
  },
  {
    title: "Clean Code",
    description: "Readable, modular builds that stay easy to improve.",
    image: {
      src: marketingAssetUrl("whyus/code.png"),
      alt: "Clean code gradient with code icon",
    },
    icon: "code",
    iconClassName: "text-[#FF3D00]/70",
    variant: "top",
  },
  {
    title: "Flexible",
    description: "A process that adapts as your priorities become clearer.",
    image: {
      src: marketingAssetUrl("whyus/flexible.png"),
      alt: "Flexible gradient with swirl icon",
    },
    icon: "flexible",
    iconClassName: "text-[#F59E0B]/70",
    variant: "bottom",
  },
  {
    title: "Speed",
    description: "Focused execution that keeps momentum without cutting care.",
    image: {
      src: marketingAssetUrl("whyus/speed.png"),
      alt: "Speed gradient with sprout icon",
    },
    icon: "speed",
    iconClassName: "text-[#34D399]/70",
    variant: "bottom",
  },
  {
    title: "Communication",
    description: "Clear updates, honest timelines, and fewer surprises.",
    image: {
      src: marketingAssetUrl("whyus/communication.png"),
      alt: "Communication gradient with waveform icon",
    },
    icon: "communication",
    iconClassName: "text-[#EF4444]/70",
    variant: "bottom",
  },
];

const CODE_BRACKET_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 34,
  mass: 0.35,
};

const ICON_CARD_VARIANTS = {
  rest: {},
  hover: {},
} as const;

type SpringTransition = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
};

const ROCKET_FLAME_PATH =
  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09";

function WhyUsIcon({
  name,
  className,
}: {
  name: WhyUsItem["icon"];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  // Stroke-only icons to keep gradients visible beneath.
  const common = {
    className: `h-14 w-14 md:h-16 md:w-16 ${className ?? ""}`.trim(),
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const softSpring: SpringTransition | { duration: 0 } = reduceMotion
    ? { duration: 0 }
    : {
        type: "spring",
        stiffness: 460,
        damping: 30,
        mass: 0.35,
      };

  switch (name) {
    case "code": {
      const bracketTransition = reduceMotion
        ? { duration: 0 }
        : CODE_BRACKET_SPRING;

      return (
        <motion.svg {...common}>
          <motion.path
            variants={{
              rest: { x: 0, opacity: 0.75 },
              hover: { x: -1, opacity: 1 },
            }}
            transition={bracketTransition}
            d="m18 16 4-4-4-4"
          />
          <motion.path
            variants={{
              rest: { x: 0, opacity: 0.75 },
              hover: { x: 1, opacity: 1 },
            }}
            transition={{
              ...bracketTransition,
              delay: reduceMotion ? 0 : 0.05,
            }}
            d="m6 8-4 4 4 4"
          />
          <path d="m14.5 4-5 16" />
        </motion.svg>
      );
    }
    case "quality":
      return (
        <motion.svg {...common}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <motion.path
            variants={{
              rest: {
                pathLength: 1,
                opacity: 0.85,
              },
              hover: {
                pathLength: [0, 1],
                opacity: [0.35, 1],
              },
            }}
            transition={{
              ...(reduceMotion ? { duration: 0 } : {}),
              opacity: reduceMotion ? { duration: 0 } : { duration: 0.35 },
              pathLength: reduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.55,
                    ease: [0.4, 0, 0.2, 1],
                  },
            }}
            d="m9 12 2 2 4-4"
          />
        </motion.svg>
      );
    case "flexible":
      return (
        <motion.svg {...common}>
          <motion.circle
            cx="6"
            cy="19"
            r="3"
            variants={{
              rest: { x: 0, y: 0, opacity: 0.85 },
              hover: { x: -1, y: -1, opacity: 1 },
            }}
            transition={reduceMotion ? { duration: 0 } : softSpring}
          />
          <motion.path
            variants={{
              rest: {
                pathLength: 1,
                opacity: 0.85,
              },
              hover: {
                pathLength: [0.2, 1],
                opacity: [0.45, 1],
              },
            }}
            transition={{
              ...(reduceMotion ? { duration: 0 } : {}),
              opacity: reduceMotion ? { duration: 0 } : { duration: 0.35 },
              pathLength: reduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.65,
                    ease: [0.4, 0, 0.2, 1],
                  },
            }}
            d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"
          />
          <motion.circle
            cx="18"
            cy="5"
            r="3"
            variants={{
              rest: { x: 0, y: 0, opacity: 0.85 },
              hover: { x: 1, y: 1, opacity: 1 },
            }}
            transition={{
              ...(reduceMotion ? { duration: 0 } : softSpring),
              delay: reduceMotion ? 0 : 0.03,
            }}
          />
        </motion.svg>
      );
    case "speed":
      return (
        <motion.svg {...common}>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          {reduceMotion ? (
            <path d={ROCKET_FLAME_PATH} />
          ) : (
            <>
              {/* Flame A: bursts out + fades (stays gone while hovered) */}
              <motion.path
                variants={{
                  rest: { x: 0, y: 0, opacity: 0.85 },
                  hover: {
                    x: [0, -3, -3],
                    y: [0, 4, 4],
                    opacity: [0.85, 0, 0],
                    transition: {
                      duration: 1.1,
                      ease: "easeInOut",
                      times: [0, 0.55, 1],
                    },
                  },
                }}
                d={ROCKET_FLAME_PATH}
              />

              {/* Flame B: replaces A by traveling from the nozzle back into place */}
              <motion.path
                variants={{
                  rest: { x: 0, y: 0, opacity: 0 },
                  hover: {
                    x: [0, 0, 3, 0],
                    y: [0, 0, -4, 0],
                    opacity: [0, 0, 0, 0.85],
                    transition: {
                      duration: 1,
                      ease: "easeInOut",
                      times: [0, 0.5, 0.52, 1],
                    },
                  },
                }}
                d={ROCKET_FLAME_PATH}
              />
            </>
          )}
          <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" />
        </motion.svg>
      );
    case "communication":
      return (
        <motion.svg {...common}>
          <motion.path
            variants={{
              rest: {
                pathLength: 1,
                opacity: 0.75,
                y: 0,
              },
              hover: {
                pathLength: [0.15, 1],
                opacity: [0.45, 1],
                y: [-1, 0],
              },
            }}
            transition={{
              ...(reduceMotion ? { duration: 0 } : {}),
              opacity: reduceMotion ? { duration: 0 } : { duration: 0.45 },
              pathLength: reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1,
                    ease: [0.4, 0, 0.2, 1],
                  },
              y: reduceMotion ? { duration: 0 } : { duration: 0.55 },
            }}
            d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"
          />
        </motion.svg>
      );
    default:
      return null;
  }
}

function WhyUsTopCard({ item }: { item: WhyUsItem }) {
  const isQuality = item.icon === "quality";
  const reduceMotion = useReducedMotion();

  const card = (
    <div
      className={[
        "w-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]",
        // Keep padding consistent with bottom cards.
        "p-3.5",
      ].join(" ")}
    >
      {isQuality ? (
        <div className="px-2 pb-4">
          <div className="font-inter text-lg leading-tight font-semibold tracking-[-0.01em]">
            {item.title}
          </div>
          <div className="pt-0.5 font-mono text-sm leading-snug font-medium text-[#6C6C6C]">
            {item.description}
          </div>
        </div>
      ) : null}

      <div
        className={["relative h-44 w-full overflow-hidden", "rounded-xl"].join(
          " ",
        )}
      >
        <RevealImage
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          className="object-cover"
          wrapperClassName="absolute inset-0"
        />
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center"
          aria-hidden
        >
          <div className="opacity-80">
            <WhyUsIcon name={item.icon} className={item.iconClassName} />
          </div>
        </div>
      </div>
      {!isQuality ? (
        <div className="px-2 pt-4">
          <div className="font-inter text-lg leading-tight font-semibold tracking-[-0.01em]">
            {item.title}
          </div>
          <div className="pt-0.5 font-mono text-sm leading-snug font-medium text-[#6C6C6C]">
            {item.description}
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <motion.div
      className="flex w-full flex-col"
      variants={ICON_CARD_VARIANTS}
      initial="rest"
      whileHover={reduceMotion ? undefined : "hover"}
    >
      {card}
    </motion.div>
  );
}

function WhyUsBottomCard({ item }: { item: WhyUsItem }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex w-full flex-col"
      variants={ICON_CARD_VARIANTS}
      initial="rest"
      whileHover={reduceMotion ? undefined : "hover"}
    >
      <div className="w-full overflow-hidden rounded-2xl border border-black/5 bg-white p-3.5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="relative h-44 w-full overflow-hidden rounded-xl">
          <RevealImage
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            className="object-cover"
            wrapperClassName="absolute inset-0"
          />
          <div
            className="pointer-events-none absolute inset-0 grid place-items-center"
            aria-hidden
          >
            <div className="opacity-80">
              <WhyUsIcon name={item.icon} className={item.iconClassName} />
            </div>
          </div>
        </div>

        {/* Mobile: keep text inside the card */}
        <div className="px-2 pt-4 md:hidden">
          <div className="font-inter text-lg leading-tight font-semibold tracking-[-0.01em]">
            {item.title}
          </div>
          <div className="pt-0.5 font-mono text-sm leading-snug font-medium text-[#6C6C6C]">
            {item.description}
          </div>
        </div>
      </div>

      {/* Desktop: keep text below */}
      <div className="hidden px-2 pt-4 md:block">
        <div className="font-inter text-lg leading-tight font-semibold tracking-[-0.01em]">
          {item.title}
        </div>
        <div className="pt-0.5 font-mono text-sm leading-snug font-medium text-[#6C6C6C]">
          {item.description}
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyUsCards() {
  const top = WHY_US_ITEMS.filter((i) => i.variant === "top");
  const bottom = WHY_US_ITEMS.filter((i) => i.variant === "bottom");

  return (
    <div className="w-full max-w-6xl pt-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {top.map((item, idx) => {
          const isQuality = item.icon === "quality";
          const orderClass = isQuality
            ? "order-1 md:order-2"
            : "order-2 md:order-1";

          return (
            <Reveal
              key={item.title}
              delay={Math.min(0.05 * idx, 0.12)}
              className={orderClass}
            >
              <WhyUsTopCard item={item} />
            </Reveal>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {bottom.map((item, idx) => (
          <Reveal key={item.title} delay={Math.min(0.05 * idx, 0.12)}>
            <WhyUsBottomCard item={item} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
