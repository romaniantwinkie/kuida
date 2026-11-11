/** "[01] · Product". Numbers mark the page's real reading order. */
export function SectionLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-2">
      <span className="font-mono text-brand">[{String(n).padStart(2, "0")}]</span>
      <span aria-hidden="true">·</span>
      {children}
    </p>
  );
}
