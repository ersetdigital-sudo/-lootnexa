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
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#org`,
        name: site.name,
        url: site.url,
        description: site.description,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        url: site.url,
        name: site.name,
        inLanguage: "id-ID",
        publisher: { "@id": `${site.url}/#org` },
      },
      {
        "@type": "ItemList",
        name: "Game yang tersedia di LOOTNEXA",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Top Up Mobile Legends", url: `${site.url}/top-up/mobile-legends` },
          { "@type": "ListItem", position: 2, name: "Top Up Free Fire", url: `${site.url}/top-up/free-fire` },
          { "@type": "ListItem", position: 3, name: "Top Up PUBG Mobile", url: `${site.url}/top-up/pubg-mobile` },
          { "@type": "ListItem", position: 4, name: "Top Up Call of Duty: Mobile", url: `${site.url}/top-up/call-of-duty-mobile` },
          { "@type": "ListItem", position: 5, name: "Top Up Magic Chess: Go Go", url: `${site.url}/top-up/magic-chess-go-go` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Bagaimana cara top up game di LOOTNEXA?", acceptedAnswer: { "@type": "Answer", text: "Pilih game, masukkan User ID (dan Zone ID bila diperlukan), pilih nominal, lalu lanjutkan ke pembayaran." } },
          { "@type": "Question", name: "Apakah top up membutuhkan password?", acceptedAnswer: { "@type": "Answer", text: "Tidak. LOOTNEXA tidak meminta password, OTP, PIN, maupun akses login ke akun game." } },
          { "@type": "Question", name: "Game apa saja yang tersedia di LOOTNEXA?", acceptedAnswer: { "@type": "Answer", text: "Mobile Legends, Free Fire, PUBG Mobile, Call of Duty Mobile, dan Magic Chess Go Go." } },
        ],
      },
    ],
  };

  return (
    <html lang="id" className={`${dmSans.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-full flex flex-col">
        <meta name="theme-color" content={site.themeColor} />
        {children}
      </body>
    </html>
  );
}
