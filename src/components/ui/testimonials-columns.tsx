"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 18,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      <motion.div
        animate={reduce ? undefined : { translateY: "-50%" }}
        transition={
          reduce
            ? undefined
            : {
                duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }
        }
        className="flex flex-col gap-4 bg-background pb-4 motion-reduce:transform-none"
      >
        {[0, 1].map((copy) => (
          <React.Fragment key={copy}>
            {testimonials.map((item) => (
              <figure key={`${copy}-${item.initials}`} className="w-full max-w-xs rounded-3xl border border-border bg-card p-6 shadow-sm">
                <blockquote className="text-sm leading-relaxed text-foreground">{item.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-2">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background"
                    aria-hidden="true"
                  >
                    {item.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium leading-5 tracking-tight">{item.name}</span>
                    <span className="text-sm leading-5 tracking-tight text-muted-foreground">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsColumns({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) {
  const size = Math.ceil(testimonials.length / 3);
  const columns = [testimonials.slice(0, size), testimonials.slice(size, size * 2), testimonials.slice(size * 2)];

  return (
    <div
      className={cn(
        "mx-auto flex max-h-[28rem] justify-center gap-4 overflow-hidden lg:max-h-[36rem] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      {columns.map((column, index) => (
        <TestimonialsColumn
          key={index}
          testimonials={column}
          duration={16 + index * 3}
          className={index === 1 ? "hidden md:block" : index === 2 ? "hidden lg:block" : undefined}
        />
      ))}
    </div>
  );
}
