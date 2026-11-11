// Onboarding documents caregivers keep in their Cercana vault, and the default list agencies ask for.
// Agencies edit their own list (required / optional / removed, plus custom documents) in Settings.

export type DocKey = string;
export type DocDef = {
  key: DocKey;
  en: string;
  es: string;
  /** Has an expiry date the caregiver gets reminded about. */
  expires?: boolean;
  /** Highly sensitive: never part of a profile; shared only after the caregiver connects with that agency and approves. */
  sensitive?: boolean;
};

/** What most home care agencies and nurse registries ask an HHA or CNA for. */
export const DEFAULT_DOCUMENTS: DocDef[] = [
  { key: "license", en: "HHA or CNA license", es: "Licencia de HHA o CNA", expires: true },
  { key: "work_authorization", en: "Proof of residency, citizenship or work permit", es: "Prueba de residencia, ciudadanía o permiso de trabajo", sensitive: true },
  { key: "ssn_card", en: "Social Security card", es: "Tarjeta del Seguro Social", sensitive: true },
  { key: "drivers_license", en: "Driver's license", es: "Licencia de conducir", expires: true },
  { key: "cpr", en: "CPR certificate", es: "Certificado de CPR", expires: true },
  { key: "physical_exam", en: "Physical exam", es: "Examen físico", expires: true },
  { key: "vehicle_insurance", en: "Vehicle insurance", es: "Seguro de vehículo", expires: true },
  { key: "vehicle_registration", en: "Vehicle registration", es: "Registro del vehículo", expires: true },
  { key: "liability_insurance", en: "Liability insurance", es: "Seguro de responsabilidad (liability)", expires: true },
  { key: "bank_info", en: "Bank account in your name (account and routing number)", es: "Información bancaria a su nombre (número de cuenta y ruta)", sensitive: true },
  { key: "inservice_12h", en: "12 hours of in-service training (HIV/AIDS required)", es: "12 horas de in-services (HIV/AIDS requerido)", expires: true },
  { key: "adrd", en: "ADRD Alzheimer's training (Elder Affairs)", es: "Training de Alzheimer's ADRD (Elder Affairs)" },
];

/** Common extras an agency can add with one tap. */
export const EXTRA_DOCUMENTS: DocDef[] = [
  { key: "background_level2", en: "Level 2 background check", es: "Verificación de antecedentes nivel 2", expires: true },
  { key: "tb_test", en: "TB test", es: "Prueba de TB", expires: true },
  { key: "first_aid", en: "First aid certificate", es: "Certificado de primeros auxilios", expires: true },
  { key: "w9", en: "W-9 (independent contractor)", es: "W-9 (contratista independiente)" },
  { key: "contractor_agreement", en: "Independent contractor agreement", es: "Acuerdo de contratista independiente" },
  { key: "references", en: "Two professional references", es: "Dos referencias profesionales" },
  { key: "immunizations", en: "Immunization records", es: "Registro de vacunas" },
  { key: "hipaa_training", en: "HIPAA training certificate", es: "Certificado de entrenamiento HIPAA", expires: true },
];

export const ALL_DOCUMENTS = [...DEFAULT_DOCUMENTS, ...EXTRA_DOCUMENTS];
export const docByKey = (key: string) => ALL_DOCUMENTS.find((d) => d.key === key);

export type Requirement = { key: DocKey; en: string; es: string; status: "required" | "optional"; custom: boolean };

export const DEFAULT_REQUIREMENTS: Requirement[] = DEFAULT_DOCUMENTS.map((d) => ({ key: d.key, en: d.en, es: d.es, status: "required", custom: false }));
