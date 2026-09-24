"use client";

import { useRouter } from "next/navigation";
import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";
import { SonarGrid } from "@/components/ui/sonar-grid";
import { WelcomeScreen } from "@/components/ui/welcome-screen";

export default function Home() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <SonarGrid interactive className="min-h-dvh bg-background text-foreground">
      <div className="relative z-10 min-h-dvh">
        <div className="absolute right-4 top-4 z-20 sm:right-8 sm:top-6">
          <LangToggle />
        </div>
        <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center px-5 pb-12 pt-16 sm:px-8 sm:pt-10">
          <Mark large />
          <div className="mt-8 grid w-full grid-cols-1 items-stretch gap-5 sm:mt-10 md:grid-cols-2">
            <WelcomeScreen
              className="min-h-[32rem]"
              imageUrl="/roles/agency.jpg"
              imageAlt={t.home.agencyImageAlt}
              title={t.home.agencyButton}
              buttonText={t.home.agencyCta}
              onButtonClick={() => router.push("/for-agencies")}
            />
            <WelcomeScreen
              className="min-h-[32rem]"
              imageUrl="/roles/caregiver.jpg"
              imageAlt={t.home.caregiverImageAlt}
              title={t.home.caregiverButton}
              buttonText={t.home.caregiverCta}
              onButtonClick={() => router.push("/for-caregivers")}
            />
          </div>
        </div>
      </div>
    </SonarGrid>
  );
}
