"use client";

import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import GalleryHoverCarousel from "@/components/ui/gallery-hover-carousel";
import { SonarGrid } from "@/components/ui/sonar-grid";
import { useI18n } from "@/components/language-provider";

export default function Home() {
  const { t } = useI18n();

  return (
    <SonarGrid interactive className="min-h-dvh bg-background text-foreground">
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 pb-8 pt-8 sm:px-8 sm:pt-10">
        <header className="flex w-full flex-col items-center">
          <Mark large />
          <div className="mt-4">
            <LangToggle />
          </div>
        </header>
        <GalleryHoverCarousel
          showHeader={false}
          className="mt-8 min-h-0 flex-1 md:mt-10"
          items={[
            {
              id: "agency",
              title: t.home.agencyButton,
              summary: t.home.agencySubtitle,
              url: "/for-agencies",
              image: "/images/agency.jpg",
              imageAlt: t.home.agencyImageAlt,
            },
            {
              id: "caregiver",
              title: t.home.caregiverButton,
              summary: t.home.caregiverSubtitle,
              url: "/for-caregivers",
              image: "/images/caregiver.jpg",
              imageAlt: t.home.caregiverImageAlt,
            },
          ]}
        />
      </div>
    </SonarGrid>
  );
}
