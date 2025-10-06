import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeCookieName, Locale } from "./config";
import { messagesByLocale } from "./dictionaries";

export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get(localeCookieName)?.value;
  if (isLocale(cookieLang)) return cookieLang;
  return defaultLocale;
}

export function getMessages(locale: Locale) {
  return messagesByLocale[locale];
}


