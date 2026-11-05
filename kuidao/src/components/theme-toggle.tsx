"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Mode = "system" | "light" | "dark";
const order: Mode[] = ["system", "light", "dark"];
const icons = { system: Monitor, light: Sun, dark: Moon };

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kuida-theme") as Mode | null;
      if (saved && order.includes(saved)) setMode(saved);
    } catch {}
  }, []);

  function cycle() {
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    apply(next);
    try {
      localStorage.setItem("kuida-theme", next);
    } catch {}
  }

  const Icon = icons[mode];
  return (
    <button
      type="button"
      onClick={cycle}
      className={cn("inline-grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-ink", className)}
      aria-label={`Theme: ${mode}. Switch theme`}
      title={`Theme: ${mode}`}
    >
      <Icon className="size-[18px]" strokeWidth={1.8} />
    </button>
  );
}

/** Inline, pre-paint script so the saved theme applies before hydration. */
export const themeScript = `try{var t=localStorage.getItem("kuida-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
