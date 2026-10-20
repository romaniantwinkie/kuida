"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface InteractiveTravelCardProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition?: string;
  actionText: string;
  href: string;
  className?: string;
}

/**
 * 21st.dev travel card with a hover tilt. The corner arrow and subtitle are
 * omitted. The whole card is one link.
 */
export const InteractiveTravelCard = React.forwardRef<
  HTMLAnchorElement,
  InteractiveTravelCardProps
>(({ title, imageUrl, imageAlt, imagePosition = "center", actionText, href, className }, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["10.5deg", "-10.5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10.5deg", "10.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      className={cn(
        "block w-80 max-w-full cursor-pointer [perspective:1000px] outline-none",
        className,
      )}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-[26rem] w-full rounded-2xl border border-border bg-card shadow-md"
      >
        <div
          style={{
            transform: "translateZ(50px)",
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] overflow-hidden rounded-xl"
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />
          <div className="relative flex h-full flex-col items-center justify-between p-4 text-center">
            <motion.h2
              style={{ transform: "translateZ(50px)" }}
              className="w-full text-center text-2xl font-bold text-white"
            >
              {title}
            </motion.h2>
            <motion.span
              style={{ transform: "translateZ(40px)" }}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-3 text-center text-lg font-semibold leading-tight text-primary-foreground"
            >
              {actionText}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});
InteractiveTravelCard.displayName = "InteractiveTravelCard";
