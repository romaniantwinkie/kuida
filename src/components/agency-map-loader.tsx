"use client";

import dynamic from "next/dynamic";

const AgencyMap = dynamic(() => import("@/components/agency-map").then((mod) => mod.AgencyMap), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted" aria-hidden />,
});

export function AgencyMapLoader() {
  return <AgencyMap />;
}
