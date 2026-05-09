"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  xPrevious: number;
  yPrevious: number;
  xVelocity: number;
  yVelocity: number;
  radius: number;
  opacity: number;
  color: string;
  lifespan: number;
};

type Firework = Omit<Particle, "lifespan"> & {
  createdAt: number;
  explodedAt: number | null;
  particles: Particle[];
};

const AIR_RESISTANCE = 4.2;
const GRAVITY = 48;
const MAX_LIFESPAN = 1800;
const MAX_FIREWORKS = 5;
const FIREWORK_SPAWN_INTERVAL = 520;
const FIREWORK_SPAWN_CHANCE = 0.68;

const COLORWAYS = [
  ["#FF2500", "#FF4A18", "#FF9900", "#FFD36B", "#FFF0B8"],
  ["#FF2500", "#FF6B35", "#FF9900", "#FFE1A1"],
  ["#D94A1C", "#FF7B24", "#F7B955", "#FFF4D1"],
];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number) {
  return Math.floor(random(min, max + 1));
}

function sample<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function normalize(
  value: number,
  currentMin: number,
  currentMax: number,
  nextMin: number,
  nextMax: number,
) {
  const progress = (value - currentMin) / (currentMax - currentMin);
  return nextMin + (nextMax - nextMin) * progress;
}

function convertPolarToCartesian(angle: number, distance: number) {
  const radians = (angle * Math.PI) / 180;
  return [Math.cos(radians) * distance, Math.sin(radians) * distance] as const;
}

export default function FooterFireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dimensions = { width: 0, height: 0 };
    let fireworks: Firework[] = [];
    let animationFrame: number | null = null;
    let generationInterval: number | null = null;
    let cleanupInterval: number | null = null;
    let scrollFrame: number | null = null;
    let lastTimestamp = performance.now();
    let isActive = false;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      dimensions.width = width;
      dimensions.height = height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const generateFirework = (): Firework => {
      const launchX = random(dimensions.width * 0.04, dimensions.width * 0.96);
      const angle = random(250, 290);
      const velocity = random(1160, 1900);
      const [xVelocity, yVelocity] = convertPolarToCartesian(angle, velocity);
      const startY = dimensions.height + random(20, 90);

      return {
        createdAt: performance.now(),
        explodedAt: null,
        radius: random(0.9, 1.5),
        opacity: 1,
        color: "#FFD36B",
        x: launchX,
        y: startY,
        xPrevious: launchX,
        yPrevious: startY,
        xVelocity,
        yVelocity,
        particles: [],
      };
    };

    const explodeFirework = (firework: Firework) => {
      firework.explodedAt = performance.now();

      const colorway = sample(COLORWAYS);
      const particleCount = randomInt(12, 22);

      firework.particles = Array.from({ length: particleCount }, () => {
        const angle = random(0, 360);
        const velocity = random(260, 540);
        const [xVelocity, yVelocity] = convertPolarToCartesian(angle, velocity);

        return {
          x: firework.x,
          y: firework.y,
          xPrevious: firework.x,
          yPrevious: firework.y,
          xVelocity,
          yVelocity,
          radius: random(0.65, 1.35),
          opacity: 1,
          lifespan: random(MAX_LIFESPAN * 0.56, MAX_LIFESPAN),
          color: sample(colorway),
        };
      });
    };

    const drawEntity = (entity: Particle | Firework) => {
      ctx.beginPath();
      ctx.moveTo(entity.xPrevious, entity.yPrevious);
      ctx.lineTo(entity.x, entity.y);
      ctx.globalAlpha = entity.opacity;
      ctx.lineWidth = entity.radius * 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = entity.color;
      ctx.shadowColor = entity.color;
      ctx.shadowBlur = entity.radius * 4.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawBlackFrame = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgb(0 0 0)";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    };

    const shouldRun = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const remainingScroll = maxScroll - window.scrollY;
      const footerHeight =
        canvas.closest("footer")?.getBoundingClientRect().height ||
        dimensions.height;

      return remainingScroll <= footerHeight + 140;
    };

    const stop = () => {
      isActive = false;
      fireworks = [];
      canvas.closest("footer")?.removeAttribute("data-active");

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      if (generationInterval !== null) {
        window.clearInterval(generationInterval);
        generationInterval = null;
      }

      if (cleanupInterval !== null) {
        window.clearInterval(cleanupInterval);
        cleanupInterval = null;
      }

      drawBlackFrame();
    };

    const draw = (timestamp: number) => {
      if (!isActive) {
        return;
      }

      const deltaTime = Math.min(timestamp - lastTimestamp, 250) / 1000;
      lastTimestamp = timestamp;

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.24;
      ctx.fillStyle = "rgb(0 0 0)";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      if (motionQuery.matches) {
        stop();
        return;
      }

      const drag = Math.exp(-AIR_RESISTANCE * deltaTime);
      ctx.globalCompositeOperation = "lighter";

      fireworks.forEach((firework) => {
        if (!firework.explodedAt) {
          firework.xVelocity *= drag;
          firework.yVelocity = firework.yVelocity * drag + GRAVITY * deltaTime;
          firework.x += firework.xVelocity * deltaTime;
          firework.y += firework.yVelocity * deltaTime;

          firework.opacity = clamp(
            normalize(firework.y, dimensions.height, 0, 0.62, 1),
            0.62,
            1,
          );
          drawEntity(firework);

          firework.xPrevious = firework.x;
          firework.yPrevious = firework.y;

          const age = timestamp - firework.createdAt;
          const highEnough = firework.y < dimensions.height * 0.18;
          const losingLift = firework.yVelocity > -70;

          if (age > 340 && (highEnough || losingLift || age > 1550)) {
            explodeFirework(firework);
          }

          return;
        }

        firework.particles.forEach((particle) => {
          const particleAge = timestamp - (firework.explodedAt || timestamp);
          particle.opacity = clamp(
            normalize(particleAge, 220, particle.lifespan, 1, 0),
          );
          particle.xVelocity *= drag;
          particle.yVelocity = particle.yVelocity * drag + GRAVITY * deltaTime;
          particle.x += particle.xVelocity * deltaTime;
          particle.y += particle.yVelocity * deltaTime;

          drawEntity(particle);

          particle.xPrevious = particle.x;
          particle.yPrevious = particle.y;
        });
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (isActive || motionQuery.matches) {
        return;
      }

      isActive = true;
      canvas.closest("footer")?.setAttribute("data-active", "true");
      lastTimestamp = performance.now();
      fireworks = [];
      animationFrame = window.requestAnimationFrame(draw);
      generationInterval = window.setInterval(() => {
        if (
          fireworks.length < MAX_FIREWORKS &&
          Math.random() < FIREWORK_SPAWN_CHANCE
        ) {
          fireworks.push(generateFirework());
        }
      }, FIREWORK_SPAWN_INTERVAL);
      cleanupInterval = window.setInterval(() => {
        const now = performance.now();
        fireworks = fireworks.filter((firework) => {
          if (!firework.explodedAt) {
            return true;
          }

          return now - firework.explodedAt < MAX_LIFESPAN;
        });
      }, 1800);
    };

    const syncActivity = () => {
      if (motionQuery.matches) {
        stop();
        return;
      }

      if (shouldRun()) {
        start();
      } else if (isActive) {
        stop();
      }
    };

    const queueActivitySync = () => {
      if (scrollFrame !== null) {
        return;
      }

      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = null;
        syncActivity();
      });
    };

    resize();
    drawBlackFrame();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    syncActivity();
    window.addEventListener("scroll", queueActivitySync, { passive: true });
    window.addEventListener("resize", queueActivitySync);
    motionQuery.addEventListener("change", syncActivity);

    return () => {
      stop();
      if (scrollFrame !== null) {
        window.cancelAnimationFrame(scrollFrame);
      }
      window.removeEventListener("scroll", queueActivitySync);
      window.removeEventListener("resize", queueActivitySync);
      motionQuery.removeEventListener("change", syncActivity);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="footer-fireworks-canvas absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
