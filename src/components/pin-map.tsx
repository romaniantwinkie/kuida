export function PinMap() {
  return (
    <svg viewBox="0 0 280 160" className="h-40 w-full" aria-hidden="true">
      <rect width="280" height="160" className="fill-accent" />
      <path
        d="M0 110 C40 96 70 128 110 118 C150 108 170 90 210 102 C240 110 260 96 280 104 L280 160 L0 160 Z"
        className="fill-border"
      />
      <path
        d="M0 40 C50 52 80 28 130 38 C180 48 210 22 280 34 L280 0 L0 0 Z"
        className="fill-secondary"
        opacity="0.8"
      />
      <circle cx="92" cy="72" r="16" className="fill-primary" opacity="0.16" />
      <circle cx="148" cy="58" r="12" className="fill-primary" opacity="0.16" />
      <circle cx="186" cy="88" r="14" className="fill-primary" opacity="0.16" />
      <circle cx="92" cy="72" r="5" className="fill-primary" />
      <circle cx="148" cy="58" r="5" className="fill-primary" />
      <circle cx="186" cy="88" r="5" className="fill-primary" />
      <circle cx="148" cy="58" r="2" className="fill-background" />
    </svg>
  );
}
