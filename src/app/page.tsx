"use client";

import { useRouter } from "next/navigation";
import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { useI18n } from "@/components/language-provider";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { SonarGrid } from "@/components/ui/sonar-grid";

const buttonClass =
  "h-12 w-full max-w-xs border-border px-6 text-base whitespace-nowrap sm:h-14 sm:max-w-sm sm:text-lg";

export default function Home() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <SonarGrid interactive className="min-h-dvh bg-background text-foreground">
      <div className="relative z-10 min-h-dvh">
        <div className="absolute right-4 top-4 z-20 sm:right-8 sm:top-6">
          <LangToggle />
        </div>
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center px-5 pb-16 pt-16 sm:px-8 sm:pt-10">
          <Mark large />
          <div className="mt-14 flex w-full flex-col items-center gap-4 sm:mt-20">
            <InteractiveHoverButton
              type="button"
              text={t.home.agencyButton}
              className={buttonClass}
              onClick={() => router.push("/for-agencies")}
            />
            <InteractiveHoverButton
              type="button"
              text={t.home.caregiverButton}
              className={buttonClass}
              onClick={() => router.push("/for-caregivers")}
            />
          </div>
        </div>
      </div>
    </SonarGrid>
  );
}
