"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Shell } from "@/components/shell";

export default function CaregiverSignup() {
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <Shell>
      <main className="mx-auto max-w-md px-5 py-14">
        <p className="text-xs tracking-widest text-mute">GRATIS</p>
        <h1 className="mt-3 text-3xl font-medium">Crear perfil</h1>
        <p className="mt-2 text-sm text-mute">Las agencias ven tu nombre, zona e idiomas. No tu teléfono.</p>
        {done ? (
          <div className="mt-8 border border-mist bg-paper p-6">
            <p>Perfil de prueba. Aún no se guarda.</p>
            <Link href="/c" className="mt-6 inline-flex min-h-11 items-center bg-ink px-4 text-sm text-paper">
              Ver la app
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-mist bg-paper p-6">
            <label className="block text-sm">
              Nombre
              <input required className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <label className="block text-sm">
              Apellido
              <input required className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <label className="block text-sm">
              Celular
              <input required inputMode="tel" className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <label className="block text-sm">
              Rol
              <select className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink">
                <option>HHA</option>
                <option>CNA</option>
                <option>Companion</option>
                <option>LPN</option>
              </select>
            </label>
            <label className="block text-sm">
              Zona / zips
              <input required placeholder="33166, Hialeah…" className="mt-1 min-h-11 w-full border border-mist bg-cream px-3 outline-none focus:border-ink" />
            </label>
            <button type="submit" className="min-h-11 w-full bg-ink text-sm text-paper hover:bg-ink-soft">
              Continuar
            </button>
          </form>
        )}
      </main>
    </Shell>
  );
}
