import { notFound, redirect } from "next/navigation";
import { CalendarDays, Clock, Languages, Lock, MapPin, ShieldCheck } from "lucide-react";
import { PageHead } from "@/components/page-head";
import { Card } from "@/components/ui/card";
import { SLOTS } from "@/lib/catalog";
import { DAYS } from "@/lib/data";
import { getSession } from "@/server/auth";
import { audit } from "@/server/db";
import { caregiverForAgency } from "@/server/queries";

export const metadata = { title: "Caregiver profile" };

/** Opened from a caregiver's QR code or (soon) from search. Approved agencies only. */
export default async function CaregiverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s?.agency) redirect("/sign-in");
  const { id } = await params;
  if (s.agency.status !== "approved") {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <ShieldCheck className="mx-auto size-8 text-info" />
        <p className="mt-4 text-lg font-semibold">Caregiver profiles open once your license is verified</p>
        <p className="mt-2 text-sm text-muted">We check every agency&apos;s state license before it can see caregivers. This usually takes one business day.</p>
      </Card>
    );
  }
  const p = await caregiverForAgency(id);
  if (!p) notFound();
  await audit("caregiver.profile_viewed", { caregiver: id }, { agencyId: s.agency.id, userId: s.user.id });
  const name = `${p.firstName} ${p.lastInitial}.`;
  return (
    <>
      <PageHead eyebrow="Caregiver" title={name} sub={`${p.role} · ${p.city ?? "Area not set"}`} />
      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <Card className="overflow-hidden">
          {p.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photo} alt="" className="aspect-square w-full object-cover" />
          ) : (
            <div className="grid aspect-square place-items-center bg-brand-soft text-5xl font-semibold text-brand">{p.firstName[0]}{p.lastInitial}</div>
          )}
          <div className="p-5 text-sm">
            <p className="flex items-center gap-2"><Languages className="size-4 text-muted" /> {p.languages.join(", ")}</p>
            <p className="mt-2 flex items-center gap-2"><MapPin className="size-4 text-muted" /> {p.city} · travels up to {p.radiusMiles} mi</p>
          </div>
        </Card>
        <div className="space-y-6">
          <Card className="p-5">
            <p className="eyebrow">Availability</p>
            <div className="mt-3 flex gap-1">
              {DAYS.map((d, i) => (
                <span key={d} className={`grid h-9 flex-1 place-items-center rounded-lg text-xs font-semibold ${p.days.includes(i) ? "bg-brand-soft text-brand" : "bg-surface-2 text-muted"}`}>{d}</span>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm"><Clock className="size-4 text-muted" /> {p.slots.map((x) => SLOTS.find((s2) => s2.id === x)?.en).filter(Boolean).join(", ") || "Times not set"}</p>
          </Card>
          {p.bio && (
            <Card className="p-5">
              <p className="eyebrow">About</p>
              <p className="mt-2 text-sm leading-relaxed">{p.bio}</p>
            </Card>
          )}
          <p className="flex items-start gap-2 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted">
            <Lock className="mt-0.5 size-4 shrink-0" />
            <span><b className="text-ink">Contact goes through Cercana.</b> Phone, email and documents stay private until the caregiver shares them with your office. <CalendarDays className="inline size-4" /> Offering shifts directly arrives with text offers.</span>
          </p>
        </div>
      </div>
    </>
  );
}
