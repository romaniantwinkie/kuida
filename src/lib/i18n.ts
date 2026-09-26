export type Locale = "en" | "es";

export type AgencyStepKey = "search" | "message" | "hire";

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
    menu: string;
    signUpFree: string;
    forAgencies: string;
    howLink: string;
    badge: string;
    heroTitle: string;
    heroBody: string;
    seeHow: string;
    demo: string;
    feed: { title: string; detail: string; time: string }[];
    benefitsTitle: string;
    benefits: { title: string; body: string }[];
    howKicker: string;
    howTitle: string;
    howBody: string;
    steps: { title: string; body: string }[];
    compareKicker: string;
    compareTitle: string;
    compareBody: string;
    kuidaoName: string;
    kuidaoBody: string;
    kuidaoPoints: string[];
    oldName: string;
    oldBody: string;
    oldPoints: string[];
    docsKicker: string;
    docsTitle: string;
    docsBody: string;
    docsHint: string;
    areaKicker: string;
    areaTitle: string;
    areaBody: string;
    areaPlace: string;
    days: string[];
    shifts: string[];
    ctaTitle: string;
    ctaBody: string;
    footerProduct: string;
    footerCompany: string;
    footerLegalCol: string;
    footerTerms: string;
    footerPrivacy: string;
    footerCopyright: string;
    footerHome: string;
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
  auth: {
    loginTab: string;
    signupTab: string;
    agencyTitle: string;
    caregiverTitle: string;
    agencyBody: string;
    caregiverBody: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    showPassword: string;
    hidePassword: string;
    remember: string;
    forgot: string;
    signIn: string;
    agencyName: string;
    agencyNamePlaceholder: string;
    fullName: string;
    fullNamePlaceholder: string;
    termsLead: string;
    terms: string;
    termsAnd: string;
    privacy: string;
    create: string;
    help: string;
    backHome: string;
    soon: string;
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
  shell: {
    demo: string;
    demoNote: string;
    notifications: string;
    notificationsEmpty: string;
    agencyName: string;
    userName: string;
    userRole: string;
    openMenu: string;
    closeMenu: string;
    collapse: string;
    expand: string;
    nav: {
      dashboard: string;
      find: string;
      requests: string;
      messages: string;
      caregivers: string;
      settings: string;
    };
    inbox: {
      title: string;
      search: string;
      empty: string;
      placeholder: string;
      send: string;
      open: string;
      you: string;
    };
    dashboard: {
      title: string;
      body: string;
      openRequests: string;
      nearby: string;
      messages: string;
      recent: string;
      viewAll: string;
    };
    find: {
      title: string;
      body: string;
      list: string;
      empty: string;
      request: string;
      requested: string;
      address: string;
      addressPlaceholder: string;
      schedule: string;
      from: string;
      to: string;
      days: { key: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"; label: string }[];
      languages: string;
      anyLanguage: string;
      languageEnglish: string;
      languageSpanish: string;
      languageCreole: string;
      hideNoDrive: string;
      drives: string;
      doesNotDrive: string;
      yes: string;
      no: string;
      clear: string;
      close: string;
      availability: string;
    };
    requests: {
      title: string;
      body: string;
      case: string;
      when: string;
      area: string;
      status: string;
      open: string;
      filled: string;
    };
    caregiversPage: { title: string; body: string; saved: string; contacted: string };
    settings: {
      title: string;
      body: string;
      name: string;
      email: string;
      phone: string;
      area: string;
      save: string;
      saved: string;
    };
    cases: { title: string; role: string; when: string; area: string; status: "open" | "filled" }[];
    threads: { from: string; topic: string }[];
  };
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
      menu: "Menu",
      signUpFree: "Sign up free",
      forAgencies: "For agencies",
      howLink: "How it works",
      badge: "Always free for caregivers",
      heroTitle: "Get found by every agency near you — without calling one by one",
      heroBody:
        "Complete your profile once. Set your area and schedule. Upload your documents. Then apply in one tap when a case fits.",
      seeHow: "See how it works",
      demo: "Demo",
      feed: [
        { title: "Profile viewed", detail: "An agency near you viewed your profile", time: "2m ago" },
        { title: "New case nearby", detail: "New live-in case near Hialeah", time: "8m ago" },
        { title: "Schedule saved", detail: "Your schedule preferences saved", time: "Just now" },
        { title: "A match", detail: "A weekend case matches your area", time: "14m ago" },
      ],
      benefitsTitle: "One profile. Nearby agencies.",
      benefits: [
        { title: "Seen at once", body: "Be seen by all the agencies in your area at once." },
        { title: "No more calling around", body: "No more calling agency after agency to find a case." },
        { title: "Apply in one tap", body: "Fill your profile and upload documents once — apply in one tap." },
        { title: "Area and schedule", body: "Set your area and schedule preferences from the start." },
      ],
      howKicker: "How it works",
      howTitle: "Up and running in four steps",
      howBody: "From a free account to one-tap apply. Built for a phone.",
      steps: [
        { title: "Create your free account", body: "Sign up on your phone. Caregivers never pay." },
        { title: "Set your area and schedule", body: "Tell agencies where you work and when you are free." },
        { title: "Upload your documents once", body: "Keep your ID and certificates ready for every apply." },
        { title: "Get seen, then apply", body: "Agencies near you can view you. Apply in one tap when a case fits." },
      ],
      compareKicker: "Why Kuidao",
      compareTitle: "One profile, not another phone call",
      compareBody: "The old way is a stack of calls and the same paperwork. Kuidao keeps it in one place.",
      kuidaoName: "Kuidao",
      kuidaoBody: "One profile that nearby agencies can see.",
      kuidaoPoints: [
        "One profile for every nearby agency",
        "Documents uploaded once",
        "Apply in one tap",
        "Area and schedule set up front",
        "Free for caregivers",
      ],
      oldName: "The old way",
      oldBody: "Calling each office and waiting to hear back.",
      oldPoints: [
        "Call each office one by one",
        "Resend the same paperwork",
        "Wait on callbacks",
        "No clear schedule fit",
      ],
      docsKicker: "Documents",
      docsTitle: "Upload once. Reuse on every apply.",
      docsBody: "A preview of the document card. Nothing is uploaded or saved.",
      docsHint: "Drag a file here, or tap to choose one.",
      areaKicker: "Area and schedule",
      areaTitle: "Tell agencies where you work and when you’re free.",
      areaBody: "A preview. Tap a day or a shift. Nothing is saved.",
      areaPlace: "Hialeah",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      shifts: ["Day", "Evening", "Overnight", "Live-in"],
      ctaTitle: "Ready to get found?",
      ctaBody: "Always free for caregivers. Create your profile on your phone.",
      footerProduct: "Product",
      footerCompany: "Company",
      footerLegalCol: "Legal",
      footerTerms: "Terms",
      footerPrivacy: "Privacy",
      footerCopyright: "© 2026 Kuidao",
      footerHome: "Home",
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
    auth: {
      loginTab: "Log in",
      signupTab: "Sign up",
      agencyTitle: "Agency account",
      caregiverTitle: "Caregiver account",
      agencyBody: "Log in or create an account.",
      caregiverBody: "Log in or create an account.",
      email: "Email",
      emailPlaceholder: "you@email.com",
      password: "Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      remember: "Remember me",
      forgot: "Forgot password?",
      signIn: "Sign in",
      agencyName: "Agency name",
      agencyNamePlaceholder: "Your agency",
      fullName: "Full name",
      fullNamePlaceholder: "Your name",
      termsLead: "I agree to the",
      terms: "Terms",
      termsAnd: "and",
      privacy: "Privacy",
      create: "Create account",
      help: "Need help?",
      backHome: "Back home",
      soon: "Coming soon. This preview does not save accounts.",
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
    shell: {
      demo: "Demo",
      demoNote: "Sample office. This is not a real agency or a live account.",
      notifications: "Notifications",
      notificationsEmpty: "No new notifications.",
      agencyName: "Lumen Home Care",
      userName: "Alex Rivera",
      userRole: "Office admin",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      collapse: "Collapse sidebar",
      expand: "Expand sidebar",
      nav: {
        dashboard: "Dashboard",
        find: "Find caregivers",
        requests: "Requests",
        messages: "Messages",
        caregivers: "Caregivers",
        settings: "Settings",
      },
      inbox: {
        title: "Messages",
        search: "Search conversations",
        empty: "No conversations match.",
        placeholder: "Write a message",
        send: "Send",
        open: "Open",
        you: "You",
      },
      dashboard: {
        title: "Dashboard",
        body: "A sample morning for this demo office.",
        openRequests: "Open requests",
        nearby: "Caregivers nearby",
        messages: "Messages",
        recent: "Recent requests",
        viewAll: "View all",
      },
      find: {
        title: "Find caregivers",
        body: "Demo pins around Miami. Not a live search.",
        list: "Nearby",
        empty: "No one matches these filters.",
        request: "Request",
        requested: "Requested",
        address: "Address",
        addressPlaceholder: "Start typing a Miami address",
        schedule: "Schedule",
        from: "From",
        to: "To",
        days: [
          { key: "mon", label: "Mon" },
          { key: "tue", label: "Tue" },
          { key: "wed", label: "Wed" },
          { key: "thu", label: "Thu" },
          { key: "fri", label: "Fri" },
          { key: "sat", label: "Sat" },
          { key: "sun", label: "Sun" },
        ],
        languages: "Languages",
        anyLanguage: "Any language",
        languageEnglish: "English",
        languageSpanish: "Spanish",
        languageCreole: "Creole",
        hideNoDrive: "Hide caregivers who do not drive",
        drives: "Drives",
        doesNotDrive: "Does not drive",
        yes: "Yes",
        no: "No",
        clear: "Clear filters",
        close: "Close",
        availability: "Availability",
      },
      requests: {
        title: "Requests",
        body: "Cases this demo office has open.",
        case: "Case",
        when: "When",
        area: "Area",
        status: "Status",
        open: "Open",
        filled: "Filled",
      },
      caregiversPage: {
        title: "Caregivers",
        body: "People this demo office saved or contacted.",
        saved: "Saved",
        contacted: "Contacted",
      },
      settings: {
        title: "Settings",
        body: "Agency profile for this demo. Saving does not store anything.",
        name: "Agency name",
        email: "Work email",
        phone: "Office phone",
        area: "Service area",
        save: "Save",
        saved: "Demo only. Nothing was stored.",
      },
      cases: [
        { title: "Weekday mornings", role: "HHA", when: "Mon–Fri · 8:00–2:00", area: "Hialeah", status: "open" },
        { title: "Evening shift", role: "HHA", when: "Tue · 5:00–9:00", area: "Brickell", status: "open" },
        { title: "Saturday", role: "CNA", when: "Sat · 9:00–3:00", area: "Kendall", status: "filled" },
      ],
      threads: [
        { from: "Xiomara R.", topic: "Schedule question" },
        { from: "Ana P.", topic: "Availability" },
      ],
    },
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
      menu: "Menú",
      signUpFree: "Regístrate gratis",
      forAgencies: "Para agencias",
      howLink: "Cómo funciona",
      badge: "Siempre gratis para cuidadores",
      heroTitle: "Que te encuentren las agencias cerca de ti — sin llamar una por una",
      heroBody:
        "Completa tu perfil una vez. Indica tu zona y tu horario. Sube tus documentos. Luego postúlate con un toque cuando un caso encaje.",
      seeHow: "Ver cómo funciona",
      demo: "Demo",
      feed: [
        { title: "Vieron tu perfil", detail: "Una agencia cerca de ti vio tu perfil", time: "hace 2 min" },
        { title: "Caso nuevo cerca", detail: "Nuevo caso interno cerca de Hialeah", time: "hace 8 min" },
        { title: "Horario guardado", detail: "Tus preferencias de horario quedaron listas", time: "ahora" },
        { title: "Una coincidencia", detail: "Un caso de fin de semana coincide con tu zona", time: "hace 14 min" },
      ],
      benefitsTitle: "Un perfil. Agencias cercanas.",
      benefits: [
        { title: "Te ven a la vez", body: "Que te vean todas las agencias de tu zona al mismo tiempo." },
        { title: "Sin llamar de oficina en oficina", body: "Ya no llamas a una agencia tras otra para encontrar un caso." },
        { title: "Postúlate con un toque", body: "Llena tu perfil y sube tus documentos una vez. Luego postúlate con un toque." },
        { title: "Zona y horario", body: "Indica tu zona y tu horario desde el principio." },
      ],
      howKicker: "Cómo funciona",
      howTitle: "Listo en cuatro pasos",
      howBody: "De una cuenta gratis a postularte con un toque. Hecho para el teléfono.",
      steps: [
        { title: "Crea tu cuenta gratis", body: "Regístrate en el teléfono. El cuidador nunca paga." },
        { title: "Indica tu zona y tu horario", body: "Diles a las agencias dónde trabajas y cuándo estás libre." },
        { title: "Sube tus documentos una vez", body: "Ten a mano tu identificación y tus certificados para cada postulación." },
        { title: "Que te vean, y postúlate", body: "Las agencias cerca de ti pueden verte. Postúlate con un toque cuando un caso encaje." },
      ],
      compareKicker: "Por qué Kuidao",
      compareTitle: "Un perfil, no otra llamada",
      compareBody: "Lo de antes es una pila de llamadas y los mismos papeles. Kuidao lo deja en un solo lugar.",
      kuidaoName: "Kuidao",
      kuidaoBody: "Un perfil que las agencias cercanas pueden ver.",
      kuidaoPoints: [
        "Un perfil para cada agencia cercana",
        "Documentos subidos una vez",
        "Postularte con un toque",
        "Zona y horario desde el inicio",
        "Gratis para cuidadores",
      ],
      oldName: "Lo de antes",
      oldBody: "Llamar a cada oficina y esperar respuesta.",
      oldPoints: [
        "Llamar a cada oficina una por una",
        "Reenviar los mismos papeles",
        "Esperar que devuelvan la llamada",
        "Sin un horario claro",
      ],
      docsKicker: "Documentos",
      docsTitle: "Súbelos una vez. Úsalos en cada postulación.",
      docsBody: "Una vista previa de la tarjeta de documentos. No se sube ni se guarda nada.",
      docsHint: "Arrastra un archivo aquí, o toca para elegirlo.",
      areaKicker: "Zona y horario",
      areaTitle: "Diles a las agencias dónde trabajas y cuándo estás libre.",
      areaBody: "Una vista previa. Toca un día o un turno. No se guarda nada.",
      areaPlace: "Hialeah",
      days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      shifts: ["Día", "Tarde", "Noche", "Interno"],
      ctaTitle: "¿Quieres que te encuentren?",
      ctaBody: "Siempre gratis para cuidadores. Crea tu perfil en el teléfono.",
      footerProduct: "Producto",
      footerCompany: "Compañía",
      footerLegalCol: "Legal",
      footerTerms: "Términos",
      footerPrivacy: "Privacidad",
      footerCopyright: "© 2026 Kuidao",
      footerHome: "Inicio",
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
    auth: {
      loginTab: "Entrar",
      signupTab: "Registro",
      agencyTitle: "Cuenta de agencia",
      caregiverTitle: "Cuenta de cuidador",
      agencyBody: "Entra o crea una cuenta.",
      caregiverBody: "Entra o crea una cuenta.",
      email: "Correo",
      emailPlaceholder: "tu@correo.com",
      password: "Contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      remember: "Recordarme",
      forgot: "¿Olvidaste tu contraseña?",
      signIn: "Entrar",
      agencyName: "Nombre de la agencia",
      agencyNamePlaceholder: "Tu agencia",
      fullName: "Nombre completo",
      fullNamePlaceholder: "Tu nombre",
      termsLead: "Acepto los",
      terms: "Términos",
      termsAnd: "y la",
      privacy: "Privacidad",
      create: "Crear cuenta",
      help: "¿Necesitas ayuda?",
      backHome: "Volver al inicio",
      soon: "Pronto. Esta vista previa no guarda cuentas.",
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
    shell: {
      demo: "Demo",
      demoNote: "Oficina de muestra. No es una agencia real ni una cuenta activa.",
      notifications: "Avisos",
      notificationsEmpty: "No hay avisos nuevos.",
      agencyName: "Lumen Home Care",
      userName: "Alex Rivera",
      userRole: "Administración",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      collapse: "Contraer menú",
      expand: "Expandir menú",
      nav: {
        dashboard: "Inicio",
        find: "Buscar cuidadores",
        requests: "Solicitudes",
        messages: "Mensajes",
        caregivers: "Cuidadores",
        settings: "Ajustes",
      },
      inbox: {
        title: "Mensajes",
        search: "Buscar conversaciones",
        empty: "Ninguna conversación coincide.",
        placeholder: "Escribe un mensaje",
        send: "Enviar",
        open: "Abrir",
        you: "Tú",
      },
      dashboard: {
        title: "Inicio",
        body: "Una mañana de muestra para esta oficina demo.",
        openRequests: "Solicitudes abiertas",
        nearby: "Cuidadores cerca",
        messages: "Mensajes",
        recent: "Solicitudes recientes",
        viewAll: "Ver todas",
      },
      find: {
        title: "Buscar cuidadores",
        body: "Pines de demostración en Miami. No es una búsqueda en vivo.",
        list: "Cerca",
        empty: "Nadie coincide con estos filtros.",
        request: "Solicitar",
        requested: "Solicitado",
        address: "Dirección",
        addressPlaceholder: "Empieza a escribir una dirección en Miami",
        schedule: "Horario",
        from: "De",
        to: "A",
        days: [
          { key: "mon", label: "Lun" },
          { key: "tue", label: "Mar" },
          { key: "wed", label: "Mié" },
          { key: "thu", label: "Jue" },
          { key: "fri", label: "Vie" },
          { key: "sat", label: "Sáb" },
          { key: "sun", label: "Dom" },
        ],
        languages: "Idiomas",
        anyLanguage: "Cualquier idioma",
        languageEnglish: "Inglés",
        languageSpanish: "Español",
        languageCreole: "Criollo",
        hideNoDrive: "Ocultar cuidadores que no conducen",
        drives: "Conduce",
        doesNotDrive: "No conduce",
        yes: "Sí",
        no: "No",
        clear: "Quitar filtros",
        close: "Cerrar",
        availability: "Disponibilidad",
      },
      requests: {
        title: "Solicitudes",
        body: "Casos que esta oficina demo tiene abiertos.",
        case: "Caso",
        when: "Horario",
        area: "Zona",
        status: "Estado",
        open: "Abierta",
        filled: "Cubierta",
      },
      caregiversPage: {
        title: "Cuidadores",
        body: "Personas que esta oficina demo guardó o contactó.",
        saved: "Guardados",
        contacted: "Contactados",
      },
      settings: {
        title: "Ajustes",
        body: "Perfil de la agencia en esta demo. Guardar no almacena nada.",
        name: "Nombre de la agencia",
        email: "Correo de trabajo",
        phone: "Teléfono",
        area: "Zona de servicio",
        save: "Guardar",
        saved: "Solo demo. No se guardó nada.",
      },
      cases: [
        { title: "Mañanas entre semana", role: "HHA", when: "Lun–Vie · 8:00–14:00", area: "Hialeah", status: "open" },
        { title: "Turno de tarde", role: "HHA", when: "Mar · 17:00–21:00", area: "Brickell", status: "open" },
        { title: "Sábado", role: "CNA", when: "Sáb · 9:00–15:00", area: "Kendall", status: "filled" },
      ],
      threads: [
        { from: "Xiomara R.", topic: "Pregunta de horario" },
        { from: "Ana P.", topic: "Disponibilidad" },
      ],
    },
  },
};

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
