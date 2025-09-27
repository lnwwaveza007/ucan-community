import Image from "next/image";
import bgImage from "@/images/landing-page/background.png";
import Slideshow from "@/components/Slideshow";
import s1 from "@/images/slide-show/test1.jpg";
import s2 from "@/images/slide-show/test2.jpg";
import s3 from "@/images/slide-show/test3.jpg";
import s4 from "@/images/slide-show/test4.jpg";

export default function Hero() {
  return (
    <section className="relative text-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-hero-gradient" />
      </div>
      <div className="container-page px-4 py-20 md:py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block text-xs uppercase tracking-[0.2em] text-white/70 mb-4">University Community for Builders</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05]">
              Think. Experiment. <span className="text-[var(--accent-pink)]">Take Action</span>.
            </h1>
            <p className="mt-5 text-white/80 text-lg max-w-xl">
              UCAN&apos;s Innovation &amp; Entrepreneurship Center connects students, alumni, and mentors to launch ideas through hands-on programs, events, and resources.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="rounded-[999px] px-6 h-12 bg-[var(--accent-pink)] text-white font-semibold hover:bg-[var(--accent-pink-600)]">Join the Community</button>
              <a href="#programs" className="rounded-[999px] px-6 h-12 grid place-items-center bg-white/10 hover:bg-white/15 border border-white/20 text-white">Explore Programs</a>
            </div>
            {/* Stats moved to About section */}
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden border border-white/10">
              <Slideshow images={[{ src: s1 }, { src: s2 }, { src: s3 }, { src: s4 }]} intervalMs={3500} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


