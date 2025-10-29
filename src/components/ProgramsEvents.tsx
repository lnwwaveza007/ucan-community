"use client";
import Image from "next/image";
import { toDisplaySrc } from "@/lib/image";
import { motion } from "motion/react";
import { useI18n } from "@/lib/i18n/context";

export type ProgramCard = { title: string; date: string; description?: string; image?: string; registerPath?: string };

export default function ProgramsEvents({ upcomingPrograms, pastPrograms }: { upcomingPrograms: ProgramCard[]; pastPrograms: ProgramCard[] }) {
  const { messages } = useI18n();
  return (
    <section id="programs" className="py-16 md:py-20 bg-[var(--muted-100)] dark:bg-[color-mix(in_srgb,var(--color-card-dark)_84%,transparent)]">
      <div className="container-page px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{messages.programs.heading}</h2>
            <p className="mt-2 text-[var(--color-muted-700)] dark:text-white/80 max-w-xl">{messages.programs.subheading}</p>
          </motion.div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {upcomingPrograms.map((i, idx) => (
            <motion.div
              key={i.title}
              className="relative rounded-[var(--radius-lg)] overflow-hidden shadow-lg ring-1 ring-black/5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 140, damping: 18, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
            >
              {/* Gradient border wrapper */}
              <div className="p-[1px] bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500 h-full">
                <div className="relative rounded-[calc(var(--radius-lg))] bg-white dark:bg-[var(--color-card-dark)] h-full">
                  {/* Corner glow accents */}
                  <div className="pointer-events-none absolute -inset-px rounded-[calc(var(--radius-lg))] opacity-20 [mask-image:radial-gradient(40%_40%_at_0%_0%,black,transparent)] bg-fuchsia-400/30" />
                  <div className="pointer-events-none absolute -inset-px rounded-[calc(var(--radius-lg))] opacity-20 [mask-image:radial-gradient(40%_40%_at_100%_100%,black,transparent)] bg-sky-400/30" />

                  {/* Content */}
                  <div className="p-4">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] bg-gray-100">
                      {i.image ? (
                        <Image src={toDisplaySrc(i.image)} alt={i.title} width={800} height={600} className="w-full h-full object-cover" />
                      ) : null}
                      {/* Only upcoming badge */}
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-sky-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          {messages.programs.upcomingBadge}
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[var(--color-muted-700)] dark:text-white/80">{i.date}</span>
                    </div>
                    <div className="font-semibold mt-1 text-lg bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                      {i.title}
                    </div>
                    <div className="text-sm text-[var(--color-muted-700)] mt-1">{i.description}</div>
                    {i.registerPath && (
                      <div className="mt-4">
                        <motion.a
                          href={i.registerPath}
                          className="group relative inline-flex items-center justify-center rounded-[999px] px-5 h-10 font-medium text-white"
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="absolute inset-0 rounded-[999px] bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 opacity-90 transition group-hover:opacity-100" />
                          <span className="relative">{messages.programs.registerCta}</span>
                        </motion.a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div id="events" className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{messages.programs.pastHeading}</h3>
            <a className="text-sm text-[var(--color-brand)] hover:underline" href="#">{messages.programs.viewAll}</a>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pastPrograms.map((i, idx) => (
              <motion.div
                key={i.title}
                className="rounded-[var(--radius-md)] border border-[var(--color-muted-300)] p-4 hover:bg-white/60 dark:hover:bg-white/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div className="text-sm text-[var(--color-muted-700)]">{i.date}</div>
                <div className="font-medium">{i.title}</div> 
                {i.image ? (
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-lg)] mt-4 bg-gray-100">
                    <Image src={toDisplaySrc(i.image)} alt={i.title} width={800} height={600} className="w-full h-full object-cover" />
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


