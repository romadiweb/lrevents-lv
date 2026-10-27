import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/layout/dialog.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LR Events — autosporta pasākumi Latvijā",
  manifest: "/site.webmanifest?v=20261027-2",
  icons: {
    icon: [
      { url: "/favicon.svg?v=20261027-2", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-96x96.png?v=20261027-2", type: "image/png", sizes: "96x96" },
    ],
    apple: { url: "/apple-touch-icon.png?v=20261027-2", sizes: "180x180", type: "image/png" },
  },
  description:
    "Auto, moto un sporta pasākumi Latvijā. Reģistrācija, nolikumi un rezultāti.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="lv"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning>
        <Suspense fallback={null}><SiteChrome header={<SiteHeader />} footer={<Suspense fallback={null}><SiteFooter /></Suspense>} scroll={<ScrollToTop />}>{children}</SiteChrome></Suspense>
      </body>
    </html>
  );
}
