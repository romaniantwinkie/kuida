"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/**
 * 21st.dev Aurora Background, adapted for Kuidao.
 * The field is white at the top and black at the bottom. Blue, indigo, and
 * violet ribbons stay in the animated layer and fade out over the white header.
 */
export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative min-h-dvh w-full bg-gradient-to-b from-white to-black text-foreground",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--white:#fff]
            [--black:#000]
            [--transparent:transparent]
            [--blue-300:#93c5fd]
            [--blue-400:#60a5fa]
            [--blue-500:#3b82f6]
            [--indigo-300:#a5b4fc]
            [--violet-200:#ddd6fe]
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--aurora),var(--white-gradient)]
            [background-size:200%,_300%]
            [background-position:50%_50%,50%_50%]
            filter blur-[12px]
            after:absolute after:inset-0 after:animate-aurora after:content-[""]
            after:[background-image:var(--aurora),var(--white-gradient)]
            after:[background-size:200%,_100%]
            after:mix-blend-screen
            pointer-events-none absolute -inset-[10px] opacity-80 will-change-transform`,
            showRadialGradient &&
              "[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_10%,black_24%,black_62%,transparent_90%)]",
          )}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
