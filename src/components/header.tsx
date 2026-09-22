import Link from "next/link";
import { Mark } from "@/components/mark";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-mist bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Mark />
        <nav className="flex items-center gap-1 text-sm text-mute sm:gap-4">
          <Link href="/#features" className="hidden min-h-11 items-center px-2 hover:text-ink sm:inline-flex">
            Features
          </Link>
          <Link href="/#pricing" className="hidden min-h-11 items-center px-2 hover:text-ink sm:inline-flex">
            Pricing
          </Link>
          <Link href="/sign-in" className="inline-flex min-h-11 items-center px-2 hover:text-ink">
            Log in
          </Link>
          <Link href="/#who" className="ml-1 inline-flex min-h-11 items-center bg-ink px-4 text-paper hover:bg-ink-soft">
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
