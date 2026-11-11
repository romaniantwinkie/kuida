"use client";

import { ArrowRight, BellRing, Check, Clock, EyeOff, FolderLock, Languages, MessageSquareText, ShieldCheck, Smartphone, UserRound, Wallet } from "lucide-react";
import { CredentialVault } from "@/components/credential-vault";
import { ButtonLink } from "@/components/ui/button";
import { useLang, useT } from "@/lib/i18n";
import { MiamiScene } from "@/components/illustrations";
import { LiveStatus } from "@/components/home/live-status";
import { ProfileFlipCard } from "@/components/profile-flip-card";

const STEPS = [
  {
    icon: UserRound,
    title: { en: "Make your free profile", es: "Crea tu perfil gratis" },
    body: { en: "Your area, hours, languages and photo. About 3 minutes.", es: "Tu zona, horario, idiomas y foto. Unos 3 minutos." },
  },
  {
    icon: FolderLock,
    title: { en: "Upload credentials once", es: "Sube tus documentos una vez" },
    body: { en: "ID, certificate, background check, TB, CPR. We remind you before anything expires.", es: "ID, certificado, antecedentes, TB, RCP. Te avisamos antes de que algo venza." },
  },
  {
    icon: MessageSquareText,
    title: { en: "Get offers by text", es: "Recibe ofertas por texto" },
    body: { en: "Pay, time and distance up front. Reply 1 to accept or 2 to pass.", es: "Pago, hora y distancia desde el inicio. Responde 1 para aceptar o 2 para pasar." },
  },
];

const BENEFITS = [
  { icon: EyeOff, title: { en: "Your number stays private", es: "Tu número es privado" }, body: { en: "Agencies message you through Cercana, never your phone.", es: "Las agencias te escriben por Cercana, nunca a tu teléfono." } },
  { icon: Clock, title: { en: "Only shifts that fit", es: "Solo turnos que te sirven" }, body: { en: "Offers match the days, hours and distance you set.", es: "Las ofertas respetan tus días, horas y distancia." } },
  { icon: Wallet, title: { en: "Pay shown up front", es: "El pago, desde el inicio" }, body: { en: "Every offer shows the hourly range before you say yes.", es: "Cada oferta muestra el pago por hora antes de aceptar." } },
  { icon: BellRing, title: { en: "Expiry reminders", es: "Recordatorios" }, body: { en: "We text you 30 days before a credential expires.", es: "Te avisamos 30 días antes de que un documento venza." } },
  { icon: Languages, title: { en: "English and Spanish", es: "Inglés y español" }, body: { en: "Offers, the app and help in your language.", es: "Ofertas, app y ayuda en tu idioma." } },
  { icon: Smartphone, title: { en: "No app needed", es: "Sin app obligatoria" }, body: { en: "Everything works by text. The app is there when you want it.", es: "Todo funciona por texto. La app está cuando la quieras." } },
];

const FAQ = [
  { q: { en: "Is it really free?", es: "¿De verdad es gratis?" }, a: { en: "Yes. Cercana is free for caregivers, always: no sign-up fee, no monthly fee, and no cut of your pay.", es: "Sí. Cercana es gratis para cuidadores, siempre: sin cuota de registro, sin mensualidad y sin quitarte parte de tu pago." } },
  { q: { en: "Who do I work for?", es: "¿Para quién trabajo?" }, a: { en: "The licensed agency that offers you the shift. Cercana is software that connects you; we are not your employer.", es: "Para la agencia con licencia que te ofrece el turno. Cercana es el software que los conecta; no somos tu empleador." } },
  { q: { en: "Who can see my documents?", es: "¿Quién puede ver mis documentos?" }, a: { en: "Only agencies you choose, only the documents you pick, and only for the time you allow. They can view but not download, and you see every view.", es: "Solo las agencias que elijas, solo los documentos que marques y solo por el tiempo que permitas. Pueden verlos pero no descargarlos, y tú ves cada visita." } },
  { q: { en: "Will agencies see my phone number?", es: "¿Las agencias verán mi número?" }, a: { en: "No. Agencies message you through Cercana, and offers come by text from Cercana's number.", es: "No. Las agencias te escriben por Cercana y las ofertas llegan por texto desde el número de Cercana." } },
  { q: { en: "What do I need to join?", es: "¿Qué necesito para unirme?" }, a: { en: "A mobile phone and your role (HHA, CNA, LPN or companion). You can add documents now or later.", es: "Un celular y tu rol (HHA, CNA, LPN o acompañante). Puedes subir documentos ahora o después." } },
];

export function CaregiversHome({ openNear }: { openNear: number | null }) {
  const t = useT();
  const [lang] = useLang();
  const es = lang === "es";
  return (
    <main>
      {/* Hero */}
      <section>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-brand">
              <Check className="size-4" /> {t({ en: "Free for caregivers, always", es: "Gratis para cuidadores, siempre" })}
            </p>
            <h1 className="mt-6 text-[40px] font-semibold leading-[1.1] tracking-tight sm:text-6xl">
              {t({ en: "One profile for every agency on Cercana.", es: "Un perfil para todas las agencias en Cercana." })}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
              {t({
                en: "Upload your credentials once and share them with the agencies you choose. No more sending the same documents agency by agency. Then get shifts near you, by text.",
                es: "Sube tus documentos una vez y compártelos con las agencias que elijas. Ya no tienes que mandar los mismos papeles a cada agencia. Y recibe turnos cerca de ti, por texto.",
              })}
            </p>
            <LiveStatus
              className="mt-5"
              city="Little Havana"
              tz="America/New_York"
              detail={
                openNear != null && openNear > 0
                  ? t({ en: `${openNear} open shifts nearby right now`, es: `${openNear} turnos abiertos cerca ahora mismo` })
                  : t({ en: "Agencies are joining Cercana now", es: "Las agencias se están uniendo a Cercana" })
              }
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/caregivers/signup" size="lg">
                {t({ en: "Create my free profile", es: "Crear mi perfil gratis" })} <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/c" size="lg" variant="secondary">
                {t({ en: "See the app", es: "Ver la app" })}
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ["$0", t({ en: "forever", es: "siempre" })],
                [t({ en: "1 upload", es: "1 envío" }), t({ en: "for every agency", es: "para todas" })],
                ["3 min", t({ en: "to sign up", es: "para registrarte" })],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="text-2xl font-semibold">{k}</dt>
                  <dd className="mt-1 text-xs text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <CredentialVault compact />
        </div>
      </section>

      {/* Caregivers on their way */}
      <div className="h-40 overflow-hidden border-t border-line sm:h-52" role="img" aria-label={t({ en: "Caregivers walking and cycling to visits on a Miami street", es: "Cuidadores caminando y en bicicleta hacia sus visitas en una calle de Miami" })}>
        <MiamiScene people />
      </div>

      {/* What agencies see */}
      <section id="card" className="border-t border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] [&>*]:min-w-0">
          <div>
            <p className="eyebrow">{t({ en: "Your Cercana card", es: "Tu tarjeta Cercana" })}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">{t({ en: "This is what agencies see.", es: "Esto es lo que ven las agencias." })}</h2>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">
              {t({
                en: "Your first name, last initial, photo, role, languages and the area you work in. Turn it over for your verified documents, which agencies see only after you share them. Never your phone, email or address.",
                es: "Tu nombre, la inicial de tu apellido, foto, rol, idiomas y la zona donde trabajas. Voltéala para ver tus documentos verificados, que las agencias ven solo cuando los compartes. Nunca tu teléfono, correo ni dirección.",
              })}
            </p>
            <p className="mt-4 text-sm text-muted">{t({ en: "At a job fair? Show the QR code on the back. The agency scans it to open your profile.", es: "¿En una feria de empleo? Muestra el código QR de atrás. La agencia lo escanea para ver tu perfil." })}</p>
          </div>
          <ProfileFlipCard
            es={es}
            tag={t({ en: "Example", es: "Ejemplo" })}
            p={{
              photo: "/people/maria.jpg",
              name: "María L.",
              role: es ? "Auxiliar de salud en casa (HHA)" : "Home health aide (HHA)",
              languages: es ? ["Español", "Inglés"] : ["Spanish", "English"],
              area: "Little Havana, Miami · 10 mi",
              availability: es ? "Lun–Vie · mañanas" : "Mon–Fri · mornings",
              docs: [
                { name: es ? "Identificación" : "Photo ID", ok: true },
                { name: es ? "Certificado HHA" : "HHA certificate", ok: true, note: "2027" },
                { name: es ? "Antecedentes nivel 2" : "Level 2 background", ok: true },
                { name: es ? "Prueba de TB" : "TB test", ok: true, note: es ? "vence en 4 m" : "4 mo left" },
                { name: es ? "RCP" : "CPR card", ok: false, note: es ? "subir" : "upload" },
              ],
              qrText: "https://cercana.ai/caregivers",
            }}
          />
        </div>
      </section>

      {/* Vault */}
      <section id="vault" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 [&>*]:min-w-0">
          <div>
            <p className="eyebrow">{t({ en: "Your credential vault", es: "Tu bóveda de documentos" })}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">
              {t({ en: "Your documents, safe, and shared only when you say so.", es: "Tus documentos, seguros, y compartidos solo cuando tú dices." })}
            </h2>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">
              {t({
                en: "Every new agency asks for the same papers. With Cercana you upload them once, then choose which agency sees which document, and for how long.",
                es: "Cada agencia nueva pide los mismos papeles. Con Cercana los subes una vez y eliges qué agencia ve cada documento, y por cuánto tiempo.",
              })}
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: ShieldCheck, t: { en: "Private by default", es: "Privado desde el inicio" }, b: { en: "Nothing is shared until you turn it on for an agency.", es: "Nada se comparte hasta que lo actives para una agencia." } },
                { icon: Check, t: { en: "You pick each document", es: "Tú eliges cada documento" }, b: { en: "Share your ID with one agency and everything with another.", es: "Comparte tu ID con una agencia y todo con otra." } },
                { icon: Clock, t: { en: "Access ends by itself", es: "El acceso termina solo" }, b: { en: "Sharing lasts 30 days unless you extend it. Stop any time.", es: "Se comparte por 30 días, salvo que lo extiendas. Puedes parar cuando quieras." } },
                { icon: EyeOff, t: { en: "View-only, and logged", es: "Solo ver, y registrado" }, b: { en: "Agencies can't download. You see who looked and when.", es: "Las agencias no pueden descargar. Tú ves quién miró y cuándo." } },
              ].map((x) => (
                <li key={x.t.en} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <x.icon className="size-4" />
                  </span>
                  <span>
                    <span className="block font-semibold">{t(x.t)}</span>
                    <span className="block text-sm text-muted">{t(x.b)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <CredentialVault />
            <p className="mt-3 text-center text-xs text-muted">
              {t({ en: "Try it: upload a file, open an agency or approve a request. This demo keeps files on your device.", es: "Pruébalo: sube un archivo, abre una agencia o aprueba una solicitud. Esta demo guarda los archivos en tu dispositivo." })}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow">{t({ en: "How it works", es: "Cómo funciona" })}</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">{t({ en: "Three steps to your next shift.", es: "Tres pasos para tu próximo turno." })}</h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title.en} className="rounded-2xl border border-line bg-surface p-6">
                <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand">
                  <s.icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 font-semibold">
                  <span className="text-muted">{i + 1}.</span> {t(s.title)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(s.body)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title.en} className="flex gap-3 rounded-2xl border border-line bg-surface p-6">
                <b.icon className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <p className="font-semibold">{t(b.title)}</p>
                  <p className="mt-1 text-sm text-muted">{t(b.body)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-bg p-8 text-center sm:p-12">
            <p className="eyebrow">{t({ en: "Pricing", es: "Precio" })}</p>
            <p className="mt-4 text-7xl font-semibold tracking-tight">$0</p>
            <p className="mt-2 text-xl font-semibold">{t({ en: "Free for caregivers. Always.", es: "Gratis para cuidadores. Siempre." })}</p>
            <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left text-sm">
              {[
                { en: "No sign-up fee", es: "Sin cuota de registro" },
                { en: "No monthly fee", es: "Sin mensualidad" },
                { en: "No cut of your pay, ever", es: "Nunca tomamos parte de tu pago" },
                { en: "Credential vault and reminders included", es: "Bóveda de documentos y recordatorios incluidos" },
                { en: "Unlimited shift offers", es: "Ofertas de turnos ilimitadas" },
              ].map((x) => (
                <li key={x.en} className="flex items-center gap-3">
                  <Check className="size-4 shrink-0 text-brand" /> {t(x)}
                </li>
              ))}
            </ul>
            <ButtonLink href="/caregivers/signup" size="lg" className="mt-8">
              {t({ en: "Create my free profile", es: "Crear mi perfil gratis" })}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-3">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{t({ en: "Questions caregivers ask first.", es: "Lo que más preguntan los cuidadores." })}</h2>
          </div>
          <div className="divide-y divide-line md:col-span-2">
            {FAQ.map((f) => (
              <details key={f.q.en} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {t(f.q)}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-3xl border border-line bg-surface px-8 py-12 shadow-card sm:px-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t({ en: "Your next shift is closer than you think.", es: "Tu próximo turno está más cerca de lo que crees." })}</h2>
            <p className="mt-2 text-muted">{t({ en: "Free profile · offers by text · English and Spanish", es: "Perfil gratis · ofertas por texto · inglés y español" })}</p>
          </div>
          <ButtonLink href="/caregivers/signup" size="lg">
            {t({ en: "Join free", es: "Únete gratis" })}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
