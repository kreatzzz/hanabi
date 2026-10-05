import BookCallLink from "@/components/book-call-link";
import { CalPopupButton } from "@/components/cal-popup-button";
import FooterReveal from "@/components/footer-reveal";
import Header from "@/components/header";
import { JsonLd } from "@/components/blog/json-ld";
import HeroKites from "@/components/hero-kites";
import MarqueeComponent from "@/components/marquee-component";
import { Reveal } from "@/components/reveal";
import ServiceCards from "@/components/services/service-cards";
import StudiosQuoteSection from "@/components/studios-quote-section";
import TrustedBy from "@/components/trusted-by";
import WhyUsCards from "@/components/why-us-cards";
import WorkProjectsList from "@/components/work-projects-list";
import { workProjects } from "@/data/work-projects";
import { getHeroProjects } from "@/lib/hero-projects";
import { shuffleArray } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site-url";
import Link from "next/link";

export default function Home() {
  const heroProjects = getHeroProjects();
  const shuffledHeroProjects = shuffleArray(heroProjects);

  return (
    <FooterReveal>
      <main className="font-inter">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": absoluteUrl("/#organization"),
                name: "Hanabi",
                url: absoluteUrl("/"),
                logo: absoluteUrl("/logo.svg"),
                description:
                  "Product design and web development studio for founders and small teams.",
                email: "workwithhanabi@gmail.com",
                sameAs: [
                  "https://www.instagram.com/okhanabi/",
                  "https://www.linkedin.com/company/hanabilabs",
                ],
              },
              {
                "@type": "WebSite",
                "@id": absoluteUrl("/#website"),
                name: "Hanabi",
                url: absoluteUrl("/"),
                publisher: { "@id": absoluteUrl("/#organization") },
              },
            ],
          }}
        />
        <section
          id="hero"
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center text-pretty"
        >
          <div className="absolute top-0 left-0 z-50 w-full">
            <Header />
          </div>

          <HeroKites />

          <div className="relative z-20 flex -translate-y-7 flex-col items-center bg-white/40 md:-translate-y-9 md:bg-transparent xl:-translate-y-14 2xl:-translate-y-18">
            <div className="mx-4 mt-32 w-full max-w-2xl rounded-3xl px-4 py-4 md:mx-0 md:mt-48 md:px-0 md:py-0">
              <Reveal delay={0}>
                <h1 className="font-inter mx-auto max-w-xl text-4xl leading-tight font-medium text-balance md:text-5xl">
                  Your Digital Impression. Simple and Beautiful
                </h1>
              </Reveal>

              <Reveal delay={0.08}>
                <p className="mx-auto max-w-2xl pt-5 text-lg font-medium text-pretty text-[#6C6C6C]">
                  Hanabi designs and builds websites, brand systems, and product
                  interfaces for founders and small teams.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.16}>
              <div className="flex gap-8 pt-5">
                <BookCallLink className="text-background font-inter group relative inline-flex cursor-pointer overflow-hidden rounded-full border border-[#FF2500] p-1 px-4 text-lg font-medium transition-transform duration-50 active:scale-95 md:hidden">
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
                </BookCallLink>
                <CalPopupButton className="text-background font-inter group relative hidden cursor-pointer overflow-hidden rounded-full border border-[#FF2500] p-1 px-4 text-lg font-medium transition-transform duration-50 active:scale-95 md:inline-flex">
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
          className="flex flex-col items-center justify-center bg-linear-to-b from-white via-[#F6F6F6] via-18% to-[#F6F6F6] px-5 pt-24 pb-10"
        >
          <Reveal>
            <p className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
              Our Services
            </p>
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

        <TrustedBy />

        <section
          id="why-us"
          className="flex flex-col items-center justify-center bg-[#F6F6F6] px-5 pt-10 pb-20"
        >
          <Reveal>
            <p className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
              Why Us
            </p>
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
            <p className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
              Our Works
            </p>
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
