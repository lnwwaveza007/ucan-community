"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@/images/icon-no-bg.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[color-mix(in_srgb,var(--color-muted-300)_40%,transparent)] bg-[color-mix(in_srgb,var(--background)_86%,transparent)] backdrop-blur-md">
      <div className="container-page px-4 py-3 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-3">
          <Image src={logo} alt="Logo" width={100} height={100} />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#programs" className="hover:opacity-80">Programs</a>
          <a href="#events" className="hover:opacity-80">Events</a>
          {/* <a href="#resources" className="hover:opacity-80">Resources</a> */}
          {/* <a href="#blog" className="hover:opacity-80">Blog</a> */}
          <a href="#community" className="hover:opacity-80">Community</a>
          <a href="#contact" className="hover:opacity-80">Contact</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/register" className="rounded-[999px] px-4 h-10 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] flex items-center">Join Now</Link>
        </div>
        {/* Mobile menu */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer rounded-[var(--radius-md)] p-2 hover:bg-[color-mix(in_srgb,var(--color-muted-100)_50%,transparent)]">
            <span className="sr-only">Menu</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </summary>
          <div className="absolute right-0 mt-2 w-56 glass-card rounded-[var(--radius-lg)] p-3 flex flex-col gap-1">
            <a href="#programs" className="px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-muted-100)]">Programs</a>
            <a href="#events" className="px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-muted-100)]">Events</a>
            {/* <a href="#resources" className="px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-muted-100)]">Resources</a> */}
            {/* <a href="#blog" className="px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-muted-100)]">Blog</a> */}
            <a href="#community" className="px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-muted-100)]">Community</a>
            <a href="#contact" className="px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-muted-100)]">Contact</a>
            <Link href="/register" className="mt-2 rounded-[999px] px-4 h-10 bg-[var(--color-accent-orange)] text-white font-medium hover:bg-[var(--color-accent-orange-600)] flex items-center">Join Now</Link>
          </div>
        </details>
      </div>
    </header>
  );
}


