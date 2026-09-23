import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "KUIDAO",
  description:
    "Software for home care, nurse registry, and home health agencies staffing their cases, and for caregivers finding shifts. Starts in Florida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
