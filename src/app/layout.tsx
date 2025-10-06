import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { getLocaleFromCookie, getMessages } from "@/lib/i18n/server";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UCAN Community",
    template: "UCAN Community",
  },
  description:
    "Community-driven hub for innovators, founders, and creators at UCAN. Programs, events, resources, and mentorship.",
  metadataBase: new URL("https://ucan.example.edu"),
  openGraph: {
    title: "UCAN Community",
    description:
      "Join a community of 500+ builders. Programs, events, resources, and mentorship.",
    url: "https://ucan.example.edu",
    siteName: "UCAN Community",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UCAN Community",
    description:
      "Join a community of 500+ builders. Programs, events, resources, and mentorship.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookie();
  const messages = getMessages(locale);
  return (
    <html lang={locale}>
      <body className={`${ibmPlexSansThai.variable} ${geistMono.variable} antialiased`}>
        <I18nProvider locale={locale} messages={messages}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
