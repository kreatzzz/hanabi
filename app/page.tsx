import { CalPopupButton } from "@/components/cal-popup-button";
import FooterReveal from "@/components/footer-reveal";
import Header from "@/components/header";
import HeroKites from "@/components/hero-kites";
import MarqueeComponent from "@/components/marquee-component";
import { Reveal } from "@/components/reveal";
import ServiceCards from "@/components/services/service-cards";
import StudiosQuoteSection from "@/components/studios-quote-section";
import WhyUsCards from "@/components/why-us-cards";
import WorkProjectsList from "@/components/work-projects-list";
import { workProjects } from "@/data/work-projects";
import { getHeroProjects } from "@/lib/hero-projects";
import { shuffleArray } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const heroProjects = getHeroProjects();
  const shuffledHeroProjects = shuffleArray(heroProjects);

  return (
    <FooterReveal>
      <main className="font-inter">
        <section
          id="hero"
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-center text-pretty"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-linear-to-b from-white/0 via-[#FAFAFA]/80 to-[#F6F6F6]"
          />

          <div className="absolute top-0 left-0 z-50 w-full">
            <Header />
          </div>

          <HeroKites />

          <div className="relative z-20 flex flex-col items-center bg-white/40 md:bg-transparent">
            <div className="mx-4 mt-32 w-full max-w-2xl rounded-3xl px-4 py-4 md:mx-0 md:mt-48 md:px-0 md:py-0">
              <Reveal delay={0}>
                <h1 className="font-inter mx-auto max-w-xl text-4xl leading-tight font-medium text-balance md:text-5xl">
                  Your Digital Impression. Simple and Beautiful
                </h1>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="mx-auto max-w-2xl pt-5 text-lg font-medium text-pretty text-[#6C6C6C]">
                  We build refreshingly simple and beautiful websites and
                  digital experiences that captivate your audience and elevate
                  your brand.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.16}>
              <div className="flex gap-8 pt-5">
                <CalPopupButton className="text-background font-inter group relative cursor-pointer overflow-hidden rounded-full border border-[#FF2500] p-1 px-4 text-lg font-medium transition-transform duration-50 active:scale-95">
                  <span
                    className="absolute inset-0 bg-linear-to-b from-[#FF2500] from-30% via-50% to-[#FF9900] to-80% inset-shadow-2xs inset-shadow-[#FF9900]"
                    aria-hidden
                  />
                  <span
                    className="absolute inset-0 bg-linear-to-t from-[#FF9900] from-30% via-80% to-[#FF2500] to-120% opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    aria-hidden
                  />
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full inset-shadow-sm inset-shadow-[#FF2500]"
                    aria-hidden
                  />
                  <span className="relative z-10 text-shadow-[#FF2500] text-shadow-xs">
                    Book an Intro call
                  </span>
                </CalPopupButton>
                <Link
                  href="#works"
                  className="inline-flex items-center font-medium hover:underline"
                >
                  Recent works
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-14">
                <MarqueeComponent items={shuffledHeroProjects} />
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="services"
          className="flex flex-col items-center justify-center bg-[#F6F6F6] px-5 py-10"
        >
          <Reveal>
            <h3 className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
              Our Services
            </h3>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="pt-4 text-center text-4xl leading-tight font-medium md:text-4xl">
              We specialise in making things
              <br />
              <span className="italic">simply beautiful.</span>
            </h2>
          </Reveal>

          <ServiceCards heroProjects={heroProjects} />
        </section>

        <section
          id="why-us"
          className="flex flex-col items-center justify-center bg-[#F6F6F6] px-5 pt-10 pb-20"
        >
          <Reveal>
            <h3 className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
              Why Us
            </h3>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="pt-4 text-center text-4xl leading-tight font-medium md:text-4xl">
              The Hanabi Difference
            </h2>
          </Reveal>

          <WhyUsCards />
        </section>

        <section
          id="works"
          className="flex flex-col items-center justify-center bg-[#F6F6F6] px-5 pt-14 pb-10"
        >
          <Reveal>
            <h3 className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
              Our Works
            </h3>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="pt-4 text-center text-4xl leading-tight font-medium md:text-4xl">
              A Curated Collection
            </h2>
          </Reveal>

          <WorkProjectsList projects={workProjects} />
        </section>

        <StudiosQuoteSection />
      </main>
    </FooterReveal>
  );
}
