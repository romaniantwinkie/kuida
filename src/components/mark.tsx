import Link from "next/link";

export function Mark({ invert = false }: { invert?: boolean }) {
  return (
    <Link href="/" aria-label="KUIDA home" className="inline-flex items-center">
      <img
        src="/kuida-wordmark.svg"
        alt="KUIDA"
        className={`h-7 w-auto sm:h-8 ${invert ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}
