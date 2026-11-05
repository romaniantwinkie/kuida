import { avatarUri } from "@/lib/avatar";
import type { Caregiver } from "@/lib/data";
import { cn } from "@/lib/cn";

export function CaregiverAvatar({ caregiver, className }: { caregiver: Pick<Caregiver, "firstName" | "lastInitial">; className?: string }) {
  const name = `${caregiver.firstName} ${caregiver.lastInitial}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUri(name)}
      alt=""
      aria-hidden="true"
      className={cn("size-9 shrink-0 rounded-full bg-surface-2 object-cover ring-1 ring-line", className)}
    />
  );
}
