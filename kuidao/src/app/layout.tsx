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
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b100f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-palette="teal" data-font="editorial" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link id="font-editorial" href={fontHref("editorial")} rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: fontCss }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
