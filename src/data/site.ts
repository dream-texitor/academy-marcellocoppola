export const site = {
  name: "Marcello Coppola Academy",
  payoff: "AI Literacy • Formazione • Innovazione digitale",
  url: "https://academy.marcellocoppola.com",
  email: "academy@marcellocoppola.com",
  phone: "[inserire telefono]",
  provider: "TENET S.r.l.",
  legalNote:
    "I percorsi non costituiscono una certificazione di conformità complessiva all'AI Act. La finalità è fornire formazione documentabile di AI Literacy e supportare organizzazioni e persone nell'adozione di buone pratiche per l'uso consapevole dell'intelligenza artificiale."
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "AI Act e AI Literacy", href: "/formazione-ai-act-ai-literacy" },
  { label: "Hotel", href: "/corso-ai-literacy-hotel-strutture-ricettive" },
  { label: "Aziende e Professionisti", href: "/corso-ai-literacy-aziende-professionisti" },
  { label: "PA e Comuni", href: "/formazione-ai-literacy-pubblica-amministrazione" },
  { label: "Cittadini", href: "/corso-intelligenza-artificiale-cittadini" },
  { label: "Chi sono", href: "/marcello-coppola-formatore-ai" },
  { label: "Contatti", href: "/richiedi-proposta-formazione-ai" }
];

export const faq = [
  {
    question: "L'AI Act impone un corso specifico?",
    answer:
      "No. L'AI Act non impone un corso unico o una certificazione specifica. Richiede però che le organizzazioni adottino misure per garantire un livello sufficiente di AI Literacy rispetto agli strumenti utilizzati, ai ruoli e al contesto operativo."
  },
  {
    question: "Il percorso rilascia una certificazione AI Act?",
    answer:
      "No. Il percorso non rilascia una certificazione di conformità complessiva all'AI Act. Rilascia attestati di partecipazione e documentazione dell'attività formativa svolta."
  },
  {
    question: "Perché è utile un fascicolo documentale?",
    answer:
      "Il fascicolo consente all'organizzazione di conservare evidenza delle misure formative adottate: programma, registro presenze, test, attestati, mini-policy e relazione conclusiva."
  },
  {
    question: "Il corso è adatto a chi non ha competenze tecniche?",
    answer:
      "Sì. I percorsi sono progettati per persone che usano strumenti di IA nel lavoro quotidiano e non richiedono competenze tecniche avanzate."
  },
  {
    question: "È possibile personalizzare il corso?",
    answer:
      "Sì. I percorsi possono essere adattati al settore, agli strumenti utilizzati, al numero di partecipanti e al livello di documentazione richiesto."
  }
];

export const methodItems = [
  "check iniziale sugli usi dell'IA",
  "formazione pratica",
  "esempi per settore",
  "test finale",
  "registro presenze",
  "attestati di partecipazione",
  "mini-policy interna",
  "relazione conclusiva"
];

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  slogan: site.payoff,
  legalName: site.provider
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marcello Coppola",
  jobTitle: "Formatore AI AICA",
  url: `${site.url}/marcello-coppola-formatore-ai`,
  worksFor: {
    "@type": "Organization",
    name: site.name
  },
  knowsAbout: [
    "AI Literacy",
    "AI Act",
    "Intelligenza artificiale generativa",
    "Turismo digitale",
    "Comunicazione pubblica"
  ]
};
