import Link from "next/link";

export default function CaregiverApp() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-md px-5 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <img src="/kuida-wordmark.svg" alt="KUIDA" className="h-6 w-auto" />
            <h1 className="mt-4 text-2xl font-medium">Hola, María</h1>
          </div>
          <Link href="/" className="text-xs text-mute">Home</Link>
        </div>
        <section className="border-y border-r border-l-4 border-mist border-l-ink bg-paper p-5">
          <p className="text-xs tracking-widest text-mute">NUEVO</p>
          <p className="mt-2">HHA · Hialeah · 8:00–2:00</p>
          <p className="mt-1 text-sm text-mute">~1.5 mi · $18–20 / hr</p>
          <div className="mt-5 flex gap-2">
            <button type="button" className="min-h-11 flex-1 bg-ink text-sm text-paper">Aceptar</button>
            <button type="button" className="min-h-11 flex-1 border border-mist text-sm">No</button>
          </div>
        </section>
        <section className="mt-4 border border-mist bg-paper p-5">
          <p className="text-sm">Horas</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
            {["L", "M", "W", "J", "V", "S", "D"].map((d, i) => (
              <div key={`${d}-${i}`} className={`py-3 ${i < 5 ? "bg-ink text-paper" : "bg-mist text-mute"}`}>
                {d}
              </div>
            ))}
          </div>
        </section>
        <section className="mt-4 border border-mist bg-paper p-5 text-sm">
          <p>Documentos</p>
          <ul className="mt-3 space-y-2 text-mute">
            <li className="flex justify-between">ID <span className="text-ink">Listo</span></li>
            <li className="flex justify-between">HHA <span className="text-ink">Listo</span></li>
            <li className="flex justify-between">CPR <span>21 días</span></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
