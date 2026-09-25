export type Locale = "en" | "es";

export type AgencyStepKey = "search" | "message" | "hire";
export type CaregiverStepKey = "profile" | "hours" | "requests";
export type CaregiverFeatureKey = "free" | "hours" | "requests" | "documents";

type CopyBlock<K extends string> = { key: K; title: string; body: string };

export type Messages = {
  meta: { title: string };
  lang: { label: string; english: string; spanish: string };
  mark: { home: string };
  nav: { features: string; pricing: string; logIn: string; getStarted: string };
  footer: {
    pricing: string;
    legal: string;
    agency: string;
    caregiver: string;
    legalLine: string;
  };
  home: {
    line: string;
    title: string;
    agencyKicker: string;
    agencyTitle: string;
    agencyBody: string;
    caregiverKicker: string;
    caregiverTitle: string;
    caregiverBody: string;
    continue: string;
    agencyButton: string;
    caregiverButton: string;
    agencyCta: string;
    caregiverCta: string;
    agencySubtitle: string;
    caregiverSubtitle: string;
    agencyImageAlt: string;
    caregiverImageAlt: string;
  };
  agency: {
    heroKicker: string;
    heroLead: string;
    heroRotate: string[];
    heroBody: string;
    getStarted: string;
    seeSearch: string;
    demoLabel: string;
    demoUrl: string;
    resultsLabel: string;
    demoAddressLabel: string;
    demoAddress: string;
    demoHours: string;
    requestSent: string;
    accepted: string;
    menu: string;
    howKicker: string;
    howTitle: string;
    steps: CopyBlock<AgencyStepKey>[];
    clarity: string;
    bentoKicker: string;
    bentoTitle: string;
    bento: { key: string; title: string; body: string }[];
    weekDays: string[];
    packetItems: string[];
    vaultItems: string[];
    urgentPill: string;
    nearby: string;
    demoData: string;
    pricingKicker: string;
    pricingTitle: string;
    pricingBody: string;
    busyOffices: string;
    searchName: string;
    proName: string;
    proPrice: string;
    perMonth: string;
    searchBullets: string[];
    proBullets: string[];
    searchItems: string[];
    proItems: string[];
    talkToUs: string;
    compare: string;
    faqTitle: string;
    faqLead: string;
    faqItems: { id: string; q: string; a: string }[];
    testimonialsKicker: string;
    testimonialsTitle: string;
    testimonials: { quote: string; name: string; role: string; initials: string }[];
    footerProduct: string;
    footerCompany: string;
    footerLegalCol: string;
    footerTerms: string;
    footerPrivacy: string;
    footerCopyright: string;
    footerCaregivers: string;
  };
  caregiver: {
    heroKicker: string;
    heroTitle: string;
    heroBody: string;
    families: string;
    signup: string;
    preview: string;
    howKicker: string;
    howTitle: string;
    steps: CopyBlock<CaregiverStepKey>[];
    featuresKicker: string;
    featuresTitle: string;
    features: CopyBlock<CaregiverFeatureKey>[];
    bandKicker: string;
    bandBody: string;
    bandCta: string;
  };
  signIn: {
    title: string;
    email: string;
    password: string;
    submit: string;
    done: string;
    openSearch: string;
    new: string;
    doors: string;
  };
  agencySignup: {
    kicker: string;
    title: string;
    body: string;
    legalName: string;
    email: string;
    plan: string;
    searchPlan: string;
    proPlan: string;
    continue: string;
    done: string;
    openSearch: string;
    caregiver: string;
  };
  caregiverSignup: {
    kicker: string;
    title: string;
    body: string;
    first: string;
    last: string;
    phone: string;
    role: string;
    roles: { value: string; label: string }[];
    zone: string;
    zonePlaceholder: string;
    continue: string;
    done: string;
    seeApp: string;
  };
  legal: { kicker: string; title: string; later: string };
  search: {
    kicker: string;
    title: string;
    address: string;
    language: string;
    any: string;
    spanish: string;
    english: string;
    submit: string;
    note: string;
    matches: string;
    empty: string;
    request: string;
  };
  preview: {
    greeting: string;
    newLabel: string;
    shift: string;
    distance: string;
    accept: string;
    decline: string;
    hours: string;
    days: string[];
    documents: string;
    id: string;
    ready: string;
    hha: string;
    cpr: string;
    cprStatus: string;
  };
  units: { mi: string };
};

export const messages: Record<Locale, Messages> = {
  en: {
    meta: { title: "KUIDAO" },
    lang: { label: "Language", english: "English", spanish: "Español" },
    mark: { home: "KUIDAO home" },
    nav: {
      features: "Features",
      pricing: "Pricing",
      logIn: "Log in",
      getStarted: "Get started",
    },
    footer: {
      pricing: "Pricing",
      legal: "Legal",
      agency: "Agency",
      caregiver: "Caregiver",
      legalLine:
        "Kuidao is software for home care, nurse registry, and home health agencies. We start in Florida and are built to expand nationwide. We are not a nurse registry, a home health agency, or an employer. Caregivers contract with the agency, not with us. Families and private clients do not hire here.",
    },
    home: {
      line: "Software for agencies staffing cases, and for caregivers finding shifts.",
      title: "Who are you?",
      agencyKicker: "Agency",
      agencyTitle: "I run an agency",
      agencyBody: "Cover open shifts for your own patients and cases.",
      caregiverKicker: "Caregiver",
      caregiverTitle: "I want shifts",
      caregiverBody: "Free to join. Set your hours and area. Agencies message you in the app.",
      continue: "Continue",
      agencyButton: "I am an Agency.",
      caregiverButton: "I am a Caregiver.",
      agencyCta: "Find a Caregiver now.",
      caregiverCta: "Find work now.",
      agencySubtitle: "Choose from hundreds of available caregivers",
      caregiverSubtitle: "Find work from multiple agencies at once",
      agencyImageAlt: "Care coordinators reviewing a case together",
      caregiverImageAlt: "Caregiver sitting with a client at home",
    },
    agency: {
      heroKicker: "For agencies",
      heroLead: "Cover",
      heroRotate: ["urgent shifts", "new patients", "weekend cases"],
      heroBody:
        "Enter the address and hours, see who’s nearby, request in the app, and hire with your packet.",
      getStarted: "Get started",
      seeSearch: "See who’s nearby",
      demoLabel: "Demo",
      demoUrl: "kuidao.app/search",
      resultsLabel: "Results",
      demoAddressLabel: "Address",
      demoAddress: "Brickell, Miami",
      demoHours: "Tue 8:00 AM–2:00 PM",
      requestSent: "Request sent",
      accepted: "Accepted",
      menu: "Menu",
      howKicker: "How it works",
      howTitle: "Three steps to cover a case",
      steps: [
        {
          key: "search",
          title: "Search by address & hours",
          body: "The case location and the window that needs covering.",
        },
        {
          key: "message",
          title: "Request in the app",
          body: "They get the request on their phone and reply there.",
        },
        {
          key: "hire",
          title: "Hire with your packet",
          body: "Send your documents for them to complete.",
        },
      ],
      clarity: "We fill the shift. We are not your EMR, registry, or employer.",
      bentoKicker: "In the product",
      bentoTitle: "What the office uses",
      bento: [
        {
          key: "map",
          title: "Map and week view",
          body: "See who’s nearby and which days they can work.",
        },
        {
          key: "packet",
          title: "Hiring packet",
          body: "Send your documents in the app.",
        },
        {
          key: "vault",
          title: "Document vault",
          body: "Credentials stay with the case.",
        },
        {
          key: "urgent",
          title: "Urgent priority",
          body: "Flag a shift that needs covering first.",
        },
        {
          key: "languages",
          title: "English and Spanish",
          body: "The office and the app, in both languages.",
        },
      ],
      weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      packetItems: ["Your packet", "Duties", "Sign in the app"],
      vaultItems: ["ID", "HHA certificate", "CPR card"],
      urgentPill: "Urgent",
      nearby: "See who’s free near your case",
      demoData: "Demo data",
      pricingKicker: "Agencies only",
      pricingTitle: "Pricing",
      pricingBody: "Search is a flat monthly plan. Pro is quoted for the office.",
      busyOffices: "For busy offices",
      searchName: "Search",
      proName: "Pro",
      proPrice: "Contact for Pricing",
      perMonth: "/mo",
      searchBullets: [
        "Address + schedule search",
        "Map and week view of available caregivers",
        "In-app requests (first contact in Kuidao)",
        "Short results list for the case window",
        "Email support",
      ],
      proBullets: [
        "Everything in Search",
        "Custom hiring packet sent in-app",
        "Credential / document vault",
        "Priority matching for urgent shifts",
        "Phone + email support",
      ],
      searchItems: [
        "Address + schedule search",
        "Map and week view of available caregivers",
        "In-app requests (first contact in Kuidao)",
        "Short results list for the case window",
        "Agency office access",
        "Email support",
      ],
      proItems: [
        "Everything in Search",
        "Custom hiring packet sent in-app",
        "Credential / document vault",
        "Priority matching for urgent shifts",
        "Dedicated onboarding help",
        "Phone + email support",
      ],
      talkToUs: "Talk to us",
      compare: "Compare plans",
      faqTitle: "Questions",
      faqLead: "A few answers before you start.",
      faqItems: [
        {
          id: "item-1",
          q: "Who is this for?",
          a: "Florida nurse registries, home health, and home care agencies covering their own patients.",
        },
        {
          id: "item-2",
          q: "How fast do caregivers reply?",
          a: "Caregivers get the request on their phone and reply in the app. You see replies as they come in. There is no promised response time.",
        },
        {
          id: "item-3",
          q: "What areas are covered?",
          a: "Kuidao starts in Florida, including Miami-Dade, Broward, and Palm Beach, and is built to expand nationwide.",
        },
        {
          id: "item-4",
          q: "Who pays?",
          a: "The agency pays. Search is $299 a month. Pro is quoted for the office. Caregivers join free and never see plans or prices.",
        },
        {
          id: "item-5",
          q: "Can I cancel?",
          a: "Search is a monthly plan. You can cancel from the office account before the next month. This preview does not charge a card.",
        },
        {
          id: "item-6",
          q: "What happens after a caregiver accepts?",
          a: "You send your hiring packet in the app. They complete your documents. The caregiver contracts with your agency, not with Kuidao.",
        },
        {
          id: "item-7",
          q: "Can a family hire a caregiver here?",
          a: "No. Families and private clients do not hire on Kuidao.",
        },
        {
          id: "item-8",
          q: "Do I need a state license number to sign up?",
          a: "No. Creating an agency account does not ask for a state license number.",
        },
      ],
      testimonialsKicker: "Illustrative stories",
      testimonialsTitle: "Agencies covering cases with Kuidao",
      testimonials: [
        {
          quote: "A caregiver called out at 6 a.m. We had someone for that case before lunch.",
          name: "Marisol V.",
          role: "Agency administrator",
          initials: "MV",
        },
        {
          quote: "We needed a weekend HHA with almost no notice. The request went out and we covered Saturday.",
          name: "Andre C.",
          role: "Scheduling lead",
          initials: "AC",
        },
        {
          quote: "The address was hard to staff. We still found a caregiver who would take it.",
          name: "Lila O.",
          role: "Office manager",
          initials: "LO",
        },
        {
          quote: "The household spoke Spanish and English. We matched a caregiver who could use both.",
          name: "James O.",
          role: "Agency administrator",
          initials: "JO",
        },
        {
          quote: "The same HHA came back for the next three cases. The office already knew her.",
          name: "Carmen D.",
          role: "Scheduling lead",
          initials: "CD",
        },
        {
          quote: "A new patient started the same week. We had a CNA on the schedule before the first visit.",
          name: "Elena B.",
          role: "Office manager",
          initials: "EB",
        },
        {
          quote: "Evening coverage used to sit open. We filled a 5-to-9 window the day we posted it.",
          name: "Pedro A.",
          role: "Agency administrator",
          initials: "PA",
        },
        {
          quote: "We asked for Spanish and English on a short list. The match spoke both.",
          name: "Naomi C.",
          role: "Scheduling lead",
          initials: "NC",
        },
        {
          quote: "One caregiver stayed reliable across later cases, so we stopped starting from zero.",
          name: "Rosa M.",
          role: "Office manager",
          initials: "RM",
        },
        {
          quote: "A last-minute call-out on a Friday. We covered the shift before the day slipped.",
          name: "David S.",
          role: "Agency administrator",
          initials: "DS",
        },
        {
          quote: "The zone was outside our usual loop. We still saw someone who could get there.",
          name: "Irene P.",
          role: "Scheduling lead",
          initials: "IP",
        },
        {
          quote: "Weekend intake for a new patient used to wait until Monday. We covered Sunday.",
          name: "Luis F.",
          role: "Office manager",
          initials: "LF",
        },
      ],
      footerProduct: "Product",
      footerCompany: "Company",
      footerLegalCol: "Legal",
      footerTerms: "Terms",
      footerPrivacy: "Privacy",
      footerCopyright: "© 2026 Kuidao",
      footerCaregivers: "For caregivers",
    },
    caregiver: {
      heroKicker: "For caregivers",
      heroTitle: "Find shifts. Always free.",
      heroBody:
        "Set your hours and your zone. Agencies message you in the app. Your phone number stays private.",
      families: "Families do not hire here. Agencies staff their own cases.",
      signup: "Create your profile",
      preview: "See the app",
      howKicker: "How it works",
      howTitle: "Three steps",
      steps: [
        {
          key: "profile",
          title: "Create your profile",
          body: "Name, role, area, and languages. Free.",
        },
        {
          key: "hours",
          title: "Set hours and zone",
          body: "Show when you can work and how far you can go.",
        },
        {
          key: "requests",
          title: "Get requests in the app",
          body: "Accept or decline. There is no public phone list.",
        },
      ],
      featuresKicker: "For you",
      featuresTitle: "Simple on a phone",
      features: [
        {
          key: "free",
          title: "Free forever",
          body: "Caregivers do not pay to join or to use Kuidao.",
        },
        {
          key: "hours",
          title: "Hours and zone",
          body: "You decide when you are free and where you can go.",
        },
        {
          key: "requests",
          title: "Requests in the app",
          body: "Agencies contact you here first.",
        },
        {
          key: "documents",
          title: "Documents on your phone",
          body: "Keep your ID and certificates ready.",
        },
      ],
      bandKicker: "On your phone",
      bandBody: "Requests, hours, and documents — on your phone.",
      bandCta: "Open preview",
    },
    signIn: {
      title: "Log in",
      email: "Email or phone",
      password: "Password",
      submit: "Log in",
      done: "Preview login only. Accounts are not live yet.",
      openSearch: "Open search",
      new: "New?",
      doors: "Agency or caregiver",
    },
    agencySignup: {
      kicker: "Agency",
      title: "Create your office",
      body: "For agencies staffing their own cases. Your office pays a monthly plan. Anyone can sign up. This demo does not save accounts.",
      legalName: "Legal name",
      email: "Work email",
      plan: "Plan",
      searchPlan: "Search · ${price}",
      proPlan: "Pro · Contact for Pricing",
      continue: "Continue",
      done: "Request received. This demo does not save accounts yet.",
      openSearch: "Open search preview",
      caregiver: "Caregiver? Join free",
    },
    caregiverSignup: {
      kicker: "Free",
      title: "Create your profile",
      body: "Agencies see your name, area, and languages. Not your phone. Always free.",
      first: "First name",
      last: "Last name",
      phone: "Mobile",
      role: "Role",
      roles: [
        { value: "HHA", label: "HHA" },
        { value: "CNA", label: "CNA" },
        { value: "Companion", label: "Companion" },
        { value: "LPN", label: "LPN" },
      ],
      zone: "Area / zips",
      zonePlaceholder: "33166, Hialeah…",
      continue: "Continue",
      done: "Preview profile. Nothing is saved yet.",
      seeApp: "See the app",
    },
    legal: {
      kicker: "Legal",
      title: "How Kuidao works",
      later:
        "Full Terms and a Privacy Policy will be published later, before launch. Creating an agency account does not require a state license number.",
    },
    search: {
      kicker: "Agency demo",
      title: "Fill a shift",
      address: "Address",
      language: "Language",
      any: "Any",
      spanish: "Spanish",
      english: "English",
      submit: "Search",
      note: "Address is used only for this search. It is not saved as a patient record.",
      matches: "Matches",
      empty: "Run a search to see who is free.",
      request: "Request",
    },
    preview: {
      greeting: "Hi, María",
      newLabel: "New",
      shift: "HHA · Hialeah · 8:00–2:00",
      distance: "~1.5 mi",
      accept: "Accept",
      decline: "No",
      hours: "Hours",
      days: ["M", "T", "W", "T", "F", "S", "S"],
      documents: "Documents",
      id: "ID",
      ready: "Ready",
      hha: "HHA",
      cpr: "CPR",
      cprStatus: "21 days",
    },
    units: { mi: "mi" },
  },
  es: {
    meta: { title: "KUIDAO" },
    lang: { label: "Idioma", english: "English", spanish: "Español" },
    mark: { home: "Inicio de KUIDAO" },
    nav: {
      features: "Funciones",
      pricing: "Precios",
      logIn: "Entrar",
      getStarted: "Empezar",
    },
    footer: {
      pricing: "Precios",
      legal: "Legal",
      agency: "Agencia",
      caregiver: "Cuidador",
      legalLine:
        "Kuidao es software para agencias de cuidado en el hogar, registros de enfermería y home health. Empezamos en Florida y estamos hechos para crecer en todo el país. No somos un registro de enfermería, una agencia de home health ni un empleador. El cuidador contrata con la agencia, no con nosotros. Las familias y los clientes particulares no contratan aquí.",
    },
    home: {
      line: "Software para agencias que cubren casos, y para cuidadores que buscan turnos.",
      title: "¿Quién eres?",
      agencyKicker: "Agencia",
      agencyTitle: "Tengo una agencia",
      agencyBody: "Cubre turnos de tus propios pacientes y casos.",
      caregiverKicker: "Cuidador",
      caregiverTitle: "Quiero turnos",
      caregiverBody: "Entrar es gratis. Pon tus horas y tu zona. Las agencias te escriben en la app.",
      continue: "Continuar",
      agencyButton: "Soy una agencia.",
      caregiverButton: "Soy un/a cuidador/a.",
      agencyCta: "Encuentra un cuidador ahora.",
      caregiverCta: "Encuentra trabajo ahora.",
      agencySubtitle: "Elige entre cientos de cuidadores disponibles",
      caregiverSubtitle: "Encuentra trabajo con varias agencias a la vez",
      agencyImageAlt: "Coordinadores de cuidado revisando un caso juntos",
      caregiverImageAlt: "Cuidador acompañando a un cliente en casa",
    },
    agency: {
      heroKicker: "Para agencias",
      heroLead: "Cubre",
      heroRotate: ["turnos urgentes", "pacientes nuevos", "casos de fin de semana"],
      heroBody:
        "Ingresa la dirección y las horas, mira quién está cerca, solicita en la app y contrata con tu paquete.",
      getStarted: "Empezar",
      seeSearch: "Mira quién está cerca",
      demoLabel: "Demo",
      demoUrl: "kuidao.app/search",
      resultsLabel: "Resultados",
      demoAddressLabel: "Dirección",
      demoAddress: "Brickell, Miami",
      demoHours: "Mar 8:00 a. m.–2:00 p. m.",
      requestSent: "Solicitud enviada",
      accepted: "Aceptada",
      menu: "Menú",
      howKicker: "Cómo funciona",
      howTitle: "Tres pasos para cubrir un caso",
      steps: [
        {
          key: "search",
          title: "Busca por dirección y horas",
          body: "La ubicación del caso y el horario que hay que cubrir.",
        },
        {
          key: "message",
          title: "Solicita en la app",
          body: "Les llega al teléfono y responden ahí.",
        },
        {
          key: "hire",
          title: "Contrata con tu paquete",
          body: "Envía tus documentos para que los completen.",
        },
      ],
      clarity: "Cubrimos el turno. No somos tu EMR, tu registro ni tu empleador.",
      bentoKicker: "En el producto",
      bentoTitle: "Lo que usa la oficina",
      bento: [
        {
          key: "map",
          title: "Mapa y vista semanal",
          body: "Mira quién está cerca y qué días puede trabajar.",
        },
        {
          key: "packet",
          title: "Paquete de contratación",
          body: "Envía tus documentos en la app.",
        },
        {
          key: "vault",
          title: "Bóveda de documentos",
          body: "Las credenciales se quedan con el caso.",
        },
        {
          key: "urgent",
          title: "Prioridad urgente",
          body: "Marca el turno que hay que cubrir primero.",
        },
        {
          key: "languages",
          title: "Inglés y español",
          body: "La oficina y la app, en los dos idiomas.",
        },
      ],
      weekDays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      packetItems: ["Tu paquete", "Tareas", "Firmar en la app"],
      vaultItems: ["Identificación", "Certificado de HHA", "Tarjeta de CPR"],
      urgentPill: "Urgente",
      nearby: "Mira quién está libre cerca de tu caso",
      demoData: "Datos de demostración",
      pricingKicker: "Solo agencias",
      pricingTitle: "Precios",
      pricingBody: "Búsqueda es un plan mensual fijo. Pro se cotiza para la oficina.",
      busyOffices: "Para oficinas ocupadas",
      searchName: "Búsqueda",
      proName: "Pro",
      proPrice: "Consultar precio",
      perMonth: "/mes",
      searchBullets: [
        "Búsqueda por dirección y horario",
        "Mapa y vista semanal de cuidadores disponibles",
        "Solicitudes en la app (primer contacto en Kuidao)",
        "Lista corta para el horario del caso",
        "Soporte por correo",
      ],
      proBullets: [
        "Todo lo de Búsqueda",
        "Paquete de contratación a medida, enviado en la app",
        "Bóveda de credenciales y documentos",
        "Prioridad para turnos urgentes",
        "Soporte por teléfono y correo",
      ],
      searchItems: [
        "Búsqueda por dirección y horario",
        "Mapa y vista semanal de cuidadores disponibles",
        "Solicitudes en la app (primer contacto en Kuidao)",
        "Lista corta para el horario del caso",
        "Acceso para la oficina",
        "Soporte por correo",
      ],
      proItems: [
        "Todo lo de Búsqueda",
        "Paquete de contratación a medida, enviado en la app",
        "Bóveda de credenciales y documentos",
        "Prioridad para turnos urgentes",
        "Ayuda de incorporación dedicada",
        "Soporte por teléfono y correo",
      ],
      talkToUs: "Hablar con nosotros",
      compare: "Comparar planes",
      faqTitle: "Preguntas",
      faqLead: "Unas respuestas antes de empezar.",
      faqItems: [
        {
          id: "item-1",
          q: "¿Para quién es?",
          a: "Para registros de enfermería, home health y agencias de cuidado en el hogar de Florida que cubren a sus propios pacientes.",
        },
        {
          id: "item-2",
          q: "¿Qué tan rápido responden los cuidadores?",
          a: "La solicitud les llega al teléfono y responden en la app. Ves las respuestas a medida que entran. No hay un tiempo de respuesta prometido.",
        },
        {
          id: "item-3",
          q: "¿Qué zonas cubre?",
          a: "Kuidao empieza en Florida, incluidos Miami-Dade, Broward y Palm Beach, y está hecho para crecer en todo el país.",
        },
        {
          id: "item-4",
          q: "¿Quién paga?",
          a: "Paga la agencia. Búsqueda cuesta $299 al mes. Pro se cotiza para la oficina. Los cuidadores entran gratis y no ven planes ni precios.",
        },
        {
          id: "item-5",
          q: "¿Puedo cancelar?",
          a: "Búsqueda es un plan mensual. Puedes cancelar desde la cuenta de la oficina antes del mes siguiente. Esta vista previa no cobra una tarjeta.",
        },
        {
          id: "item-6",
          q: "¿Qué pasa cuando un cuidador acepta?",
          a: "Envías tu paquete de contratación en la app. Completan tus documentos. El cuidador contrata con tu agencia, no con Kuidao.",
        },
        {
          id: "item-7",
          q: "¿Una familia puede contratar aquí?",
          a: "No. Las familias y los clientes particulares no contratan en Kuidao.",
        },
        {
          id: "item-8",
          q: "¿Necesito un número de licencia para crear la cuenta?",
          a: "No. Crear una cuenta de agencia no pide un número de licencia estatal.",
        },
      ],
      testimonialsKicker: "Historias ilustrativas",
      testimonialsTitle: "Agencias que cubren casos con Kuidao",
      testimonials: [
        {
          quote: "Una cuidadora avisó a las 6 a. m. Tuvimos a alguien para ese caso antes del almuerzo.",
          name: "Marisol V.",
          role: "Administradora de agencia",
          initials: "MV",
        },
        {
          quote: "Necesitábamos una HHA de fin de semana casi sin aviso. Enviamos la solicitud y cubrimos el sábado.",
          name: "Andre C.",
          role: "Responsable de horarios",
          initials: "AC",
        },
        {
          quote: "La dirección era difícil de cubrir. Aun así encontramos a alguien que la aceptó.",
          name: "Lila O.",
          role: "Gerente de oficina",
          initials: "LO",
        },
        {
          quote: "En la casa hablaban español e inglés. Emparejamos a una cuidadora que usaba los dos.",
          name: "James O.",
          role: "Administrador de agencia",
          initials: "JO",
        },
        {
          quote: "La misma HHA volvió en los tres casos siguientes. La oficina ya la conocía.",
          name: "Carmen D.",
          role: "Responsable de horarios",
          initials: "CD",
        },
        {
          quote: "Un paciente nuevo empezó la misma semana. Teníamos una CNA en el horario antes de la primera visita.",
          name: "Elena B.",
          role: "Gerente de oficina",
          initials: "EB",
        },
        {
          quote: "La cobertura de tarde se quedaba abierta. Llenamos un horario de 5 a 9 el mismo día.",
          name: "Pedro A.",
          role: "Administrador de agencia",
          initials: "PA",
        },
        {
          quote: "Pedimos español e inglés en una lista corta. La persona hablaba los dos.",
          name: "Naomi C.",
          role: "Responsable de horarios",
          initials: "NC",
        },
        {
          quote: "Una cuidadora siguió siendo confiable en casos posteriores, y dejamos de empezar de cero.",
          name: "Rosa M.",
          role: "Gerente de oficina",
          initials: "RM",
        },
        {
          quote: "Una ausencia de último minuto un viernes. Cubrimos el turno antes de que se pasara el día.",
          name: "David S.",
          role: "Administrador de agencia",
          initials: "DS",
        },
        {
          quote: "La zona quedaba fuera de nuestro recorrido habitual. Igual vimos a alguien que podía llegar.",
          name: "Irene P.",
          role: "Responsable de horarios",
          initials: "IP",
        },
        {
          quote: "El ingreso de un paciente nuevo en fin de semana esperaba al lunes. Cubrimos el domingo.",
          name: "Luis F.",
          role: "Gerente de oficina",
          initials: "LF",
        },
      ],
      footerProduct: "Producto",
      footerCompany: "Compañía",
      footerLegalCol: "Legal",
      footerTerms: "Términos",
      footerPrivacy: "Privacidad",
      footerCopyright: "© 2026 Kuidao",
      footerCaregivers: "Para cuidadores",
    },
    caregiver: {
      heroKicker: "Para cuidadores",
      heroTitle: "Encuentra turnos. Siempre gratis.",
      heroBody:
        "Pon tus horas y tu zona. Las agencias te escriben en la app. Tu celular no se publica.",
      families: "Las familias no contratan aquí. Las agencias cubren sus propios casos.",
      signup: "Crear tu perfil",
      preview: "Ver la app",
      howKicker: "Cómo funciona",
      howTitle: "Tres pasos",
      steps: [
        {
          key: "profile",
          title: "Crea tu perfil",
          body: "Nombre, rol, zona e idiomas. Gratis.",
        },
        {
          key: "hours",
          title: "Pon tus horas y tu zona",
          body: "Muestra cuándo puedes trabajar y hasta dónde llegas.",
        },
        {
          key: "requests",
          title: "Recibe solicitudes en la app",
          body: "Acepta o di que no. No hay una lista pública de teléfonos.",
        },
      ],
      featuresKicker: "Para ti",
      featuresTitle: "Simple en el teléfono",
      features: [
        {
          key: "free",
          title: "Gratis siempre",
          body: "El cuidador no paga por entrar ni por usar Kuidao.",
        },
        {
          key: "hours",
          title: "Horas y zona",
          body: "Tú decides cuándo estás libre y hasta dónde puedes ir.",
        },
        {
          key: "requests",
          title: "Solicitudes en la app",
          body: "Las agencias te contactan primero aquí.",
        },
        {
          key: "documents",
          title: "Documentos en el teléfono",
          body: "Ten a mano tu identificación y tus certificados.",
        },
      ],
      bandKicker: "En tu teléfono",
      bandBody: "Solicitudes, horas y documentos — en el teléfono.",
      bandCta: "Abrir vista previa",
    },
    signIn: {
      title: "Entrar",
      email: "Correo o celular",
      password: "Contraseña",
      submit: "Entrar",
      done: "Solo una vista previa. Las cuentas todavía no están activas.",
      openSearch: "Abrir búsqueda",
      new: "¿Primera vez?",
      doors: "Agencia o cuidador",
    },
    agencySignup: {
      kicker: "Agencia",
      title: "Crear oficina",
      body: "Para agencias que cubren sus propios casos. La oficina paga un plan mensual. Cualquiera puede registrarse. Esta demo no guarda cuentas.",
      legalName: "Nombre legal",
      email: "Correo de trabajo",
      plan: "Plan",
      searchPlan: "Búsqueda · ${price}",
      proPlan: "Pro · Consultar precio",
      continue: "Continuar",
      done: "Recibimos tu solicitud. Esta demo todavía no guarda cuentas.",
      openSearch: "Abrir la búsqueda de prueba",
      caregiver: "¿Eres cuidador? Registro gratis",
    },
    caregiverSignup: {
      kicker: "Gratis",
      title: "Crear tu perfil",
      body: "Las agencias ven tu nombre, tu zona y tus idiomas. No ven tu celular. Siempre es gratis.",
      first: "Nombre",
      last: "Apellido",
      phone: "Celular",
      role: "Rol",
      roles: [
        { value: "HHA", label: "HHA" },
        { value: "CNA", label: "CNA" },
        { value: "Companion", label: "Acompañante" },
        { value: "LPN", label: "LPN" },
      ],
      zone: "Zona / códigos",
      zonePlaceholder: "33166, Hialeah…",
      continue: "Continuar",
      done: "Perfil de prueba. Todavía no se guarda nada.",
      seeApp: "Ver la app",
    },
    legal: {
      kicker: "Legal",
      title: "Cómo funciona Kuidao",
      later:
        "Los Términos y la Política de privacidad se publicarán más adelante, antes del lanzamiento. Crear una cuenta de agencia no exige un número de licencia del estado.",
    },
    search: {
      kicker: "Demo para agencias",
      title: "Cubrir un turno",
      address: "Dirección",
      language: "Idioma",
      any: "Cualquiera",
      spanish: "Español",
      english: "Inglés",
      submit: "Buscar",
      note: "La dirección se usa solo en esta búsqueda. No se guarda como ficha de un paciente.",
      matches: "Coincidencias",
      empty: "Busca para ver quién está libre.",
      request: "Solicitar",
    },
    preview: {
      greeting: "Hola, María",
      newLabel: "Nuevo",
      shift: "HHA · Hialeah · 8:00–2:00",
      distance: "~1.5 mi",
      accept: "Aceptar",
      decline: "No",
      hours: "Horas",
      days: ["L", "M", "X", "J", "V", "S", "D"],
      documents: "Documentos",
      id: "ID",
      ready: "Listo",
      hha: "HHA",
      cpr: "CPR",
      cprStatus: "21 días",
    },
    units: { mi: "mi" },
  },
};

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
