export type DemoMessage = {
  id: string;
  from: "agency" | "caregiver";
  en: string;
  es: string;
  at: number;
};

export type DemoThread = {
  caregiverId: string;
  unread: number;
  messages: DemoMessage[];
};

const minute = 60_000;
const hour = 60 * minute;

export function createDemoThreads(now = Date.now()): DemoThread[] {
  return [
    {
      caregiverId: "c3",
      unread: 1,
      messages: [
        {
          id: "c3-1",
          from: "caregiver",
          en: "I can take the Wynwood evening shift.",
          es: "Puedo tomar el turno de tarde en Wynwood.",
          at: now - 8 * minute,
        },
      ],
    },
    {
      caregiverId: "c5",
      unread: 1,
      messages: [
        {
          id: "c5-1",
          from: "agency",
          en: "Is Thursday morning still open?",
          es: "¿Sigue libre el jueves por la mañana?",
          at: now - 3 * hour,
        },
        {
          id: "c5-2",
          from: "caregiver",
          en: "Yes, 9 to 1 still works.",
          es: "Sí, de 9 a 1 sigue bien.",
          at: now - 18 * minute,
        },
      ],
    },
    {
      caregiverId: "c6",
      unread: 1,
      messages: [
        {
          id: "c6-1",
          from: "caregiver",
          en: "On my way to Hialeah. About twenty minutes.",
          es: "Voy para Hialeah. Unos veinte minutos.",
          at: now - 25 * minute,
        },
      ],
    },
    {
      caregiverId: "c1",
      unread: 0,
      messages: [
        {
          id: "c1-1",
          from: "agency",
          en: "Can you cover Tuesday 8 to 2 in Brickell?",
          es: "¿Puedes cubrir el martes de 8 a 2 en Brickell?",
          at: now - 2 * hour,
        },
        {
          id: "c1-2",
          from: "caregiver",
          en: "Yes. I'll be there at 8.",
          es: "Sí. Llego a las 8.",
          at: now - hour,
        },
      ],
    },
    {
      caregiverId: "c2",
      unread: 0,
      messages: [
        {
          id: "c2-1",
          from: "caregiver",
          en: "I don't drive, but I can bus to Little Havana.",
          es: "No conduzco, pero puedo ir en bus a la Pequeña Habana.",
          at: now - 5 * hour,
        },
      ],
    },
    {
      caregiverId: "c9",
      unread: 0,
      messages: [
        {
          id: "c9-1",
          from: "caregiver",
          en: "Saturday is full this week.",
          es: "El sábado está lleno esta semana.",
          at: now - 26 * hour,
        },
        {
          id: "c9-2",
          from: "agency",
          en: "Thanks. I'll keep you for the next one.",
          es: "Gracias. Te tengo en cuenta para el siguiente.",
          at: now - 25 * hour,
        },
      ],
    },
  ];
}

export const INCOMING_MESSAGE: DemoMessage = {
  id: "c9-arrive",
  from: "caregiver",
  en: "Saturday opened up. I can take 9 to 3.",
  es: "El sábado se liberó. Puedo de 9 a 3.",
  at: 0,
};
