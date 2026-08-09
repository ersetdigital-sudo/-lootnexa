import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";

const dmSans = localFont({
  src: [
    { path: "../public/fonts/dmsans-regular.ttf", weight: "400" },
    { path: "../public/fonts/dmsans-medium.ttf", weight: "500" },
    { path: "../public/fonts/dmsans-semibold.ttf", weight: "600" },
    { path: "../public/fonts/dmsans-bold.ttf", weight: "700" },
    { path: "../public/fonts/dmsans-extrabold.ttf", weight: "800" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = localFont({
  src: [
    { path: "../public/fonts/manrope-wght--medium.ttf", weight: "500" },
    { path: "../public/fonts/manrope-wght--semibold.ttf", weight: "600" },
    { path: "../public/fonts/manrope-wght--bold.ttf", weight: "700" },
    { path: "../public/fonts/manrope-wght--extrabold.ttf", weight: "800" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "LOOTNEXA — Top Up Game Tanpa Password",
    template: "%s — LOOTNEXA",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: "LOOTNEXA — Top Up Game Tanpa Password",
    description: site.shortDescription,
    url: site.url,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: "LOOTNEXA — Top Up Game Tanpa Password" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOOTNEXA — Top Up Game Tanpa Password",
    description: site.shortDescription,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${dmSans.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <meta name="theme-color" content={site.themeColor} />
        {children}
      </body>
    </html>
  );
}
