"use client";

import { usePathname } from "next/navigation";
import { Info } from "lucide-react";

const NOT_LIVE_YET = ["/app/messages", "/app/copilot", "/app/compliance"];

/** For signed-in offices: marks pages that still show sample data until they connect to the account. */
export function SampleDataBanner() {
  const path = usePathname();
  if (!NOT_LIVE_YET.some((p) => path.startsWith(p))) return null;
  return (
    <p className="mb-6 flex items-start gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm">
      <Info className="mt-0.5 size-4 shrink-0 text-muted" />
      <span>
        <b className="font-semibold">Sample data.</b> This page connects to your office in an upcoming update. Your shifts and team are live now.
      </span>
    </p>
  );
}
