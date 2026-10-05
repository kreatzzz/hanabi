"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import {
  SeamlessMarquee,
  useSeamlessMarqueeDuplicate,
} from "@/components/seamless-marquee";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Client = {
  name: string;
  logo: {
    src: string;
    width: number;
    height: number;
    monoClass?: string;
    imageClass?: string;
    /** White source artwork is rendered as a mask so it can reveal its brand color. */
    treatment?: "mask";
  };
  glow: string;
  testimonial: string;
  person: string;
  role: string;
};

// Add a client here to include it in both the marquee and its hover testimonial.
const CLIENTS: Client[] = [
  {
    name: "Thomas Bewick",
    logo: {
      src: "/client-logos/thomas-bewick.webp",
      width: 128,
      height: 98,
      monoClass: "opacity-65 brightness-0 grayscale",
    },
    glow: "rgba(133, 62, 30, 0.18)",
    testimonial: "Would recommend",
    person: "Mustafa",
    role: "Thomas Bewick",
  },
  {
    name: "Down the Cove",
    logo: {
      src: "/client-logos/down-the-cove.png",
      width: 801,
      height: 439,
      treatment: "mask",
    },
    glow: "rgba(0, 86, 178, 0.18)",
    testimonial:
      "We worked with Shreyan and his team on the full restructure, migration and redesign of Down The Cove, moving from our old WooCommerce website to a much more modern ecommerce setup. From the start, they were really responsive and easy to work with, keeping us updated throughout and explaining what was happening. They shared their technical knowledge clearly, including staging, DNS, deployment and integrations, so we understood the process. The new site is a big improvement: cleaner, more professional and smoother across mobile and desktop. They were always there to help when issues came up and we felt supported throughout. They were reliable, knowledgeable and we would happily recommend them for an ecommerce migration or redesign.",
    person: "Behzad",
    role: "Down the Cove",
  },
  {
    name: "CompOps",
    logo: {
      src: "/client-logos/compops.png",
      width: 900,
      height: 756,
      monoClass: "opacity-45 brightness-0 grayscale",
    },
    glow: "rgba(238, 50, 72, 0.17)",
    testimonial:
      "I've been working with Krish for about six months now, and he's easily one of the best collaborators I've had on the design side. Quick to grasp what I'm building, sharp instincts on the details, and the kind of person who pushes back when something can be better instead of just shipping what I asked for. The work consistently lands above what I expected. If you're considering Krish, you should hire him.",
    person: "Brock Shelton",
    role: "CompOps",
  },
  {
    name: "Ballarat Box Sports",
    logo: {
      src: "/client-logos/ballarat-box-sports.png",
      width: 575,
      height: 800,
      monoClass: "opacity-80 grayscale invert",
    },
    glow: "rgba(54, 198, 120, 0.18)",
    testimonial:
      "They were really good with the work and delivered much before the deadline. It was nice working with them",
    person: "Jasman",
    role: "Ballarat Box Sports",
  },
  {
    name: "2X Sales",
    logo: {
      src: "/client-logos/2x-sales.png",
      width: 664,
      height: 144,
      monoClass: "opacity-45 brightness-0 grayscale",
    },
    glow: "rgba(0, 86, 178, 0.18)",
    testimonial:
      "AI will replace all aspects of IT jobs. Except reliability, due to its nature, it will always have a probability to fail. That’s where Shreyan differs. I can talk about all the sleepless nights he had for a dream we built or all the “impossible” problems he solved. But that’s mundane, AI will do most of that stuff if it isn’t doing already.\n\nOn the other hand, if you don’t have the technical capabilities to build a Shreyan bot which I would estimate not many people do, Shreyan comes in handy there as well. Basically, he is the unbreakable link you can have with tech, always countable and always on his stuff.",
    person: "Teoman",
    role: "2X Sales",
  },
  {
    name: "Stealth",
    logo: {
      src: "/client-logos/stealth.png",
      width: 798,
      height: 798,
      monoClass: "opacity-80 brightness-75 contrast-30 grayscale",
    },
    glow: "rgba(87, 93, 110, 0.2)",
    testimonial:
      "Shreyan genuinely cares about doing good work, and it shows. Definitely recommend!",
    person: "Anonymous",
    role: "Stealth",
  },
  {
    name: "Go Gym",
    logo: {
      src: "/client-logos/go-gym.svg",
      width: 724,
      height: 405,
      monoClass: "opacity-45 brightness-0 grayscale",
    },
    glow: "rgba(190, 255, 0, 0.2)",
    testimonial:
      "I had the team do a full audit of my startup before going to testing and they did a great in-depth review. It’s clear they understood the code and the best practices, and it really helped make my product much stronger before launch. Hope to work with them again in the future.",
    person: "Tomo",
    role: "Go Gym",
  },
];

function ClientLogo({ client }: { client: Client }) {
  if (client.logo.treatment === "mask") {
    return (
      <span className="relative z-10 h-14 w-full max-w-[10rem] sm:h-16">
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[#0056B2] opacity-0 transition-[opacity,scale] duration-200 ease-out group-hover:scale-105 group-hover:opacity-100 group-focus-visible:scale-105 group-focus-visible:opacity-100"
          style={{
            mask: `url(${client.logo.src}) center / contain no-repeat`,
            WebkitMask: `url(${client.logo.src}) center / contain no-repeat`,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-black/45 transition-opacity duration-200 ease-out group-hover:opacity-0 group-focus-visible:opacity-0"
          style={{
            mask: `url(${client.logo.src}) center / contain no-repeat`,
            WebkitMask: `url(${client.logo.src}) center / contain no-repeat`,
          }}
        />
      </span>
    );
  }

  return (
    <span className="relative z-10 h-14 w-full max-w-[10rem] sm:h-16">
      <Image
        src={client.logo.src}
        alt={client.name}
        width={client.logo.width}
        height={client.logo.height}
        sizes="200px"
        className={`absolute inset-0 h-full w-full object-contain opacity-0 transition-[opacity,scale] duration-200 ease-out group-hover:scale-105 group-hover:opacity-100 group-focus-visible:scale-105 group-focus-visible:opacity-100 ${client.logo.imageClass ?? ""}`}
      />
      <Image
        src={client.logo.src}
        alt=""
        aria-hidden="true"
        width={client.logo.width}
        height={client.logo.height}
        sizes="200px"
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ease-out group-hover:opacity-0 group-focus-visible:opacity-0 ${client.logo.monoClass} ${client.logo.imageClass ?? ""}`}
      />
    </span>
  );
}

const TESTIMONIAL_PREVIEW_LENGTH = 240;

function getTestimonialPreview(testimonial: string) {
  if (testimonial.length <= TESTIMONIAL_PREVIEW_LENGTH) {
    return testimonial;
  }

  const boundary = testimonial.lastIndexOf(" ", TESTIMONIAL_PREVIEW_LENGTH);
  const splitAt = boundary > 0 ? boundary : TESTIMONIAL_PREVIEW_LENGTH;

  return testimonial.slice(0, splitAt).trimEnd();
}

function TestimonialCopy({
  testimonial,
  expanded,
  onExpandedChange,
}: {
  testimonial: string;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) {
  const preview = getTestimonialPreview(testimonial);
  const hasMore = preview.length < testimonial.length;
  const contentId = useId();

  if (!hasMore) {
    return (
      <p className="text-sm leading-relaxed font-medium tracking-[-0.02em] whitespace-pre-line text-[#252525]">
        {testimonial}
      </p>
    );
  }

  if (!expanded) {
    return (
      <p className="text-sm leading-relaxed font-medium tracking-[-0.02em] text-[#252525]">
        <span>{preview}</span>
        <span aria-hidden="true">… </span>
        <button
          type="button"
          className="font-medium text-[#555] transition-colors duration-150 ease-out hover:text-black focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40 motion-reduce:transition-none"
          aria-expanded={false}
          aria-controls={contentId}
          onClick={() => onExpandedChange(true)}
        >
          More
        </button>
      </p>
    );
  }

  return (
    <p
      id={contentId}
      className="text-sm leading-relaxed font-medium tracking-[-0.02em] whitespace-pre-line text-[#252525] opacity-100 transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:translate-y-0 motion-reduce:transition-none starting:translate-y-0.5 starting:opacity-0"
    >
      {testimonial}
    </p>
  );
}

function MarqueeClient({ client }: { client: Client }) {
  const isDuplicate = useSeamlessMarqueeDuplicate();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const touchInteractionRef = useRef({ isTouch: false, wasOpen: false });

  useEffect(() => {
    if (!open) {
      return;
    }

    const dismissOnScroll = () => {
      setOpen(false);
      setExpanded(false);
    };

    window.addEventListener("scroll", dismissOnScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("wheel", dismissOnScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchmove", dismissOnScroll, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", dismissOnScroll, true);
      window.removeEventListener("wheel", dismissOnScroll, true);
      window.removeEventListener("touchmove", dismissOnScroll, true);
    };
  }, [open]);

  return (
    <Tooltip
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen && expanded && details.reason === "trigger-hover") {
          return;
        }

        setOpen(nextOpen);

        if (!nextOpen) {
          setExpanded(false);
        }
      }}
    >
      <TooltipTrigger
        className="group relative isolate flex h-28 w-48 shrink-0 cursor-default items-center justify-center px-5 outline-none focus-visible:ring-2 focus-visible:ring-black/15 sm:h-30 sm:w-56"
        tabIndex={isDuplicate ? -1 : undefined}
        aria-label={`Read ${client.name} testimonial`}
        closeOnClick={false}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") {
            touchInteractionRef.current = { isTouch: true, wasOpen: open };
          } else {
            touchInteractionRef.current.isTouch = false;
          }
        }}
        onClick={() => {
          if (!touchInteractionRef.current.isTouch) {
            return;
          }

          const nextOpen = !touchInteractionRef.current.wasOpen;
          touchInteractionRef.current.isTouch = false;
          setOpen(nextOpen);

          if (!nextOpen) {
            setExpanded(false);
          }
        }}
      >
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 h-20 w-44 -translate-x-1/2 -translate-y-1/2 scale-50 rounded-[50%] opacity-0 transition-[opacity,scale] duration-500 ease-out group-hover:scale-100 group-hover:opacity-70 group-focus-visible:scale-100 group-focus-visible:opacity-70"
          style={{
            background: `radial-gradient(ellipse at center, ${client.glow} 0%, transparent 72%)`,
          }}
          aria-hidden="true"
        />
        <ClientLogo client={client} />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={12}
        collisionAvoidance={{
          side: "shift",
          align: "shift",
          fallbackAxisSide: "none",
        }}
        showArrow={false}
        className="max-h-[min(36rem,calc(100vh-2rem))] w-[min(32rem,calc(100vw-2rem))] max-w-none origin-[var(--transform-origin)] overflow-y-auto overscroll-contain rounded-xl border-black/10 bg-white p-5 text-left shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.95)_inset] data-[ending-style]:scale-[0.86] data-[ending-style]:opacity-0 data-[ending-style]:duration-[320ms] data-[ending-style]:ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:data-[ending-style]:scale-100 motion-reduce:data-[ending-style]:duration-0"
      >
        <TestimonialCopy
          testimonial={client.testimonial}
          expanded={expanded}
          onExpandedChange={(nextExpanded) => {
            setExpanded(nextExpanded);
            setOpen(true);
          }}
        />
        <div className="mt-3 border-t border-black/8 pt-2.5">
          <p className="text-sm font-medium text-black">{client.person}</p>
          <p className="mt-0.5 text-xs font-medium text-[#777]">
            {client.role}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function TrustedBy() {
  return (
    <section
      aria-labelledby="trusted-by-heading"
      className="relative overflow-hidden bg-[#F6F6F6] pt-4 pb-16 sm:pt-6 sm:pb-20"
    >
      <div className="mx-auto flex max-w-[1248px] flex-col items-center px-5 text-center">
        <p className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
          Testimonials
        </p>
        <h2
          id="trusted-by-heading"
          className="mt-2 max-w-xl text-center text-2xl leading-[1.1] font-medium tracking-[-0.04em] text-balance sm:text-3xl"
        >
          Trusted by people building with intent.
        </h2>
      </div>

      <TooltipProvider delay={80} closeDelay={80}>
        <div className="relative mt-7 py-2 sm:mt-9">
          <span
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#F6F6F6] to-transparent sm:w-24"
            aria-hidden="true"
          />
          <SeamlessMarquee speed={28} className="py-2" pauseOnHover>
            <div className="flex shrink-0 items-center gap-5 pr-5 sm:gap-8 sm:pr-8">
              {CLIENTS.map((client) => (
                <MarqueeClient key={client.name} client={client} />
              ))}
            </div>
          </SeamlessMarquee>
          <span
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-[#F6F6F6] to-transparent sm:w-24"
            aria-hidden="true"
          />
        </div>
      </TooltipProvider>
    </section>
  );
}
