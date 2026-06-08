import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { organizationJsonLd } from "@/lib/jsonld";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ignitetradersbd.com";
// Staging deployments set NOINDEX=1 — keeps the site out of search until launch.
const NOINDEX = process.env.NOINDEX === "1";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IGNITE — Protective Wear for Pharma Production",
    template: "%s | IGNITE",
  },
  description:
    "IGNITE delivers gowns, gloves, masks, shoes and lab safety gear — built for pharmaceutical production lines. B2B supply across Bangladesh.",
  keywords: [
    "protective wear",
    "pharmaceutical safety",
    "B2B safety supply",
    "Dhaka",
    "Bangladesh",
    "PPE supplier",
    "clean room garments",
    "production line PPE",
  ],
  authors: [{ name: "Ignite Traders" }],
  creator: "Ignite Traders",
  publisher: "Ignite Traders",
  applicationName: "IGNITE",
  category: "Business",
  openGraph: {
    type: "website",
    siteName: "IGNITE",
    title: "IGNITE — Protective Wear for Pharma Production",
    description:
      "IGNITE delivers gowns, gloves, masks, shoes and lab safety gear — built for pharmaceutical production lines.",
    locale: "en_BD",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "IGNITE — Protective Wear for Pharma Production",
    description:
      "IGNITE delivers gowns, gloves, masks, shoes and lab safety gear — built for pharmaceutical production lines.",
  },
  robots: NOINDEX
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f2a36" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
  (function(){
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = stored || (prefersDark ? 'dark' : 'light');
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
