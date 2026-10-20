"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CaregiverAvatar } from "@/components/agency/find-caregivers";
import { armArrival, openThread, takeIncomingNotice, useMessageStore } from "@/components/agency/message-store";
import { useI18n } from "@/components/language-provider";
import { MOCK_CAREGIVERS } from "@/lib/mock-caregivers";

export function MessageToasts() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t } = useI18n();
  const { incoming } = useMessageStore();

  useEffect(() => {
    if (pathname.startsWith("/agency/messages")) return;
    armArrival();
  }, [pathname]);

  useEffect(() => {
    if (!incoming || incoming.noticed) return;
    const onInbox = pathname.startsWith("/agency/messages");
    const notice = takeIncomingNotice();
    if (!notice || onInbox) return;
    const person = MOCK_CAREGIVERS.find((item) => item.id === notice.caregiverId);
    if (!person) return;
    const preview = locale === "es" ? notice.es : notice.en;
    const threadId = notice.caregiverId;
    toast.custom(
      (id) => (
        <button
          type="button"
          onClick={() => {
            openThread(threadId);
            toast.dismiss(id);
            router.push(`/agency/messages?thread=${threadId}`);
          }}
          className="flex w-full items-start gap-3 rounded-lg border border-border bg-white p-3 text-left shadow-lg"
        >
          <CaregiverAvatar person={person} size="sm" />
          <span className="min-w-0">
            <span className="block text-sm font-medium">
              {person.firstName} {person.lastInitial}.
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{preview}</span>
            <span className="mt-2 block text-xs font-medium text-[#0c1e33]">{t.shell.inbox.open}</span>
          </span>
        </button>
      ),
      { duration: 20000, id: `message-${threadId}` },
    );
  }, [incoming, locale, pathname, router, t.shell.inbox.open]);

  return null;
}
