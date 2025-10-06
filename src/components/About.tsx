"use client";
import { GiClassicalKnowledge, GiMeshNetwork, GiThreeFriends } from "react-icons/gi";
import { useI18n } from "@/lib/i18n/context";

export default function About() {
  const { messages } = useI18n();
  return (
    <section id="about" className="py-16 md:py-20">
      <div className="container-page px-4">
        {/* Vision */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-6 items-stretch">
          <div className="rounded-[24px] p-8 text-white bg-[radial-gradient(1200px_400px_at_0%_-10%,rgba(255,76,112,0.2),transparent_60%),radial-gradient(1200px_400px_at_100%_-10%,rgba(255,142,66,0.2),transparent_60%),linear-gradient(180deg,var(--brand-blue-800),var(--brand-blue-900))]">
            <div className="text-sm uppercase tracking-[0.18em] text-white/80">{messages.about.visionTitle}</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-snug">{messages.about.visionText}</h2>
          </div>
          <div className="rounded-[24px] p-8 border border-[var(--color-muted-300)] bg-white dark:bg-[var(--color-card-dark)]">
            <div className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted-700)]">{messages.about.missionTitle}</div>
            <p className="mt-2 text-lg font-medium">{messages.about.missionIntro}</p>
            <div className="mt-5 grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-[12px] bg-[var(--color-accent-orange)]/15 text-[var(--color-accent-orange)] grid place-items-center">
                  <GiMeshNetwork size={25} />
                </div>
                <div>
                  <div className="font-semibold">{messages.about.missionItems.network}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-[12px] bg-[var(--accent-pink)]/15 text-[var(--accent-pink)] grid place-items-center">
                  <GiClassicalKnowledge size={25} />
                </div>
                <div>
                  <div className="font-semibold">{messages.about.missionItems.knowledge}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-[12px] bg-[var(--color-accent-sun)]/20 text-[var(--color-accent-sun)] grid place-items-center">
                  <GiThreeFriends size={25} />
                </div>
                <div>
                  <div className="font-semibold">{messages.about.missionItems.collaboration}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="mt-10 container-page px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { v: "6", l: messages.about.stats.projects, c: "from-[var(--accent-pink)] to-[var(--color-accent-sun)]" },
            { v: "25+", l: messages.about.stats.workshops, c: "from-[var(--color-accent-sun)] to-[var(--color-accent-orange)]" },
            { v: "30+", l: messages.about.stats.meetups, c: "from-[var(--color-accent-orange)] to-[var(--accent-pink)]" },
            { v: "60+", l: messages.about.stats.teamMembers, c: "from-[var(--highlight-green)] to-[var(--color-accent-sun)]" },
            { v: "439+", l: messages.about.stats.sandboxParticipants, c: "from-[var(--brand-blue-800)] to-[var(--accent-pink)]" },
            { v: "192+", l: messages.about.stats.sandboxNetwork, c: "from-[var(--accent-pink)] to-[var(--highlight-green)]" },
          ].map((s) => (
            <div key={s.v} className={`rounded-[18px] p-1 bg-gradient-to-tr ${s.c}`}>
              <div className="rounded-[16px] p-4 text-center bg-white/95 dark:bg-[var(--color-card-dark)] h-full">
                <div className="text-3xl font-extrabold text-[var(--brand-blue-800)] dark:text-white">{s.v}</div>
                <div className="text-xs text-[var(--color-muted-700)] dark:text-white/80 whitespace-pre-line">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


