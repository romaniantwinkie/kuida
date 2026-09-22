import Link from "next/link";
import { Mark } from "@/components/mark";
import { LEGAL_LINE } from "@/lib/product";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Mark invert />
          <p className="mt-4 max-w-md text-xs leading-relaxed text-mist">{LEGAL_LINE}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-mist">
          <Link href="/#pricing" className="inline-flex min-h-11 items-center hover:text-paper">Pricing</Link>
          <Link href="/legal" className="inline-flex min-h-11 items-center hover:text-paper">Legal</Link>
          <Link href="/signup/agency" className="inline-flex min-h-11 items-center hover:text-paper">Agency</Link>
          <Link href="/signup/caregiver" className="inline-flex min-h-11 items-center hover:text-paper">Caregiver</Link>
        </div>
      </div>
    </footer>
  );
}
