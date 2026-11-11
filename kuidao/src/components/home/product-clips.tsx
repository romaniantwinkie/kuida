"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

export type Clip = { id: string; title: string; caption: string; wide?: boolean };

/** Short silent screen recordings of the real product. Autoplay only in view, never under reduced motion. */
function ClipCard({ clip }: { clip: Clip }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    const v = ref.current;
    if (!v || r) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure className={cn("group overflow-hidden rounded-2xl border border-line bg-surface", clip.wide && "md:col-span-2")}>
      <div className="relative aspect-[16/10] bg-surface-2">
        <video
          ref={ref}
          src={`/clips/${clip.id}.mp4`}
          poster={`/clips/${clip.id}.jpg`}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="size-full object-cover object-top"
          aria-label={clip.title}
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause: ${clip.title}` : `Play: ${clip.title}`}
          className={cn(
            "absolute bottom-3 right-3 grid size-11 place-items-center rounded-full border border-line bg-surface/95 text-ink shadow-card transition-opacity",
            !reduced && playing && "opacity-0 focus-visible:opacity-100 group-hover:opacity-100",
          )}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
      </div>
      <figcaption className="px-5 py-4">
        <p className="font-semibold">{clip.title}</p>
        <p className="mt-1 text-sm text-muted">{clip.caption}</p>
      </figcaption>
    </figure>
  );
}

export function ProductClips({ clips }: { clips: Clip[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {clips.map((c) => (
        <ClipCard key={c.id} clip={c} />
      ))}
    </div>
  );
}
