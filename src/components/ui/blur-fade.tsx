"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView, type UseInViewOptions, type Variants } from "framer-motion";
import { motionDuration, motionEaseOut, motionOffset, usePrefersReducedMotion } from "@/lib/motion";

type MarginType = UseInViewOptions["margin"];

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: MarginType;
  blur?: string;
}

export function BlurFade({
  children,
  className,
  variant,
  duration = motionDuration.medium,
  delay = 0,
  yOffset = motionOffset.reveal,
  inView = false,
  inViewMargin = "-50px",
  blur = "0px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const useBlur = blur !== "0px";
  const defaultVariants: Variants = {
    hidden: useBlur ? { y: yOffset, opacity: 0, filter: `blur(${blur})` } : { y: yOffset, opacity: 0 },
    visible: useBlur ? { y: 0, opacity: 1, filter: "blur(0px)" } : { y: 0, opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: motionEaseOut,
        }}
        className={`blur-fade-target ${className ?? ""}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
