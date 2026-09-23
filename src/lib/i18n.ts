export type Locale = "en" | "es";

export type AgencyStepKey = "search" | "message" | "hire";
export type AgencyFeatureKey = "address" | "week" | "message" | "packet" | "capped";
export type AgencyTrustKey = "patients" | "caregivers" | "families" | "software";
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
    agencySubtitle: string;
    caregiverSubtitle: string;
    agencyImageAlt: string;
    caregiverImageAlt: string;
  };
  agency: {
    heroKicker: string;
    heroTitle: string;
    heroBody: string;
    families: string;
    freeLine: string;
    geo: string;
    getStarted: string;
    seeSearch: string;
    nearby: string;
    radius: string;
    howKicker: string;
    howTitle: string;
    steps: CopyBlock<AgencyStepKey>[];
    featuresKicker: string;
    featuresTitle: string;
    features: CopyBlock<AgencyFeatureKey>[];
    trustKicker: string;
    trustTitle: string;
    trust: CopyBlock<AgencyTrustKey>[];
    pricingKicker: string;
    pricingTitle: string;
    pricingBody: string;
    searchName: string;
    proName: string;
    perMonth: string;
    seats: string;
    searchItems: string[];
    proItems: string[];
    start: string;
    caregiverCta: string;
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
      agencyButton: "I am an Agency",
      caregiverButton: "I am a Caregiver",
      agencySubtitle: "Choose from hundreds of available caregivers",
      caregiverSubtitle: "Find work from multiple agencies at once",
      agencyImageAlt: "Care coordinators reviewing a case together",
      caregiverImageAlt: "Caregiver sitting with a client at home",
    },
    agency: {
      heroKicker: "For agencies",
      heroTitle: "Cover the shift when your roster is empty.",
      heroBody:
        "Kuidao is software for home care, nurse registry, and home health agencies. Search by address and hours, message in the app, and hire with your own packet.",
      families: "Families and private clients do not hire here.",
      freeLine: "Caregivers join free. Agencies pay monthly.",
      geo: "Starting in Florida. Built to expand nationwide.",
      getStarted: "Get started",
      seeSearch: "See search",
      nearby: "Nearby now",
      radius: "3 mi",
      howKicker: "How it works",
      howTitle: "Three steps to fill a case",
      steps: [
        {
          key: "search",
          title: "Search by address and schedule",
          body: "Enter where the case is and the hours you need covered.",
        },
        {
          key: "message",
          title: "Message in the app",
          body: "First contact stays in Kuidao. There is no public phone book.",
        },
        {
          key: "hire",
          title: "Hire with your packet",
          body: "On Pro, send your contract and keep credentials in the vault.",
        },
      ],
      featuresKicker: "Features",
      featuresTitle: "Built for a short lookup",
      features: [
        {
          key: "address",
          title: "Address and hours",
          body: "See who is free near the case, for that window.",
        },
        {
          key: "week",
          title: "Map and week grid",
          body: "Pins and a 7-day view, made for a quick lookup.",
        },
        {
          key: "message",
          title: "In-app first contact",
          body: "Phone numbers stay private. Contact starts in the app.",
        },
        {
          key: "packet",
          title: "Pro packet and vault",
          body: "Your hiring packet, signed on their phone, with a credential vault.",
        },
        {
          key: "capped",
          title: "Capped results",
          body: "A short list for the shift. We do not dump the whole book.",
        },
      ],
      trustKicker: "Who it is for",
      trustTitle: "Agencies staffing their own cases",
      trust: [
        {
          key: "patients",
          title: "Your patients, your cases",
          body: "Home care, nurse registry, and home health teams covering people they already serve.",
        },
        {
          key: "caregivers",
          title: "Caregivers join free",
          body: "They set hours and area, then get requests in the app. They do not pay Kuidao.",
        },
        {
          key: "families",
          title: "Not for private families",
          body: "Families and private clients do not hire caregivers on Kuidao.",
        },
        {
          key: "software",
          title: "Not a registry or employer",
          body: "Kuidao is software. Caregivers contract with your agency, not with us.",
        },
      ],
      pricingKicker: "Agencies only",
      pricingTitle: "Pricing",
      pricingBody: "Per office. Unlimited fills. Caregivers join free.",
      searchName: "Search",
      proName: "Pro",
      perMonth: "/mo",
      seats: "{n} seats",
      searchItems: ["Map and schedule search", "In-app requests"],
      proItems: ["Everything in Search", "Hiring packet and vault"],
      start: "Start",
      caregiverCta: "Caregiver? Join free",
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
      proPlan: "Pro · ${price}",
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
      agencyButton: "Soy una agencia",
      caregiverButton: "Soy cuidador",
      agencySubtitle: "Elige entre cientos de cuidadores disponibles",
      caregiverSubtitle: "Encuentra trabajo con varias agencias a la vez",
      agencyImageAlt: "Coordinadores de cuidado revisando un caso juntos",
      caregiverImageAlt: "Cuidador acompañando a un cliente en casa",
    },
    agency: {
      heroKicker: "Para agencias",
      heroTitle: "Cubre el turno cuando tu lista está vacía.",
      heroBody:
        "Kuidao es software para agencias de cuidado en el hogar, registros de enfermería y home health. Busca por dirección y horario, escribe en la app y contrata con tu propio paquete.",
      families: "Las familias y los clientes particulares no contratan aquí.",
      freeLine: "Los cuidadores entran gratis. La agencia paga un plan mensual.",
      geo: "Empezamos en Florida. Hecho para crecer en todo el país.",
      getStarted: "Empezar",
      seeSearch: "Ver búsqueda",
      nearby: "Cerca ahora",
      radius: "3 mi",
      howKicker: "Cómo funciona",
      howTitle: "Tres pasos para cubrir un caso",
      steps: [
        {
          key: "search",
          title: "Busca por dirección y horario",
          body: "Indica dónde es el caso y las horas que necesitas cubrir.",
        },
        {
          key: "message",
          title: "Escribe en la app",
          body: "El primer contacto queda en Kuidao. No hay un directorio público de teléfonos.",
        },
        {
          key: "hire",
          title: "Contrata con tu paquete",
          body: "En Pro, envía tu contrato y guarda las credenciales en la bóveda.",
        },
      ],
      featuresKicker: "Funciones",
      featuresTitle: "Hecho para una búsqueda corta",
      features: [
        {
          key: "address",
          title: "Dirección y horas",
          body: "Mira quién está libre cerca del caso, en ese horario.",
        },
        {
          key: "week",
          title: "Mapa y semana",
          body: "Pines y una vista de 7 días, para una búsqueda rápida.",
        },
        {
          key: "message",
          title: "Primer contacto en la app",
          body: "Los teléfonos siguen privados. El contacto empieza en la app.",
        },
        {
          key: "packet",
          title: "Paquete y bóveda en Pro",
          body: "Tu paquete de contratación, firmado en el teléfono, con bóveda de credenciales.",
        },
        {
          key: "capped",
          title: "Resultados limitados",
          body: "Una lista corta para el turno. No mostramos todo el directorio.",
        },
      ],
      trustKicker: "Para quién es",
      trustTitle: "Agencias que cubren sus propios casos",
      trust: [
        {
          key: "patients",
          title: "Tus pacientes, tus casos",
          body: "Equipos de cuidado en el hogar, registro de enfermería y home health que cubren a quienes ya atienden.",
        },
        {
          key: "caregivers",
          title: "Los cuidadores entran gratis",
          body: "Ponen horas y zona, y reciben solicitudes en la app. No le pagan a Kuidao.",
        },
        {
          key: "families",
          title: "No es para familias",
          body: "Las familias y los clientes particulares no contratan cuidadores en Kuidao.",
        },
        {
          key: "software",
          title: "No somos un registro ni un empleador",
          body: "Kuidao es software. El cuidador contrata con tu agencia, no con nosotros.",
        },
      ],
      pricingKicker: "Solo agencias",
      pricingTitle: "Precios",
      pricingBody: "Por oficina. Coberturas sin límite. Los cuidadores entran gratis.",
      searchName: "Búsqueda",
      proName: "Pro",
      perMonth: "/mes",
      seats: "{n} usuarios",
      searchItems: ["Búsqueda en mapa y horario", "Solicitudes en la app"],
      proItems: ["Todo lo de Búsqueda", "Paquete de contratación y bóveda"],
      start: "Empezar",
      caregiverCta: "¿Eres cuidador? Entra gratis",
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
      proPlan: "Pro · ${price}",
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
