import { Suspense } from "react";
import { MessagesInbox } from "@/components/messages-inbox";

export const metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesInbox />
    </Suspense>
  );
}
