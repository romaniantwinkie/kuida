"use client";

import { ArrowRight } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import Link from "next/link";
import React from "react";

const MotionLink = motion.create(Link);

export interface InteractiveHoverLinkItem {
  heading: string;
  subheading: string;
  href: string;
}

interface InteractiveHoverLinksProps {
  links: InteractiveHoverLinkItem[];
  className?: string;
}

/** Text-only Interactive Hover Links. Floating preview images are not part of this chooser. */
export function InteractiveHoverLinks({ links, className }: InteractiveHoverLinksProps) {
  return (
    <MotionConfig reducedMotion="user">
      <section className={className ?? "w-full"}>
        <div className="mx-auto w-full max-w-5xl">
          {links.map((link) => (
            <HoverLink key={link.href} {...link} />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}

function HoverLink({ heading, subheading, href }: InteractiveHoverLinkItem) {
  return (
    <MotionLink
      href={href}
      initial="initial"
      whileHover="whileHover"
      whileFocus="whileHover"
      className="group relative flex items-center justify-between gap-4 border-b-2 border-muted py-6 outline-none transition-colors duration-500 hover:border-foreground focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring md:py-8"
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -16 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.075,
            delayChildren: 0.25,
          }}
          className="relative z-10 block text-3xl font-bold text-muted-foreground transition-colors duration-500 group-hover:text-foreground group-focus-visible:text-foreground sm:text-4xl md:text-5xl"
        >
          {heading.split("").map((letter, index) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 16 },
              }}
              transition={{ type: "spring" }}
              className="inline-block"
              key={`${letter}-${index}`}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.span>
        <span className="relative z-10 mt-2 block text-base text-muted-foreground transition-colors duration-500 group-hover:text-foreground group-focus-visible:text-foreground md:text-lg">
          {subheading}
        </span>
      </div>

      <div className="overflow-hidden">
        <motion.div
          variants={{
            initial: { x: "100%", opacity: 0 },
            whileHover: { x: "0%", opacity: 1 },
          }}
          transition={{ type: "spring" }}
          className="relative z-10 p-4"
        >
          <ArrowRight className="size-8 text-foreground md:size-12" aria-hidden="true" />
        </motion.div>
      </div>
    </MotionLink>
  );
}
