import Image from "next/image";

import chula_deeptech from "../images/partners/chula_deeptech.png";
import kmitl_startup_hub from "../images/partners/kmitl_startup_hub.png";
import cubs from "../images/partners/cubs.jpg";
import swu_sandbox from "../images/partners/swu_sandbox.jpg";
import case_of_thammasat from "../images/partners/case_of_thammasat.jpg";
import startup_kku from "../images/partners/startup_kku.jpg";

import kmutt_hatch from "../images/partners/kmutt_hatch.png";
import student_affairs from "../images/partners/student_affairs.png";
import KX from "../images/partners/KX.png";
import GMI from "../images/partners/GMI.png";
import midi from "../images/partners/midi.png";
import science_and_industrial from "../images/partners/science_and_industrial.png";
import CARPE_DIEM from "../images/partners/CARPE_DIEM.jpg";
import GCDC from "../images/partners/GCDC.jpg";
import ubi_kmutt from "../images/partners/ubi_kmutt.png";
import Innovation_experience from "../images/partners/Innovation_experience.png";
import deva from "../images/partners/deva.jpg";

const communityPartners = [
  { name: "Chula Deeptech Association", src: chula_deeptech },
  { name: "KMITL Startup Hub", src: kmitl_startup_hub },
  { name: "Chula Blockchain Society", src: cubs },
  { name: "SWU Sandbox", src: swu_sandbox },
  { name: "Case of Thammasat", src: case_of_thammasat },
  { name: "Startup Club KKU", src: startup_kku },
];

const partners = [
  { name: "KMUTT Hatch", src: kmutt_hatch },
  { name: "Student Affairs KMUTT", src: student_affairs },
  { name: "Knowledge Exchange", src: KX },
  { name: "GMI KMUTT", src: GMI },
  { name: "MIDI KMUTT", src: midi },
  { name: "Science and Industrial Park", src: science_and_industrial },
  { name: "CARPE DIEM", src: CARPE_DIEM },
  { name: "Global Competence Development Centre", src: GCDC },
  { name: "UBI KMUTT", src: ubi_kmutt },
  { name: "Innovation Experience", src: Innovation_experience },
  { name: "DEVA", src: deva },
];

export default function CommunityPartners() {
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
                    <Image src={partner.src} alt={partner.name} className="w-full h-full object-contain transition rounded-[var(--radius-lg)] group-hover:scale-[1.02]" />
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
                    <Image src={partner.src} alt={partner.name} className="w-full h-full object-contain transition rounded-[var(--radius-lg)] group-hover:scale-[1.02]" />
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


