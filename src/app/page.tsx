"use client";

import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";
import { InteractiveHoverLinks } from "@/components/ui/interactive-hover-links";
import { SonarGrid } from "@/components/ui/sonar-grid";

export default function Home() {
  const { t } = useI18n();

  return (
    <SonarGrid interactive className="min-h-dvh bg-background text-foreground">
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <header className="flex w-full flex-col items-center">
          <Mark large />
          <div className="mt-4">
            <LangToggle />
          </div>
        </header>
        <InteractiveHoverLinks
          className="mt-12 w-full sm:mt-16"
          links={[
            {
              heading: t.home.agencySubtitle,
              subheading: t.home.agencyButton,
              href: "/for-agencies",
            },
            {
              heading: t.home.caregiverSubtitle,
              subheading: t.home.caregiverButton,
              href: "/for-caregivers",
            },
          ]}
        />
      </div>
    </SonarGrid>
  );
}
