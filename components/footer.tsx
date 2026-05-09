"use client";

import FooterFireworksCanvas from "@/components/footer-fireworks-canvas";
import type { CSSProperties } from "react";

type LanternTone = "vermilion" | "amber" | "coral";

type LanternStyle = CSSProperties & {
  "--lantern-main": string;
  "--lantern-mid": string;
  "--lantern-glow": string;
  "--lantern-shadow": string;
  "--lantern-scale": number;
};

const LANTERN_PALETTES: Record<
  LanternTone,
  Pick<
    LanternStyle,
    "--lantern-main" | "--lantern-mid" | "--lantern-glow" | "--lantern-shadow"
  >
> = {
  vermilion: {
    "--lantern-main": "#ff3a12",
    "--lantern-mid": "#ff7b24",
    "--lantern-glow": "#ffe09b",
    "--lantern-shadow": "#8a1007",
  },
  amber: {
    "--lantern-main": "#ff9b24",
    "--lantern-mid": "#ffd276",
    "--lantern-glow": "#fff0b5",
    "--lantern-shadow": "#9b3b08",
  },
  coral: {
    "--lantern-main": "#ff6846",
    "--lantern-mid": "#ffaf78",
    "--lantern-glow": "#ffe3a8",
    "--lantern-shadow": "#9c1a11",
  },
};

function JapaneseLantern({
  className = "",
  scale,
  tone,
}: {
  className?: string;
  scale: number;
  tone: LanternTone;
}) {
  const style: LanternStyle = {
    ...LANTERN_PALETTES[tone],
    "--lantern-scale": scale,
  };

  return (
    <div className={`footer-lantern ${className}`} style={style}>
      <div className="footer-lantern-suspension">
        <span className="footer-lantern-wire" />
        <span className="footer-lantern-hook" />
        <span className="footer-lantern-cap footer-lantern-cap-top" />
        <div className="footer-lantern-body">
          <span className="footer-lantern-inner-light" />
          <span className="footer-lantern-paper-grain" />
          <span className="footer-lantern-ridges" />
        </div>
        <span className="footer-lantern-cap footer-lantern-cap-bottom" />
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      id="footer"
      className="footer-scene relative h-[clamp(420px,60vh,620px)] w-full overflow-hidden bg-black text-white"
      aria-label="Decorative Japanese lantern footer"
    >
      <FooterFireworksCanvas />

      <div className="footer-lantern-stage" aria-hidden="true">
        <div className="footer-lantern-mount footer-lantern-mount-left">
          <span className="footer-lantern-stick" />
          <JapaneseLantern
            className="footer-lantern-side footer-lantern-left"
            scale={0.64}
            tone="vermilion"
          />
        </div>

        <div className="footer-lantern-mount footer-lantern-mount-right">
          <span className="footer-lantern-stick" />
          <JapaneseLantern
            className="footer-lantern-side footer-lantern-right"
            scale={0.62}
            tone="vermilion"
          />
        </div>
      </div>
    </footer>
  );
}

/*
Previous footer content commented out per request:
- social links
- "Now accepting projects" status
- agency description
- dot-matrix strips
- "Book an Intro call" CTA
- Hanabi logo and wordmark
*/
