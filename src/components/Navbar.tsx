"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import logo from "@/images/icon-no-bg.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";

export default function Navbar() {
  const { messages } = useI18n();
  return (
    <header className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--color-muted-300)_40%,transparent)] bg-[color-mix(in_srgb,var(--background)_86%,transparent)] backdrop-blur-md">
      <div className="container-page px-4 py-3 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-3">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            <Image src={logo} alt="Logo" width={120} height={120} />
          </motion.div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {[
            { href: "#programs", label: messages.nav.programs },
            { href: "#events", label: messages.nav.events },
            // { href: "#resources", label: "Resources" },
            // { href: "#blog", label: "Blog" },
            { href: "#community", label: messages.nav.community },
            { href: "#contact", label: messages.nav.contact },
          ].map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="hover:opacity-80"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Link href="/register" className="rounded-[999px] px-4 h-10 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] flex items-center">{messages.nav.joinNow}</Link>
          </motion.div>
          <LanguageSwitcher />
        </div>
        {/* Mobile menu */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer rounded-[var(--radius-md)] p-2 hover:bg-[color-mix(in_srgb,var(--color-muted-100)_50%,transparent)]">
            <span className="sr-only">{messages.nav.menu}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </summary>
          <div className="absolute right-0 mt-2 w-56 glass-card rounded-[var(--radius-lg)] p-3 flex flex-col gap-1">
            {[
              { href: "#programs", label: messages.nav.programs },
              { href: "#events", label: messages.nav.events },
              // { href: "#resources", label: "Resources" },
              // { href: "#blog", label: "Blog" },
              { href: "#community", label: messages.nav.community },
              { href: "#contact", label: messages.nav.contact },
            ].map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-muted-100)]"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link href="/register" className="mt-2 rounded-[999px] px-4 h-10 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] flex items-center">{messages.nav.joinNow}</Link>
            </motion.div>
          </div>
        </details>
      </div>
    </header>
  );
}


