import type { Metadata, Viewport } from "next";
import { appearanceScript } from "@/lib/appearance-script";
import { fontCss, fontHref } from "@/lib/fonts";
import "./palettes.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kuida — fill home-care shifts in minutes", template: "%s · Kuida" },
  description:
    "Explainable caregiver matching and automated, bilingual shift outreach for licensed home care agencies and nurse registries across the US.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d11" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-palette="slate" data-font="modern" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link id="font-modern" href={fontHref("modern")} rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: fontCss }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
