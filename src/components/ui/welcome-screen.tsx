"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { motionOffset, motionTween, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  imageUrl: string;
  imageAlt: string;
  title: React.ReactNode;
  description?: string;
  buttonText: string;
  href: string;
  /** CSS object-position for the hero crop. Defaults to center. */
  imagePosition?: string;
  className?: string;
}

/**
 * 21st.dev onboarding welcome screen, adapted for the Kuidao chooser.
 * Empty descriptions are not rendered. The ellipse crop on the photo is kept.
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
  buttonText,
  href,
  imagePosition = "center",
  className,
}) => {
  const reduced = usePrefersReducedMotion();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduced ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: reduced ? 0 : motionOffset.reveal, opacity: reduced ? 1 : 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: motionTween("medium"),
    },
  };

  const imageVariants = {
    hidden: { y: reduced ? 0 : motionOffset.reveal, opacity: reduced ? 1 : 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: motionTween("long"),
    },
  };

  return (
    <Link
      href={href}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
      className={cn(
        "welcome-tile relative block rounded-3xl outline-none focus-visible:outline-none",
        className,
      )}
    >
      <div className="flex w-full flex-col items-start overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">
      <motion.div
        className="relative w-full shrink-0"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-80 w-full object-cover sm:h-96"
          style={{
            clipPath: "ellipse(100% 60% at 50% 40%)",
            objectPosition: imagePosition,
          }}
        />
      </motion.div>

      <motion.div
        className="flex w-full flex-col items-center gap-4 px-6 pb-6 pt-3 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl font-normal tracking-tight text-foreground"
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        {description ? (
          <motion.p className="max-w-md text-muted-foreground" variants={itemVariants}>
            {description}
          </motion.p>
        ) : null}
        <motion.span
          variants={itemVariants}
          className="flex min-h-14 w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-center text-2xl font-normal leading-tight text-primary-foreground shadow"
        >
          {buttonText}
        </motion.span>
      </motion.div>
      </div>
    </Link>
  );
};
