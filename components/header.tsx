"use client";

import BookCallLink from "@/components/book-call-link";
import { CalPopupButton } from "@/components/cal-popup-button";
import { Sawarabi_Gothic } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const sawarabiGothic = Sawarabi_Gothic({
  weight: "400",
  subsets: ["latin"],
});

type ItemHovered = (typeof NAV_ITEMS)[number]["key"];

export default function Header() {
  const [itemHovered, setItemHovered] = useState<ItemHovered | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const distance = currentScrollY - lastScrollY.current;

        if (currentScrollY < 48) {
          setIsVisible(true);
        } else if (Math.abs(distance) > 6) {
          setIsVisible(distance < 0);
        }

        lastScrollY.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={[
        "fixed inset-x-0 top-0 z-[90] transition-transform duration-500 ease-out will-change-transform",
        isVisible ? "translate-y-0" : "-translate-y-[125%]",
      ].join(" ")}
    >
      {/* Desktop / tablet header */}
      <header className="m-5 mx-auto hidden max-w-2xl items-center justify-between rounded-full bg-white p-1.5 shadow-[0_0_3px_0.25px_rgba(0,0,0,0.2)] md:flex">
        <Link href="/" aria-label="Hanabi home">
          <Image src="/logo.svg" alt="" width={37} height={36} />
        </Link>

        <nav className="flex gap-7" onMouseLeave={() => setItemHovered(null)}>
          {NAV_ITEMS.slice(0, 2).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onMouseEnter={() => setItemHovered(item.key)}
              className={[
                "transition-colors duration-300",
                !itemHovered
                  ? "text-neutral-600"
                  : itemHovered === item.key
                    ? "text-neutral-950"
                    : "text-neutral-950/40",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <span
          className={`${sawarabiGothic.className} pb-1 text-2xl tracking-[-0.02em]`}
        >
          Hanabi
        </span>

        <nav className="flex gap-7" onMouseLeave={() => setItemHovered(null)}>
          {NAV_ITEMS.slice(2).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onMouseEnter={() => setItemHovered(item.key)}
              className={[
                "transition-colors duration-300",
                !itemHovered
                  ? "text-neutral-600"
                  : itemHovered === item.key
                    ? "text-neutral-950"
                    : "text-neutral-950/40",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <CalPopupButton className="text-background font-inter group relative inline-flex cursor-pointer items-center overflow-hidden rounded-full border border-neutral-900 bg-linear-to-b from-neutral-900 to-black p-1 px-4 font-medium inset-shadow-sm inset-shadow-neutral-500 transition-shadow duration-300 text-shadow-neutral-500 text-shadow-xs hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_7px_18px_-18px_rgba(0,0,0,0.85)] active:scale-95">
          <span
            className="absolute inset-0 bg-linear-to-t from-white/0 via-white/6 to-white/14 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            aria-hidden
          />
          <span className="relative z-10">Book a Call</span>
        </CalPopupButton>
      </header>

      {/* Mobile header */}
      <header className="mx-auto w-full md:hidden">
        <div className="mx-4 mt-4 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-[0_0_3px_0.25px_rgba(0,0,0,0.16)] backdrop-blur">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Hanabi home"
            >
              <Image src="/logo.svg" alt="" width={30} height={30} />
              <span className={`${sawarabiGothic.className} text-xl`}>
                Hanabi
              </span>
            </Link>

            <BookCallLink className="text-background font-inter group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-neutral-900 bg-linear-to-b from-neutral-900 to-black px-3 py-2 text-sm font-medium inset-shadow-sm inset-shadow-neutral-500 transition-shadow duration-300 text-shadow-neutral-500 text-shadow-xs hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_7px_18px_-18px_rgba(0,0,0,0.85)] active:scale-95">
              <span
                className="absolute inset-0 bg-linear-to-t from-white/0 via-white/6 to-white/14 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                aria-hidden
              />
              <span className="relative z-10">Book a Call</span>
            </BookCallLink>
          </div>
        </div>
      </header>
    </div>
  );
}

const NAV_ITEMS = [
  {
    key: "services",
    label: "Services",
    href: "/#services",
  },
  {
    key: "works",
    label: "Our works",
    href: "/#works",
  },
  {
    key: "why-us",
    label: "Why us",
    href: "/#why-us",
  },
  {
    key: "about-us",
    label: "About us",
    href: "/#studios",
  },
] as const;
