import { Reveal } from "@/components/reveal";
import { Sawarabi_Gothic } from "next/font/google";
import Image from "next/image";

const sawarabiGothic = Sawarabi_Gothic({
  subsets: ["latin"],
  weight: ["400"],
});

const teamMembers = [
  { name: "Krish", role: "Designer" },
  { name: "Roy", role: "Developer" },
  { name: "Dey", role: "Developer" },
  { name: "Sagarika", role: "Designer" },
  { name: "Arsh", role: "Developer" },
];

function TeamMemberCard({ member }: { member: (typeof teamMembers)[number] }) {
  return (
    <li className="min-w-0 text-center">
      <div
        className="mx-auto size-12 rounded-full bg-white ring-1 ring-black/8 sm:size-14"
        aria-hidden="true"
      />
      <h4 className="mt-3 text-lg leading-tight font-medium text-black sm:text-xl">
        {member.name}
      </h4>
      <p className="mt-1 font-mono text-sm leading-tight font-medium text-[#6C6C6C] uppercase">
        {member.role}
      </p>
    </li>
  );
}

export default function StudiosQuoteSection() {
  return (
    <section
      id="studios"
      className="relative overflow-hidden bg-[#F6F6F6] px-5 pt-10 pb-24 text-center sm:pt-14 sm:pb-28"
    >
      <Reveal>
        <h3 className="font-mono text-lg font-medium text-[#6C6C6C] uppercase sm:text-xl">
          Who We Are
        </h3>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="pt-4 text-center text-4xl leading-tight font-medium md:text-4xl">
          The People Behind the Pixels.
        </h2>
      </Reveal>

      <Reveal
        delay={0.12}
        className="relative z-10 mx-auto mt-6 w-full max-w-6xl sm:mt-8"
      >
        <div className="@container relative mx-auto min-h-[240px] w-full max-w-4xl sm:min-h-[290px] md:min-h-[330px]">
          <p
            className={`${sawarabiGothic.className} pointer-events-none absolute top-0 right-0 left-0 z-0 text-center text-[clamp(3.2rem,16cqw,8.75rem)] leading-[1.05] font-medium tracking-tighter whitespace-nowrap text-black sm:-top-2`}
            aria-hidden="true"
          >
            Hanabi Studios
          </p>

          <div className="gradient-border-4 gradient-border-from-[#FF6B52] gradient-border-to-[#FFC874] animate-gradient-border absolute top-[2.65rem] right-0 left-0 z-10 h-[180px] rounded-xl bg-white [--gradient-border-duration:9s] motion-reduce:animate-none sm:top-12 sm:h-[230px] sm:rounded-2xl md:top-16 md:h-[260px]">
            <div className="absolute inset-0 grid place-items-center px-6 sm:px-10">
              <blockquote
                className={`max-w-[46ch] text-center font-sans text-[15px] leading-relaxed tracking-tight text-black sm:text-base md:text-3xl`}
              >
                “We don’t chase complexity - we craft clarity. Every pixel is
                intentional, every interaction earned.”
              </blockquote>
            </div>
            <Image
              src="/logo-dark.svg"
              alt=""
              width={168}
              height={135}
              className="absolute bottom-4 left-4 h-6 w-auto sm:bottom-6 sm:left-6 sm:h-8"
            />
          </div>
        </div>
      </Reveal>

      <Reveal
        delay={0.18}
        className="relative z-10 mx-auto mt-4 w-full max-w-4xl sm:mt-6"
      >
        <div className="flex flex-col gap-7 min-[520px]:hidden">
          <ul className="grid grid-cols-3 gap-x-2">
            {teamMembers.slice(0, 3).map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </ul>
          <ul className="mx-auto grid w-[56%] grid-cols-2 gap-x-2">
            {teamMembers.slice(3).map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </ul>
        </div>

        <ul className="hidden grid-cols-5 gap-x-6 min-[520px]:grid">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
