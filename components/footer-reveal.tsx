"use client";

import { useEffect, useRef, useState } from "react";
import Footer from "@/components/footer";

export default function FooterReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    let frameId = 0;
    let observedChild: Element | null = null;
    let ro: ResizeObserver | null = null;

    const measure = () => {
      const child = el.firstElementChild;
      const measuredElement = child ?? el;

      setFooterHeight(measuredElement.getBoundingClientRect().height);

      if (ro && child && child !== observedChild) {
        if (observedChild) {
          ro.unobserve(observedChild);
        }

        ro.observe(child);
        observedChild = child;
      }
    };

    const update = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measure);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }

    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true });

    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frameId);
      ro?.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div
        className="relative z-10 bg-white"
        style={{ marginBottom: footerHeight }}
      >
        {children}
      </div>

      <div
        ref={footerRef}
        className="fixed inset-x-0 bottom-0 z-0"
        aria-hidden={footerHeight === 0}
      >
        <Footer />
      </div>
    </>
  );
}
