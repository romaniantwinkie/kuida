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

  const tile = "w-full max-w-sm shrink-0 min-[880px]:w-96";

  return (
    <SonarGrid interactive className="min-h-dvh bg-background text-foreground">
      <div className="relative z-10 min-h-dvh">
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20">
          <div className="flex justify-center px-5 pt-5 sm:pt-6 [&_svg]:h-12 [&_svg]:sm:h-14">
            <div className="pointer-events-auto">
              <Mark large />
            </div>
          </div>
          <div className="pointer-events-auto absolute right-4 top-4 sm:right-8 sm:top-6">
            <LangToggle />
          </div>
        </header>
        <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-20">
          <div className="flex w-full flex-col items-center">
            <h1 className="mb-6 text-center text-5xl font-bold tracking-tight text-foreground sm:mb-8">
              {t.home.title}
            </h1>
            <div className="flex w-full flex-col items-center justify-center gap-6 min-[880px]:w-auto min-[880px]:flex-row">
            <WelcomeScreen
              className={tile}
              imageUrl="/roles/agency.jpg"
              imageAlt={t.home.agencyImageAlt}
              title={t.home.agencyButton}
              buttonText={t.home.agencyCta}
              onButtonClick={() => router.push("/for-agencies")}
            />
            <WelcomeScreen
              className={tile}
              imageUrl="/roles/caregiver.jpg"
              imageAlt={t.home.caregiverImageAlt}
              imagePosition="center top"
              title={t.home.caregiverButton}
              buttonText={t.home.caregiverCta}
              onButtonClick={() => router.push("/for-caregivers")}
            />
            </div>
          </div>
        </div>
      </div>
    </SonarGrid>
  );
}
