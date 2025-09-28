import Image from "next/image";
import { toDisplaySrc } from "@/lib/image";

export type Partner = { name: string; logo: string };

export default function CommunityPartners({ communityPartners, partners }: { communityPartners: Partner[]; partners: Partner[] }) {
  return (
    <section
      id="community"
      className="relative py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
      </div>

      <div className="container-page px-4 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white bg-clip-text text-transparent">
            Community & Partners
          </h2>
          <a
            href="#"
            className="text-sm font-medium text-white bg-[var(--color-brand)]/90 hover:bg-[var(--color-brand)] px-3 py-1.5 rounded-md shadow-sm"
          >
            Become a partner
          </a>
        </div>
        {/* Community partners */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--color-muted-700)]">Community Partners</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {communityPartners.map((partner, idx) => (
              <div
                key={idx}
                className="group rounded-xl p-[1px] bg-gradient-to-br from-fuchsia-400/60 via-sky-400/60 to-emerald-400/60 shadow-sm transition hover:shadow-md"
              >
                <div className="rounded-[calc(var(--radius-lg))] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-[var(--color-card-dark)] p-4 h-full">
                  <div className="relative w-full h-12 md:h-14">
                    <Image src={toDisplaySrc(partner.logo)} alt={partner.name} width={400} height={200} className="w-full h-full object-contain transition rounded-[var(--radius-lg)] group-hover:scale-[1.02]" />
                  </div>
                  <div className="text-xs md:text-sm text-[var(--color-muted-700)] mt-2 text-center">
                    {partner.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate partners */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--color-muted-700)]">Corporate Partners</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="group rounded-xl p-[1px] bg-gradient-to-br from-amber-400/60 via-rose-400/60 to-indigo-400/60 shadow-sm transition hover:shadow-md"
              >
                <div className="rounded-[calc(var(--radius-lg))] border border-white/70 dark:border-white/10 bg-white/80 dark:bg-[var(--color-card-dark)] p-4 h-full">
                  <div className="relative w-full h-12 md:h-14">
                    <Image src={toDisplaySrc(partner.logo)} alt={partner.name} width={400} height={200} className="w-full h-full object-contain transition rounded-[var(--radius-lg)] group-hover:scale-[1.02]" />
                  </div>
                  <div className="text-xs md:text-sm text-[var(--color-muted-700)] mt-2 text-center">
                    {partner.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


