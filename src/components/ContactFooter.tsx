"use client";

import Image from "next/image"
import logo from "@/images/icon-no-bg.png"
import { SlSocialFacebook, SlSocialInstagram, SlSocialLinkedin } from "react-icons/sl";
import { useI18n } from "@/lib/i18n/context";

export default function ContactFooter() {
  const { messages } = useI18n();
  return (
    <footer id="contact" className="py-2 border-t border-[var(--color-muted-300)] bg-[var(--muted-100)] dark:bg-[color-mix(in_srgb,var(--color-card-dark)_84%,transparent)]">
      <div className="container-page px-4 flex flex-row items-center gap-4 text-center justify-between">
        <Image src={logo} alt={messages.footer.logoAlt} width={200} height={200} />
        <div className="flex gap-3">
          {[{ name: 'FB', 'link': 'https://www.facebook.com/profile.php?id=100090000707117' },
          { name: 'IG', 'link': 'https://www.instagram.com/lifeat.ucan/?hl=en' }, 
          { name: 'IN', 'link': 'https://www.linkedin.com/in/ucan-community-14115b386/' }].map((s) => (
            <a key={s.name} href={s.link} className="h-9 w-9 grid place-items-center rounded-[10px] border border-[var(--color-muted-300)] bg-white/70 dark:bg-white/10 hover:bg-white text-[var(--brand-blue-800)] dark:text-white">
              {s.name === 'IG' ? <SlSocialInstagram /> : s.name === 'IN' ? <SlSocialLinkedin /> : <SlSocialFacebook />}
            </a>
          ))}
        </div>
      </div>
      <div className="w-full text-xs text-[var(--color-muted-700)] text-center">© {new Date().getFullYear()} {messages.footer.copyrightSuffix}</div>
    </footer>
  );
}


