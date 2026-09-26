import React, { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange" | "grey";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap = {
  blue: { base: 220, spread: 200, saturation: 100, lightness: 70 },
  purple: { base: 280, spread: 300, saturation: 100, lightness: 70 },
  green: { base: 120, spread: 200, saturation: 100, lightness: 70 },
  red: { base: 0, spread: 200, saturation: 100, lightness: 70 },
  orange: { base: 30, spread: 200, saturation: 100, lightness: 70 },
  // Neutral spotlight: hue is unused when saturation is 0.
  grey: { base: 0, spread: 0, saturation: 0, lightness: 82 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;

      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const { base, spread, saturation, lightness } = glowColorMap[glowColor];

  const getSizeClasses = () => {
    if (customSize) {
      return "";
    }
    return sizeMap[size];
  };

  const getInlineStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      ["--base" as string]: base,
      ["--spread" as string]: spread,
      ["--saturation" as string]: saturation,
      ["--lightness" as string]: lightness,
      ["--radius" as string]: "14",
      ["--border" as string]: "3",
      ["--backdrop" as string]: "hsl(0 0% 100% / 0.96)",
      ["--backup-border" as string]: "var(--backdrop)",
      ["--size" as string]: "200",
      ["--outer" as string]: "1",
      ["--border-size" as string]: "calc(var(--border, 2) * 1px)",
      ["--spotlight-size" as string]: "calc(var(--size, 150) * 1px)",
      ["--hue" as string]: "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
      ["--bg-spot-opacity" as string]: glowColor === "grey" ? "0.85" : "0.1",
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: "var(--backdrop, transparent)",
      backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
      backgroundPosition: "50% 50%",
      backgroundAttachment: "fixed",
      border: "var(--border-size) solid var(--backup-border)",
      position: "relative",
      touchAction: "none",
    };

    if (width !== undefined) {
      baseStyles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === "number" ? `${height}px` : height;
    }

    return baseStyles;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }

    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(1.15);
    }

    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 0% 100% / var(--border-light-opacity, 0.85)), transparent 100%
      );
    }

    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }

    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? "aspect-[3/4]" : ""}
          relative
          grid
          grid-rows-[1fr_auto]
          gap-4
          rounded-2xl
          p-4
          shadow-md
          backdrop-blur-[5px]
          ${className}
        `}
      >
        <div data-glow />
        {children}
      </div>
    </>
  );
};

export { GlowCard };
