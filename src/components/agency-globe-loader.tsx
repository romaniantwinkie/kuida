"use client";

import dynamic from "next/dynamic";

const AgencyGlobe = dynamic(() => import("@/components/agency-globe").then((mod) => mod.AgencyGlobe), {
  ssr: false,
  loading: () => <div className="mx-auto h-80 w-full max-w-3xl bg-muted sm:h-96" aria-hidden />,
});

export function AgencyGlobeLoader() {
  return <AgencyGlobe />;
}
