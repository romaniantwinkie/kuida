"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";

type Mode = "system" | "light" | "dark";
const order: Mode[] = ["light", "dark", "system"];
const icons = { system: Monitor, light: Sun, dark: Moon };
const next = (m: Mode) => order[(order.indexOf(m) + 1) % order.length];
const LABEL: Record<Mode, string> = { light: "Switch to dark mode", dark: "Match device theme", system: "Switch to light mode" };

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
}

export function ThemeToggle({ className, tooltipSide }: { className?: string; tooltipSide?: "top" | "bottom" | "left" }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kuida-theme") as Mode | null;
      if (saved && order.includes(saved)) setMode(saved);
    } catch {}
  }, []);

  function cycle() {
    const n = next(mode);
    setMode(n);
    apply(n);
    try {
      localStorage.setItem("kuida-theme", n);
    } catch {}
  }

  const Icon = icons[mode];
  return (
    <IconButton label={LABEL[mode]} onClick={cycle} className={className} tooltipSide={tooltipSide}>
      <Icon className="size-[18px]" strokeWidth={1.8} />
    </IconButton>
  );
}
