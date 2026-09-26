import { Suspense } from "react";
import { MessagesScreen } from "@/components/agency/messages-screen";

export default function AgencyMessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesScreen />
    </Suspense>
  );
}
