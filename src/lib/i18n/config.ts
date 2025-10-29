export type Locale = "en" | "th";

export const locales: readonly Locale[] = ["en", "th"] as const;

export const defaultLocale: Locale = "th";

export const localeCookieName = "ucan_lang";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "th";
}


