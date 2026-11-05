export const BRAND = "Cercana";

export const LEGAL_LINE =
  "Software for licensed home care providers in every state. We are not a nurse registry, home health agency, or employer. Caregivers contract with the agency, not with us.";

export type Plan = {
  id: "search" | "pro" | "network";
  name: string;
  monthly: number | null;
  blurb: string;
  seats: string;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "search",
    name: "Search",
    monthly: 149,
    blurb: "For a single office that needs backup when the schedule has gaps.",
    seats: "2 coordinator seats",
    features: [
      "Ranked matches with score breakdown",
      "Map + 7-day availability search",
      "In-app requests (one at a time)",
      "Bilingual caregiver app",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 299,
    blurb: "Automated outreach waves and compliance for busy offices.",
    seats: "5 coordinator seats",
    highlight: true,
    features: [
      "Everything in Search",
      "Auto outreach waves + backfill on decline",
      "Credential vault with expiry alerts",
      "Hiring packet e-sign on the caregiver's phone",
      "Coordinator copilot + morning brief",
    ],
  },
  {
    id: "network",
    name: "Network",
    monthly: null,
    blurb: "Multi-location groups that share one roster across offices.",
    seats: "Unlimited seats",
    features: [
      "Everything in Pro",
      "Shared roster across locations",
      "Dedicated onboarding for every branch",
      "Fill-rate analytics by branch",
    ],
  },
];

export const RESULT_CAP = 15;

/** Launch offer for agencies. */
export const FOUNDING_OFFER = { agencies: 50, freeMonths: 6 } as const;
