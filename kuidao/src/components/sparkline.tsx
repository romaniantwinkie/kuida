/** Single-series sparkline: one hue, 2px line, end marker. Title gives a hover readout. */
export function Sparkline({ data, label }: { data: number[]; label: string }) {
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const x = (i: number) => (i / (data.length - 1)) * (w - 6) + 3;
  const y = (v: number) => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-[120px]" role="img" aria-label={`${label}: ${data.join(", ")}`}>
      <title>{`${label}: ${data.join(" → ")}`}</title>
      <path d={`${d} L${x(data.length - 1)} ${h} L${x(0)} ${h} Z`} className="fill-brand/10" />
      <path d={d} className="fill-none stroke-brand" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="3" className="fill-brand stroke-surface" strokeWidth="2" />
    </svg>
  );
}
