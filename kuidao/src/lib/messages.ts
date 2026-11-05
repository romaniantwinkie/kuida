/** Demo message threads. Cercana relays these by text; no phone numbers are shown. */
export type Msg = { from: "agency" | "caregiver"; text: string; at: string; translated?: string };
export type Thread = { caregiverId: string; unread: number; messages: Msg[] };

export const THREADS: Thread[] = [
  {
    caregiverId: "c1",
    unread: 1,
    messages: [
      { from: "agency", text: "Hi Xiomara, can you cover Sra. G. Tuesday 8–2? Same routine as last week.", at: "Mon 4:10p", translated: "Hola Xiomara, ¿puedes cubrir a la Sra. G. el martes de 8 a 2? La misma rutina de la semana pasada." },
      { from: "caregiver", text: "Sí, puedo. ¿Necesita que lleve algo?", at: "Mon 4:22p", translated: "Yes, I can. Does she need me to bring anything?" },
    ],
  },
  {
    caregiverId: "c5",
    unread: 0,
    messages: [
      { from: "agency", text: "Yanelis, your CNA license renewal is due in 90 days. Can you upload the new card when you have it?", at: "Fri 9:02a" },
      { from: "caregiver", text: "Will do, I renew next month.", at: "Fri 9:40a" },
    ],
  },
  {
    caregiverId: "c6",
    unread: 0,
    messages: [{ from: "caregiver", text: "Sr. R. asked if I can switch Thursday to 11a–5p. Is that OK?", at: "Wed 6:15p" }],
  },
];

export const unreadCount = THREADS.reduce((n, t) => n + t.unread, 0);
