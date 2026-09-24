"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  imageUrl: string;
  imageAlt: string;
  title: React.ReactNode;
  description?: string;
  buttonText: string;
  onButtonClick: () => void;
  secondaryActionText?: string;
  onSecondaryActionClick?: () => void;
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
  onButtonClick,
  secondaryActionText,
  onSecondaryActionClick,
  className,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const imageVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        duration: 0.8,
      },
    },
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-between overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <motion.div
        className="relative w-full shrink-0"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className="h-56 w-full object-cover sm:h-64"
          style={{ clipPath: "ellipse(100% 60% at 50% 40%)" }}
        />
      </motion.div>

      <motion.div
        className="flex flex-1 flex-col items-center justify-center space-y-4 px-6 py-4 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tight text-foreground"
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        {description ? (
          <motion.p className="max-w-md text-muted-foreground" variants={itemVariants}>
            {description}
          </motion.p>
        ) : null}
      </motion.div>

      <motion.div
        className="w-full space-y-4 p-6 pt-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Button
            onClick={onButtonClick}
            className="h-12 w-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {buttonText}
          </Button>
        </motion.div>

        {secondaryActionText && onSecondaryActionClick ? (
          <motion.div variants={itemVariants} className="text-center">
            <Button
              variant="link"
              onClick={onSecondaryActionClick}
              className="text-sm text-muted-foreground"
            >
              {secondaryActionText}
            </Button>
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
};
