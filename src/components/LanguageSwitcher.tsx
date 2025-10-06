"use client";
import { useTransition } from "react";
import { localeCookieName } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/context";
import { MdLanguage } from "react-icons/md";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const { locale } = useI18n();

  function setLang(locale: "en" | "th") {
    startTransition(() => {
      // Set cookie and refresh
      document.cookie = `${localeCookieName}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      window.location.reload();
    });
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {locale !== "en" && <button
        onClick={() => setLang("en")}
        className="px-2 py-1 rounded hover:bg-[color-mix(in_srgb,var(--color-muted-100)_50%,transparent)] flex items-center  gap-1"
        disabled={isPending}
      >
        <MdLanguage />
        <p>EN</p>
      </button>}
      {locale !== "th" && <button
        onClick={() => setLang("th")}
        className="px-2 py-1 rounded hover:bg-[color-mix(in_srgb,var(--color-muted-100)_50%,transparent)] flex items-center  gap-1"
        disabled={isPending}
      >
        <MdLanguage />
        <p>TH</p>
      </button>}
    </div>
  );
}


