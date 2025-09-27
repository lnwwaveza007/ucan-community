import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
