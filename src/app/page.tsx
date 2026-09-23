"use client";

import { useRouter } from "next/navigation";
import { LangToggle } from "@/components/lang-toggle";
import { Mark } from "@/components/mark";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { SonarGrid } from "@/components/ui/sonar-grid";
import { useI18n } from "@/components/language-provider";

export default function Home() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <SonarGrid interactive className="h-dvh bg-background text-foreground">
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-col items-center gap-4 px-5 pt-8">
          <Mark />
          <LangToggle />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 pb-16">
          <InteractiveHoverButton
            text={t.home.agencyButton}
            className="w-80 [&>span]:block [&>span]:w-full [&>span]:text-center"
            onClick={() => router.push("/for-agencies")}
          />
          <InteractiveHoverButton
            text={t.home.caregiverButton}
            className="w-80 [&>span]:block [&>span]:w-full [&>span]:text-center"
            onClick={() => router.push("/for-caregivers")}
          />
        </div>
      </div>
    </SonarGrid>
  );
}
