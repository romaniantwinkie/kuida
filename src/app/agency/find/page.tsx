import { Suspense } from "react";
import { FindScreen } from "@/components/agency/screens";

export default function AgencyFindPage() {
  return (
    <Suspense>
      <FindScreen />
    </Suspense>
  );
}
