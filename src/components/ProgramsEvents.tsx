import Image from "next/image";
import founder_sprint_week_1 from "../images/programs/mockup.jpg";
import founder_sprint_week_2 from "../images/programs/mockup2.jpg";
import founder_sprint_week_3 from "../images/programs/mockup3.jpg";
import founder_sprint_week_4 from "../images/programs/mockup4.jpg";

const pastPrograms = [
  {
    title: "Founder Sprint Week 1",
    date: "Oct 12, 2025",
    description: "Intensive program to validate ideas and ship MVPs.",
    image: founder_sprint_week_1,
  },
  {
    title: "Founder Sprint Week 2",
    date: "Oct 12, 2025",
    description: "Intensive program to validate ideas and ship MVPs.",
    image: founder_sprint_week_2,
  },
  {
    title: "Founder Sprint Week 3",
    date: "Oct 12, 2025",
    description: "Intensive program to validate ideas and ship MVPs.",
    image: founder_sprint_week_3,
  },
];

const upcomingPrograms = [
  {
    title: "Founder Sprint Week",
    date: "Oct 12, 2025",
    description: "Intensive program to validate ideas and ship MVPs.",
    image: founder_sprint_week_4,
  },
];

export default function ProgramsEvents() {
  return (
    <section id="programs" className="py-16 md:py-20 bg-[var(--muted-100)] dark:bg-[color-mix(in_srgb,var(--color-card-dark)_84%,transparent)]">
      <div className="container-page px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Programs & Events</h2>
            <p className="mt-2 text-[var(--color-muted-700)] dark:text-white/80 max-w-xl">Discover upcoming programs and explore past events.</p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {upcomingPrograms.map((i) => (
            <div
              key={i.title}
              className="relative rounded-[var(--radius-lg)] overflow-hidden shadow-lg ring-1 ring-black/5"
            >
              {/* Gradient border wrapper */}
              <div className="p-[1px] bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500">
                <div className="relative rounded-[calc(var(--radius-lg))] bg-white dark:bg-[var(--color-card-dark)]">
                  {/* Corner glow accents */}
                  <div className="pointer-events-none absolute -inset-px rounded-[calc(var(--radius-lg))] opacity-20 [mask-image:radial-gradient(40%_40%_at_0%_0%,black,transparent)] bg-fuchsia-400/30" />
                  <div className="pointer-events-none absolute -inset-px rounded-[calc(var(--radius-lg))] opacity-20 [mask-image:radial-gradient(40%_40%_at_100%_100%,black,transparent)] bg-sky-400/30" />

                  {/* Content */}
                  <div className="p-4">
                    <div className="relative">
                      <Image src={i.image} alt={i.title} className="w-full h-full object-cover rounded-[var(--radius-lg)]" />
                      {/* Only upcoming badge */}
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-sky-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Upcoming
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
                    <div className="mt-4">
                      <button className="group relative rounded-[999px] px-5 h-10 font-medium text-white">
                        <span className="absolute inset-0 rounded-[999px] bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 opacity-90 transition group-hover:opacity-100" />
                        <span className="relative">Register</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div id="events" className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Past Events</h3>
            <a className="text-sm text-[var(--color-brand)] hover:underline" href="#">View all</a>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pastPrograms.map((i) => (
              <div key={i.title} className="rounded-[var(--radius-md)] border border-[var(--color-muted-300)] p-4 hover:bg-white/60 dark:hover:bg-white/5">
                <div className="text-sm text-[var(--color-muted-700)]">{i.date}</div>
                <div className="font-medium">{i.title}</div> 
                <Image src={i.image} alt={i.title} className="w-full object-cover rounded-[var(--radius-lg)] mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


