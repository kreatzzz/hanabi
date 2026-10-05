export type WorkProjectImage = {
  src: string;
  alt: string;
  mobileSrc?: string;
};

export type WorkProjectVideo = {
  src: string;
  poster: string;
  alt: string;
  label: string;
};

export type WorkProjectContributor = "krish" | "dey" | "sagarika" | "arsh";

/**
 * Layout follows image count (see `work-card-gallery.tsx`):
 * 1 — centered inset tile
 * 2 — side-by-side on desktop, stacked on mobile.
 * 3 — 2 side-by-side on top, 1 centered below.
 * 4 — 2×2 grid.
 */
export type WorkProjectImages =
  | readonly [WorkProjectImage]
  | readonly [WorkProjectImage, WorkProjectImage]
  | readonly [WorkProjectImage, WorkProjectImage, WorkProjectImage]
  | readonly [
      WorkProjectImage,
      WorkProjectImage,
      WorkProjectImage,
      WorkProjectImage,
    ];

export type WorkProject = {
  title: string;
  category: string;
  description: string;
  images: WorkProjectImages;
  videos?: readonly WorkProjectVideo[];
  contributors: readonly WorkProjectContributor[];
  liveUrl?: string;
};

export const workProjects: readonly WorkProject[] = [
  {
    title: "GO GYM",
    category: "APP | DESIGN & DEVELOPMENT",
    description:
      "A fitness product concept with fluid onboarding, a bold visual identity, and a dashboard that turns daily activity into lasting habits.",
    contributors: ["krish"],
    images: [
      {
        src: "/projects/go-gym-product.webp",
        alt: "Go Gym workouts and personal dashboard screens",
      },
      {
        src: "/projects/go-gym-onboarding.webp",
        alt: "Go Gym splash and activity selection screens",
      },
    ],
    videos: [
      {
        src: "/projects/videos/go-gym-reel.mp4",
        poster: "/projects/go-gym-cover-reel.webp",
        label: "Quick look",
        alt: "Go Gym product and onboarding reel",
      },
      {
        src: "/projects/videos/go-gym-onboarding.mp4",
        poster: "/projects/go-gym-cover.webp",
        label: "Full onboarding",
        alt: "Go Gym complete onboarding from profile setup to the fitness dashboard",
      },
    ],
  },
  {
    title: "TRADE MOAI",
    category: "WEB APP | PRODUCT UI",
    description:
      "A focused trading interface concept designed around fast scanning, clear positions, and confident decision-making.",
    contributors: ["krish", "dey"],
    images: [
      {
        src: "/projects/tradeMoai1.png",
        alt: "Trade Moai interface overview",
      },
      {
        src: "/projects/tradeMoai2.png",
        alt: "Trade Moai trading dashboard",
      },
    ],
  },
  {
    title: "DOWN THE COVE",
    category: "WEBSITE | LANDING",
    liveUrl: "https://dtc.cooldash.xyz",
    description:
      "A fresh landing experience designed to capture the brand's coastal calm and community-driven story.",
    contributors: ["krish", "dey"],
    images: [
      {
        src: "/projects/dtc1.png",
        alt: "Down The Cove hero screen",
      },
      {
        src: "/projects/dtc2.png",
        alt: "Down The Cove feature section",
      },
      {
        src: "/projects/dtc3.png",
        alt: "Down The Cove overview",
      },
    ],
  },
  {
    title: "BALLARAT BOX SPORTS",
    category: "WEBSITE | LANDING",
    liveUrl: "https://ballaratsports.vercel.app",
    description:
      "A bold and energetic digital presence built for a community-driven sports brand that lives and breathes competition.",
    contributors: ["krish", "dey"],
    images: [
      {
        src: "/projects/ballaratboxsports1.png",
        alt: "Ballarat Box Sports hero screen",
      },
      {
        src: "/projects/ballaratboxsports2.png",
        alt: "Ballarat Box Sports feature section",
      },
      {
        src: "/projects/ballaratboxsports3.png",
        alt: "Ballarat Box Sports overview",
      },
    ],
  },
  {
    title: "WABISABI",
    category: "WEBSITE | BRANDING",
    liveUrl: "https://wabisabi.pics",
    description:
      "A calm, tactile web experience shaped around imperfect beauty, considered details, and a quietly memorable brand presence.",
    contributors: ["dey", "sagarika"],
    images: [
      {
        src: "/projects/wabisabi1.png",
        alt: "Wabisabi hero screen",
      },
      {
        src: "/projects/wabisabi2.png",
        alt: "Wabisabi feature section",
      },
      {
        src: "/projects/wabisabi3.png",
        alt: "Wabisabi brand detail",
      },
    ],
  },
  {
    title: "COMP OPS",
    category: "WEB APP | PRODUCT UI",
    description:
      "A competitive gaming platform bringing tournaments, leagues, and communities together, with clear tools for players and organizers.",
    contributors: ["krish"],
    images: [
      {
        src: "/projects/compops-dashboard.webp",
        alt: "Comp Ops game dashboard with upcoming tournaments and competition navigation",
      },
      {
        src: "/projects/compops-organizations.webp",
        alt: "Comp Ops organization workspace with teams, members, and activity",
      },
      {
        src: "/projects/compops-landing.webp",
        alt: "Comp Ops landing page with leaderboard artwork and competition overview",
      },
    ],
  },
  {
    title: "THOMAS BEWICK",
    category: "WEBSITE | BRANDING",
    liveUrl: "https://thomasbewick.co.uk",
    description:
      "A refined editorial web presence honouring the legacy of a master engraver - balancing heritage craft with modern digital storytelling.",
    contributors: ["dey", "sagarika"],
    images: [
      {
        src: "/projects/thomasbewick1.png",
        alt: "Thomas Bewick hero and gallery",
      },
      {
        src: "/projects/thomasbewick2.png",
        alt: "Thomas Bewick engraving detail",
      },
    ],
  },
  {
    title: "LEADLY",
    category: "WEB APP | PRODUCT UI",
    liveUrl: "https://leadly.live",
    description:
      "A streamlined lead management platform designed to help teams track, nurture, and convert prospects with clarity and speed.",
    contributors: ["arsh", "krish", "dey"],
    images: [
      {
        src: "/projects/leadly1.png",
        alt: "Leadly dashboard overview",
      },
      {
        src: "/projects/leadly2.png",
        alt: "Leadly lead details view",
      },
    ],
  },
];
