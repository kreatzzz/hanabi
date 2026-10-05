import type { CSSProperties } from "react";
import FooterLiquidGlassButton from "@/components/footer-liquid-glass-button";
import TransitionFireworksCanvas from "@/components/transition-fireworks-canvas";
import Image from "next/image";
import Link from "next/link";
import { Sawarabi_Gothic } from "next/font/google";
import { EMAIL, INSTAGRAM, LINKEDIN, TELEGRAM } from "@/lib/constants";
import { siInstagram, siTelegram, type SimpleIcon } from "simple-icons";
import { marketingAssetUrl } from "@/lib/marketing-assets";

const sawarabiGothic = Sawarabi_Gothic({
  weight: "400",
  subsets: ["latin"],
});

const FOOTER_IMAGE = marketingAssetUrl("footer-orange.webp");
const SHOW_FOOTER_TRANSITION_SECTION = false;

const SOCIAL_LINKS = [
  { label: "Email", href: `mailto:${EMAIL}`, icon: "mail" },
  { label: "Instagram", href: INSTAGRAM, icon: siInstagram },
  { label: "LinkedIn", href: LINKEDIN, icon: "linkedin" },
  { label: "Telegram", href: TELEGRAM, icon: siTelegram },
] as const;

type FireflyStyle = CSSProperties & {
  "--x": string;
  "--y": string;
  "--size": string;
  "--delay": string;
  "--duration": string;
  "--drift": string;
};

const FIREFLIES = [
  [7, 25, 4, -1.4, 7.8, 18],
  [9, 61, 3, -6.4, 9.6, -14],
  [12, 52, 3, -4.2, 9.4, -12],
  [16, 70, 3, -0.8, 8.6, 14],
  [22, 34, 4, -3.1, 10.2, -18],
  [25, 58, 3, -7.1, 10.8, 11],
  [27, 82, 3, -5.4, 8.2, 16],
  [33, 20, 3, -2.6, 9.8, -10],
  [36, 66, 4, -6.8, 11.2, 13],
  [42, 44, 3, -1.1, 8.9, -13],
  [49, 73, 3, -4.6, 10.1, 15],
  [58, 37, 4, -6.9, 9.3, -16],
  [64, 23, 3, -3.7, 9.6, -14],
  [68, 77, 3, -1.9, 8.8, 18],
  [73, 42, 4, -5.2, 10.4, -16],
  [79, 64, 3, -0.7, 7.9, 12],
  [84, 30, 3, -4.9, 9.1, -15],
  [87, 55, 3, -7.4, 10.6, 13],
  [89, 74, 4, -2.2, 10.8, 16],
  [94, 49, 3, -6.1, 8.4, -12],
] as const;

function SocialIcon({
  icon,
  label,
}: {
  icon: SimpleIcon | "linkedin" | "mail";
  label: string;
}) {
  if (icon === "mail") {
    return (
      <img
        src="/icons/mail.svg"
        alt=""
        className="h-[22px] w-[22px]"
        aria-hidden="true"
      />
    );
  }

  if (icon === "linkedin") {
    return (
      <img
        src="/icons/linkedin.svg"
        alt=""
        className="h-5 w-5"
        aria-hidden="true"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={
        label === "Instagram"
          ? "size-5"
          : label === "Telegram"
            ? "size-[19px]"
            : "size-4"
      }
      aria-hidden="true"
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export default function Footer({ isActive = false }: { isActive?: boolean }) {
  return (
    <div
      id="footer"
      className="relative w-full overflow-hidden bg-black text-white"
    >
      {SHOW_FOOTER_TRANSITION_SECTION ? (
        <section
          className="relative h-[300px] overflow-hidden bg-black sm:h-[390px] lg:h-[500px] 2xl:h-[560px]"
          aria-label="Footer artwork"
        >
          <Image
            src={marketingAssetUrl("footer-transition-orange.webp")}
            alt=""
            fill
            quality={90}
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover opacity-96"
            draggable={false}
          />
          <div className="absolute inset-0 z-10" aria-hidden="true">
            <TransitionFireworksCanvas active={isActive} />
          </div>
          {/* <div className="absolute inset-x-0 bottom-[10%] z-40 flex justify-center px-5">
            <div className="flex max-w-[calc(100vw-2rem)] flex-col items-center justify-center gap-4 px-2 py-2 sm:gap-5">
              <FooterLiquidGlassButton />
              <p className="max-w-[39ch] text-center text-sm leading-snug font-medium text-white/84 sm:text-base">
                The agency for building standout scalable digital experiences
              </p>
            </div>
          </div> */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32 bg-linear-to-b from-transparent via-black/66 to-black sm:h-44"
            aria-hidden="true"
          />
        </section>
      ) : null}

      <footer className="relative h-[460px] w-full overflow-hidden bg-black text-white sm:h-[540px] lg:h-[600px] 2xl:h-[650px]">
        <Image
          src={FOOTER_IMAGE}
          alt=""
          fill
          quality={90}
          loading="lazy"
          fetchPriority="low"
          sizes="(max-width: 640px) 120vw, (max-width: 1024px) 115vw, (max-width: 1536px) 110vw, 105vw"
          className="object-cover object-center opacity-95"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_20%,rgba(0,0,0,0.22)_43%,rgba(0,0,0,0.72)_78%,#000_100%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_150px_52px_rgba(0,0,0,0.96)] sm:shadow-[inset_0_0_210px_76px_rgba(0,0,0,0.98)]" />

        <div className="absolute inset-x-0 top-[14%] z-20 flex justify-center">
          <p
            className={`${sawarabiGothic.className} bg-linear-to-b from-[#ffd37a] via-[#ff8429] to-[#d3480c] bg-clip-text text-6xl leading-none tracking-normal text-transparent opacity-70 text-shadow-[0_3px_10px_rgba(118,38,0,0.82),0_0_18px_rgba(255,104,24,0.24)] sm:text-8xl md:text-[125px]`}
          >
            Hanabi
          </p>
        </div>

        <nav
          className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-4 sm:bottom-10"
          aria-label="Footer links"
        >
          <Link
            href="/blog"
            className="text-sm font-medium text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Blog
          </Link>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid size-7 place-items-center text-[#AFAFAF] opacity-[0.78] transition-[opacity,transform] duration-200 hover:opacity-100 sm:size-8"
              >
                <SocialIcon icon={social.icon} label={social.label} />
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute inset-0 z-10" aria-hidden="true">
          {FIREFLIES.map(([x, y, size, delay, duration, drift], index) => {
            const style: FireflyStyle = {
              "--x": `${x}%`,
              "--y": `${y}%`,
              "--size": `${size}px`,
              "--delay": `${delay}s`,
              "--duration": `${duration}s`,
              "--drift": `${drift}px`,
            };

            return (
              <span
                key={index}
                className="footer-firefly absolute top-[var(--y)] left-[var(--x)] size-[var(--size)] rounded-full"
                style={style}
              />
            );
          })}
        </div>
      </footer>
    </div>
  );
}
