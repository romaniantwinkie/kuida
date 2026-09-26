"use client";

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { motionOffset, motionTween, usePrefersReducedMotion } from "@/lib/motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  maxVisible?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 1000, maxVisible }: AnimatedListProps) => {
    const childrenArray = React.Children.toArray(children);
    const cap = maxVisible ?? childrenArray.length;
    const [index, setIndex] = useState(0);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
      if (reduced || childrenArray.length === 0) return;
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
      }, delay);
      return () => clearInterval(interval);
    }, [childrenArray.length, delay, reduced]);

    const itemsToShow = useMemo(() => {
      if (childrenArray.length === 0) return [];
      const count = Math.min(cap, childrenArray.length);
      if (reduced || maxVisible != null) {
        const start = reduced ? 0 : index % childrenArray.length;
        return Array.from({ length: count }, (_, offset) => childrenArray[(start + offset) % childrenArray.length]);
      }
      return childrenArray.slice(0, index + 1).reverse().slice(0, cap);
    }, [cap, childrenArray, index, maxVisible, reduced]);

    return (
      <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
        <AnimatePresence initial={false}>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as ReactElement).key} reduced={reduced}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({
  children,
  reduced = false,
}: {
  children: React.ReactNode;
  reduced?: boolean;
}) {
  if (reduced) {
    return <div className="mx-auto w-full">{children}</div>;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: motionOffset.swap }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -motionOffset.swap }}
      transition={motionTween("medium")}
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}
