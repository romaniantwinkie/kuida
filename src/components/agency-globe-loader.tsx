"use client";

import dynamic from "next/dynamic";

const AgencyGlobe = dynamic(() => import("@/components/agency-globe").then((mod) => mod.AgencyGlobe), {
  ssr: false,
  loading: () => <div className="h-[78vh] min-h-[36rem] w-full bg-muted" aria-hidden />,
});

export function AgencyGlobeLoader() {
  return <AgencyGlobe />;
}
