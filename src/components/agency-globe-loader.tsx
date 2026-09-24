"use client";

import dynamic from "next/dynamic";

const AgencyGlobe = dynamic(() => import("@/components/agency-globe").then((mod) => mod.AgencyGlobe), {
  ssr: false,
  loading: () => <div className="h-[22rem] w-full bg-muted sm:h-[28rem]" aria-hidden />,
});

export function AgencyGlobeLoader() {
  return <AgencyGlobe />;
}
