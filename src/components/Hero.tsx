"use client";
import Image from "next/image";
import { motion } from "motion/react";
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
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <p className="inline-block text-xs uppercase tracking-[0.2em] text-white/70 mb-4">University Community for Builders</p>
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold leading-[1.05]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.5, ease: "easeOut" }}
            >
              Think. Experiment. <span className="text-[var(--accent-pink)]">Take Action</span>.
            </motion.h1>
            <motion.p
              className="mt-5 text-white/80 text-lg max-w-xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            >
              UCAN&apos;s Innovation &amp; Entrepreneurship Center connects students, alumni, and mentors to launch ideas through hands-on programs, events, and resources.
            </motion.p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <motion.button
                className="rounded-[999px] px-6 h-12 bg-[var(--accent-pink)] text-white font-semibold hover:bg-[var(--accent-pink-600)]"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Join the Community
              </motion.button>
              <motion.a
                href="#programs"
                className="rounded-[999px] px-6 h-12 grid place-items-center bg-white/10 hover:bg-white/15 border border-white/20 text-white"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                Explore Programs
              </motion.a>
            </div>
            {/* Stats moved to About section */}
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <motion.div
              className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden border border-white/10"
              initial={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <Slideshow images={[{ src: s1 }, { src: s2 }, { src: s3 }, { src: s4 }]} intervalMs={3500} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


