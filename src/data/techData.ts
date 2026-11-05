/**
 * Technical layer for the user journey.
 *
 * Connects each journey moment (journeyData.ts) to the standards, tooling and
 * trust infrastructure that make it possible, so facilitators can answer
 * "how does that actually work?" without leaving the story.
 */

import { IG, SPEC } from './links';

export type ArchLayer = 'apps' | 'data' | 'trust';

export const ARCH_LAYERS: { id: ArchLayer; label: string; question: string; className: { soft: string; border: string; text: string; dot: string } }[] = [
  {
    id: 'apps',
    label: 'Tools & apps',
    question: 'What software is in people’s hands?',
    className: { soft: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', dot: 'bg-teal-500' },
  },
  {
    id: 'data',
    label: 'Data standards',
    question: 'How is the information structured so others can read it?',
    className: { soft: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', dot: 'bg-sky-500' },
  },
  {
    id: 'trust',
    label: 'Trust & exchange',
    question: 'How is it signed, shared, consented and audited?',
    className: { soft: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', dot: 'bg-indigo-500' },
  },
];

export type BuildingBlockId =
  | 'thai-his'
  | 'ohs-fhir-sdk'
  | 'ohs-sdc'
  | 'ohs-info-gateway'
  | 'ohs-data-pipes'
  | 'national-fhir'
  | 'family-wallet'
  | 'vhl-viewer'
  | 'fhir-r4'
  | 'smart-imm'
  | 'ips'
  | 'conceptmap'
  | 'plandefinition'
  | 'provenance'
  | 'dvc'
  | 'gdhcn'
  | 'vhl'
  | 'pcf'
  | 'audit';

export interface BuildingBlock {
  id: BuildingBlockId;
  name: string;
  short: string;
  layer: ArchLayer;
  owner: string;
  what: string;
  soWhat: string;
}

export const BUILDING_BLOCKS: BuildingBlock[] = [
  // ── Tools & apps ────────────────────────────────────────────────
  {
    id: 'thai-his',
    name: 'Thai hospital system + DVC issuing service',
    short: 'Thai hospital system',
    layer: 'apps',
    owner: 'Thailand MOPH',
    what: 'The hospital’s own information system records the birth doses and calls a national signing service to print Digital Vaccine Certificates.',
    soWhat: 'Thailand doesn’t need to change its hospital systems. It only needs to be able to sign certificates in the agreed format.',
  },
  {
    id: 'ohs-fhir-sdk',
    name: 'OHS FHIR SDK (FHIR Engine)',
    short: 'OHS FHIR SDK',
    layer: 'apps',
    owner: 'Open Health Stack (open source)',
    what: 'An open-source, multiplatform library for building apps that store FHIR data on the device, work fully offline and sync later.',
    soWhat: 'The CHW phone, clinic tablet and family wallet are all built on the same open building block, so data is FHIR from the first tap. No conversion step, no vendor lock-in.',
  },
  {
    id: 'ohs-sdc',
    name: 'OHS Structured Data Capture library',
    short: 'SDC library',
    layer: 'apps',
    owner: 'Open Health Stack (open source)',
    what: 'Renders FHIR Questionnaires as forms on the device and turns the answers into FHIR resources (extraction).',
    soWhat: 'The Ministry can change a registration form by publishing a new Questionnaire, without rebuilding the app.',
  },
  {
    id: 'ohs-info-gateway',
    name: 'OHS FHIR Info Gateway',
    short: 'Info Gateway (AuthZ)',
    layer: 'apps',
    owner: 'Open Health Stack (open source)',
    what: 'The authorization (AuthZ) layer in front of the national FHIR server. It checks the caller’s access token from the identity provider, applies access rules (role, facility, household, consent) to every request, and records each access.',
    soWhat: 'Every app, from the CHW phone to the Thai clinic viewer, goes through one front door. Lao PDR keeps the records at home and decides who can read or write what, including requests from abroad.',
  },
  {
    id: 'national-fhir',
    name: 'Lao national FHIR repository',
    short: 'National FHIR server',
    layer: 'apps',
    owner: 'Lao PDR MOH',
    what: 'The national store of immunization and health summary data, using the FHIR standard API.',
    soWhat: 'It is the one source of truth that the family wallet, clinics and VHL links all point back to.',
  },
  {
    id: 'ohs-data-pipes',
    name: 'OHS FHIR Data Pipes (analytics)',
    short: 'FHIR Data Pipes',
    layer: 'apps',
    owner: 'Open Health Stack (open source)',
    what: 'Open-source pipelines that copy FHIR data from the national server, including Provenance and AuditEvent, into analytics-ready tables for reports and dashboards.',
    soWhat: 'The Ministry sees patterns, not just single records: how many foreign certificates were verified, how often records are opened abroad, and any unusual access.',
  },
  {
    id: 'family-wallet',
    name: 'Family wallet app',
    short: 'Family wallet',
    layer: 'apps',
    owner: 'Lao PDR MOH (built on OHS)',
    what: 'A phone app that holds health summaries for several household members and can create shareable links.',
    soWhat: 'It puts the family in control of sharing, on a device they already own.',
  },
  {
    id: 'vhl-viewer',
    name: 'VHL viewer',
    short: 'VHL viewer',
    layer: 'apps',
    owner: 'Any conformant vendor (Thailand)',
    what: 'A web or tablet app that scans a VHL QR, takes the passcode, fetches the record and displays it.',
    soWhat: 'The Thai clinic needs no account in the Lao system. Any viewer that follows the VHL standard works.',
  },

  // ── Data standards ──────────────────────────────────────────────
  {
    id: 'fhir-r4',
    name: 'HL7 FHIR R4',
    short: 'FHIR R4',
    layer: 'data',
    owner: 'HL7 International',
    what: 'The global standard for representing and exchanging health data as resources (Patient, Immunization, …) over a web API.',
    soWhat: 'It is the common language. Every system in this story reads and writes the same resource shapes.',
  },
  {
    id: 'smart-imm',
    name: 'WHO SMART Guidelines: Immunizations',
    short: 'WHO SMART Immunizations',
    layer: 'data',
    owner: 'WHO',
    what: 'WHO’s machine-readable immunization guidance: data dictionary, FHIR profiles, PreQual vaccine product codes and schedule logic.',
    soWhat: 'Both countries use the same WHO vaccine codes and profiles, so a dose recorded in Thailand means the same thing in Lao PDR.',
  },
  {
    id: 'ips',
    name: 'HL7 International Patient Summary (IPS)',
    short: 'IPS',
    layer: 'data',
    owner: 'HL7 / ISO 27269',
    what: 'A standard, minimal health summary (immunizations, allergies, medications, problems) designed for care across borders.',
    soWhat: 'The Thai doctor gets a predictable summary they know how to read, not a dump of another country’s records.',
  },
  {
    id: 'conceptmap',
    name: 'FHIR ConceptMap (terminology mapping)',
    short: 'ConceptMap',
    layer: 'data',
    owner: 'HL7 FHIR',
    what: 'A FHIR resource that records how a code in one system maps to a code in another, including who decided and how confident they are.',
    soWhat: 'Foreign vaccines are translated without overwriting them. The original Thai code stays alongside the Lao one.',
  },
  {
    id: 'plandefinition',
    name: 'FHIR PlanDefinition + CQL (schedule logic)',
    short: 'PlanDefinition / CQL',
    layer: 'data',
    owner: 'HL7 FHIR / WHO SMART',
    what: 'Computable rules for the national schedule that work out which doses are due next.',
    soWhat: 'Once foreign doses are mapped, they automatically count toward the Lao schedule. No mental arithmetic for the nurse.',
  },
  {
    id: 'provenance',
    name: 'FHIR Provenance',
    short: 'Provenance',
    layer: 'data',
    owner: 'HL7 FHIR',
    what: 'Records where a piece of data came from, who verified it and how.',
    soWhat: 'Anyone can see later that a dose was issued by Thailand and verified in Lao PDR. Trust is visible, not assumed.',
  },

  // ── Trust & exchange ────────────────────────────────────────────
  {
    id: 'dvc',
    name: 'WHO Digital Vaccine Certificate (signed QR)',
    short: 'Digital Vaccine Certificate',
    layer: 'trust',
    owner: 'WHO SMART Trust',
    what: 'A compact vaccination record (CBOR) digitally signed by the issuing country (COSE) and encoded in a QR code. It can be printed on paper.',
    soWhat: 'Proof travels with the person and can be checked anywhere, even offline and even on paper.',
  },
  {
    id: 'gdhcn',
    name: 'WHO Global Digital Health Certification Network',
    short: 'WHO GDHCN',
    layer: 'trust',
    owner: 'WHO',
    what: 'A WHO-run network where countries publish the public keys used to sign their health documents, as a shared trust list.',
    soWhat: 'Lao PDR can verify a Thai signature without a bilateral agreement or a live call to Thailand. Trust is set up once and works between all members.',
  },
  {
    id: 'vhl',
    name: 'IHE ITI Verifiable Health Links (VHL)',
    short: 'Verifiable Health Link',
    layer: 'trust',
    owner: 'IHE',
    what: 'A signed QR that holds a link and decryption key, not the data itself. The record is fetched from its home only when the link is used.',
    soWhat: 'Data stays in the home country until someone the family chooses opens it. The QR alone reveals nothing.',
  },
  {
    id: 'pcf',
    name: 'IHE Privacy Consent on FHIR (PCF)',
    short: 'Consent (PCF)',
    layer: 'trust',
    owner: 'IHE',
    what: 'Records the family’s sharing decision (who, what, how long) as a FHIR Consent that the gateway enforces.',
    soWhat: 'Consent is machine-enforced: when the 14 days are up, the link stops working.',
  },
  {
    id: 'audit',
    name: 'FHIR AuditEvent (IHE BALP)',
    short: 'Audit log',
    layer: 'trust',
    owner: 'HL7 FHIR / IHE',
    what: 'A standard record of who accessed which data, when, and with what result.',
    soWhat: 'Every cross-border view is logged at home, which supports accountability and family notification.',
  },
];

export const BLOCK_BY_ID: Record<BuildingBlockId, BuildingBlock> = BUILDING_BLOCKS.reduce(
  (acc, b) => ({ ...acc, [b.id]: b }),
  {} as Record<BuildingBlockId, BuildingBlock>,
);


/** Light "read more" links for each building block: the standard first, then this journey's IG example. */
export const BLOCK_LINKS: Record<BuildingBlockId, { label: string; url: string }[]> = {
  'thai-his': [{ label: 'DVC issuing: WHO SMART Trust', url: SPEC.trust }],
  'ohs-fhir-sdk': [{ label: 'OHS Android FHIR SDK', url: SPEC.ohsSdk }],
  'ohs-sdc': [
    { label: 'HL7 FHIR SDC', url: SPEC.sdc },
    { label: 'FHIR Questionnaire', url: SPEC.questionnaire },
    { label: 'This journey’s form (IG)', url: IG.example('Questionnaire', 'TrustDemoHouseholdRegistration') },
  ],
  'ohs-info-gateway': [{ label: 'OHS FHIR Info Gateway', url: SPEC.ohsGateway }],
  'ohs-data-pipes': [{ label: 'OHS FHIR Data Pipes', url: SPEC.ohsPipes }],
  'national-fhir': [{ label: 'HL7 FHIR', url: SPEC.fhir }],
  'family-wallet': [{ label: 'IHE ITI VHL (Holder)', url: SPEC.vhl }],
  'vhl-viewer': [{ label: 'IHE ITI VHL (Receiver)', url: SPEC.vhl }],
  'fhir-r4': [
    { label: 'HL7 FHIR R4', url: SPEC.fhirR4 },
    { label: 'This journey as a FHIR IG', url: IG.site },
  ],
  'smart-imm': [{ label: 'WHO SMART Immunizations', url: SPEC.smartImm }],
  ips: [
    { label: 'HL7 IPS', url: SPEC.ips },
    { label: 'Somsack’s IPS (IG)', url: IG.example('Bundle', 'TrustDemoJ4Ips') },
  ],
  conceptmap: [
    { label: 'FHIR ConceptMap', url: SPEC.conceptMap },
    { label: 'The map in this journey (IG)', url: IG.example('ConceptMap', 'TrustDemoProductToLaoEpi') },
  ],
  plandefinition: [
    { label: 'FHIR PlanDefinition', url: SPEC.planDefinition },
    { label: 'CQL', url: SPEC.cql },
    { label: 'The schedule (IG)', url: IG.example('PlanDefinition', 'TrustDemoLaoInfantSchedule') },
  ],
  provenance: [
    { label: 'FHIR Provenance', url: SPEC.provenance },
    { label: 'Verification provenance (IG)', url: IG.example('Provenance', 'TrustDemoJ3Verification') },
  ],
  dvc: [
    { label: 'WHO SMART Trust (HCERT)', url: SPEC.trust },
    { label: 'HCERT QR code generation', url: SPEC.hcertQr },
  ],
  gdhcn: [
    { label: 'WHO GDHCN', url: SPEC.gdhcn },
    { label: 'WHO SMART Trust', url: SPEC.trust },
  ],
  vhl: [{ label: 'IHE ITI Verifiable Health Links', url: SPEC.vhl }],
  pcf: [
    { label: 'IHE Privacy Consent on FHIR', url: SPEC.pcf },
    { label: 'Bounmy’s consent (IG)', url: IG.example('Consent', 'TrustDemoJ4Consent') },
  ],
  audit: [
    { label: 'IHE BALP', url: SPEC.balp },
    { label: 'FHIR AuditEvent', url: SPEC.auditEvent },
    { label: 'The access log entry (IG)', url: IG.example('AuditEvent', 'TrustDemoJ41Access') },
  ],
};

/** Keys of the FHIR inspector drawer tabs, so chips can deep-link into it. */
export type FhirInspectorTab = 'patient' | 'immunization' | 'group' | 'serviceRequest' | 'provenance' | 'auditEvent' | 'cbor' | 'conceptMap';

export interface StepTech {
  /** One-sentence technical "so what" for a non-technical audience. */
  soWhat: string;
  /** Building blocks in play and what each one does at this moment. */
  blocks: { id: BuildingBlockId; role: string }[];
  /** The data hand-off at this moment. */
  exchange: {
    from: string;
    to: string;
    carrier: string;
    payload: string;
    online: boolean;
  };
  /** FHIR resources created or changed, optionally linked to the inspector. */
  fhir: {
    resource: string;
    change: string;
    inspect?: FhirInspectorTab;
    /** The base standard, linked lightly. */
    spec?: string;
    /** The IG profile this record conforms to, with the country that uses it. */
    profile?: { id: string; country: 'Thailand' | 'Lao PDR' };
    /** One line on why this record is there at this moment. */
    why?: string;
    /** IG example instances, Thai and Lao where both exist. */
    examples?: { label: string; url: string }[];
  }[];
}

export const STEP_TECH: Record<string, StepTech> = {
  J1: {
    soWhat: 'Thailand signs the record once. From then on, anyone on the WHO trust network can check it, with no database lookup and no national ID.',
    blocks: [
      { id: 'thai-his', role: 'Records Hep B + BCG and requests the certificates' },
      { id: 'smart-imm', role: 'Vaccines coded with WHO PreQual product codes' },
      { id: 'dvc', role: 'Dose data packed into CBOR, signed (COSE, ES256) and printed as a QR' },
      { id: 'gdhcn', role: 'Thailand’s signing key (kid 916ffa…) is published on the trust list' },
    ],
    exchange: {
      from: 'Thai hospital',
      to: 'Family (paper)',
      carrier: 'Printed QR code',
      payload: 'Signed DVC: HC1: prefix → CBOR + COSE_Sign1',
      online: false,
    },
    fhir: [
      { resource: 'Immunization ×2', change: 'Created in the Thai system (Hep B, BCG)', inspect: 'immunization', spec: SPEC.immunization, profile: { id: 'TrustDemoThImmunization', country: 'Thailand' }, why: 'The certificate can only carry what this record holds, so product, date, lot and dose number are required.', examples: [{ label: 'TH Hep B', url: IG.example('Immunization', 'TrustDemoJ1HepB') }, { label: 'TH BCG', url: IG.example('Immunization', 'TrustDemoJ1Bcg') }] },
      { resource: 'DVC payload', change: 'Signed CBOR/COSE certificate', inspect: 'cbor', spec: SPEC.hcertQr, why: 'Not FHIR: the HCERT certificate that travels on paper, verifiable offline with Thailand’s key from GDHCN.' },
    ],
  },
  'J2a': {
    soWhat: 'The phone can read the QR but deliberately doesn’t trust it: it decodes the card offline and checks no signature. Nothing is written yet.',
    blocks: [
      { id: 'ohs-fhir-sdk', role: 'Decodes the QR offline' },
      { id: 'dvc', role: 'QR decoded (CBOR) but signature not checked' },
      { id: 'smart-imm', role: 'PreQual codes read, but not yet mapped to the Lao schedule' },
    ],
    exchange: {
      from: 'Paper card',
      to: 'CHW phone',
      carrier: 'Camera scan',
      payload: 'Decoded dose data (not yet saved)',
      online: false,
    },
    fhir: [],
  },
  'J2b': {
    soWhat: 'The registration form is a FHIR Questionnaire. Its answers become standard FHIR resources on the phone; the doses read from the cards are saved with primarySource=false, apart from verified data, and everything syncs whenever there is signal.',
    blocks: [
      { id: 'ohs-fhir-sdk', role: 'Stores data on the phone; works 28+ days offline' },
      { id: 'ohs-sdc', role: 'Renders the household registration form and extracts FHIR from the answers' },
      { id: 'fhir-r4', role: 'Patient and Group (household); Immunization.primarySource = false; ServiceRequest for referral' },
      { id: 'ohs-info-gateway', role: 'On sync, checks the CHW’s token and only lets her write to households in her own catchment' },
    ],
    exchange: {
      from: 'Khamla (verbal) + the decoded cards',
      to: 'CHW phone → national server (on sync)',
      carrier: 'Offline form (FHIR Questionnaire), then sync via Info Gateway',
      payload: 'Patient + Group + unverified Immunization ×2 + referral',
      online: false,
    },
    fhir: [
      { resource: 'Patient', change: 'Created with a temporary Lao ID', inspect: 'patient', spec: SPEC.fhir + 'patient.html', profile: { id: 'TrustDemoLaoPatient', country: 'Lao PDR' }, why: 'He is not in the Lao civil registry yet; a temporary id lets the CHW, clinic and portal all mean the same child. Thailand only gave him a hospital number.', examples: [{ label: 'LA patient', url: IG.example('Patient', 'TrustDemoSomsack') }, { label: 'TH patient', url: IG.example('Patient', 'TrustDemoThSomsack') }] },
      { resource: 'Group (household)', change: 'Somsack added as member', inspect: 'group', spec: SPEC.group, profile: { id: 'TrustDemoLaoHousehold', country: 'Lao PDR' }, why: 'CHW work is organised by household: the roster is how a missing newborn is noticed.', examples: [{ label: 'LA household', url: IG.example('Group', 'TrustDemoHousehold') }] },
      { resource: 'QuestionnaireResponse', change: 'The registration form, answered offline (SDC)', spec: SPEC.sdc, profile: { id: 'TrustDemoLaoRegistration', country: 'Lao PDR' }, why: 'The form is configuration, not code; keeping the answers lets every extracted record trace back to what was asked.', examples: [{ label: 'LA answers', url: IG.example('QuestionnaireResponse', 'TrustDemoJ2Registration') }, { label: 'LA form', url: IG.example('Questionnaire', 'TrustDemoHouseholdRegistration') }] },
      { resource: 'Immunization ×2', change: 'Created as primarySource = false', inspect: 'immunization', spec: SPEC.immunization, profile: { id: 'TrustDemoLaoReportedImmunization', country: 'Lao PDR' }, why: 'Read without checking the signature, so kept as reported: not lost, but not counted by the schedule yet.', examples: [{ label: 'LA reported Hep B', url: IG.example('Immunization', 'TrustDemoJ2HepBReported') }, { label: 'TH original', url: IG.example('Immunization', 'TrustDemoJ1HepB') }] },
      { resource: 'ServiceRequest', change: 'Referral to District Health Center', inspect: 'serviceRequest', spec: SPEC.serviceRequest, profile: { id: 'TrustDemoLaoReferral', country: 'Lao PDR' }, why: 'The phone cannot verify a DVC but the clinic can; the referral points at exactly the doses to check.', examples: [{ label: 'LA referral', url: IG.example('ServiceRequest', 'TrustDemoJ2Referral') }] },
    ],
  },
  'J3a': {
    soWhat: 'The clinic checks Thailand’s signature against WHO’s trust list, stored locally. One check turns a foreign paper card into trusted clinical data, with no call to Thailand.',
    blocks: [
      { id: 'ohs-fhir-sdk', role: 'Clinic tablet app; caches the trust list' },
      { id: 'ohs-info-gateway', role: 'Delivers the CHW’s referral to this clinic; the nurse can only see patients referred to her facility' },
      { id: 'gdhcn', role: 'Supplies Thailand’s public key (downloaded in advance)' },
      { id: 'dvc', role: 'COSE_Sign1 signature verified (ES256)' },
      { id: 'provenance', role: 'Records that Thailand authored and Lao PDR verified the doses' },
    ],
    exchange: {
      from: 'Paper card',
      to: 'Clinic tablet',
      carrier: 'Camera scan + local trust-list check',
      payload: 'Verified DVC → Immunization updated',
      online: false,
    },
    fhir: [
      { resource: 'Immunization ×2', change: 'primarySource flipped to true', inspect: 'immunization', spec: SPEC.immunization, profile: { id: 'TrustDemoLaoImmunization', country: 'Lao PDR' }, why: 'A verified DVC is the signing hospital’s own record, so the dose now counts; the Thai record it came from is unchanged.', examples: [{ label: 'LA verified Hep B', url: IG.example('Immunization', 'TrustDemoJ3HepB') }, { label: 'TH original', url: IG.example('Immunization', 'TrustDemoJ1HepB') }] },
      { resource: 'Provenance', change: 'Created: author = Thailand MOPH, verifier = nurse', inspect: 'provenance', spec: SPEC.provenance, profile: { id: 'TrustDemoLaoDvcVerification', country: 'Lao PDR' }, why: 'Anyone who later doubts a dose can follow it back to the signed certificate and Thailand’s key.', examples: [{ label: 'LA verification', url: IG.example('Provenance', 'TrustDemoJ3Verification') }] },
    ],
  },
  'J3b': {
    soWhat: 'Shared WHO codes and a FHIR ConceptMap translate Thai vaccines into the Lao schedule. Computable schedule logic then works out what’s due next.',
    blocks: [
      { id: 'smart-imm', role: 'Common PreQual codes make the mapping possible' },
      { id: 'conceptmap', role: 'PreQual product → WHO vaccine type → Lao EPI code' },
      { id: 'plandefinition', role: 'Lao schedule logic calculates the 6-week doses' },
      { id: 'ohs-fhir-sdk', role: 'Saves dual-coded record and syncs it to the national server' },
      { id: 'ohs-info-gateway', role: 'Checks the nurse’s role and facility before accepting the update' },
      { id: 'ohs-data-pipes', role: 'Verified Thai doses, with their Provenance, count toward Lao coverage reports' },
      { id: 'national-fhir', role: 'Receives the verified, mapped record' },
    ],
    exchange: {
      from: 'Clinic tablet',
      to: 'Lao national FHIR server',
      carrier: 'FHIR API via Info Gateway',
      payload: 'Dual-coded Immunization + next-dose Task',
      online: true,
    },
    fhir: [
      { resource: 'Immunization.vaccineCode', change: 'Lao EPI code added; PreQual code kept', inspect: 'immunization', spec: SPEC.immunization, profile: { id: 'TrustDemoLaoImmunization', country: 'Lao PDR' }, why: 'The Lao schedule runs on Lao EPI codes, so one is required; the Thai product code stays beside it, never overwritten.', examples: [{ label: 'LA dual-coded', url: IG.example('Immunization', 'TrustDemoJ3HepB') }, { label: 'TH product only', url: IG.example('Immunization', 'TrustDemoJ1HepB') }] },
      { resource: 'ConceptMap', change: 'Nurse’s mapping decision recorded', inspect: 'conceptMap', spec: SPEC.conceptMap, why: 'Lao PDR’s own map from vaccine products to its schedule; a product with no mapping goes to the nurse.', examples: [{ label: 'LA map', url: IG.example('ConceptMap', 'TrustDemoProductToLaoEpi') }, { label: 'Nurse’s decision', url: IG.example('Provenance', 'TrustDemoJ3Adjudication') }] },
      { resource: 'Task / Appointment', change: '6-week pentavalent booked', spec: SPEC.planDefinition, why: 'The Lao schedule (PlanDefinition) finds the 6-week doses due; the reminder brings him back.', examples: [{ label: 'LA schedule', url: IG.example('PlanDefinition', 'TrustDemoLaoInfantSchedule') }, { label: 'LA reminder', url: IG.example('Task', 'TrustDemoJ3Reminder') }] },
    ],
  },
  'J4.0a': {
    soWhat: 'A year of records from two countries is assembled into one International Patient Summary, a format any clinician abroad knows how to read.',
    blocks: [
      { id: 'family-wallet', role: 'Holds 3 household profiles on one phone' },
      { id: 'national-fhir', role: 'Source of truth for all 6 doses' },
      { id: 'ohs-info-gateway', role: 'Lets Bounmy’s wallet read only his own household’s records' },
      { id: 'ips', role: 'Somsack’s summary packaged as an IPS Bundle' },
      { id: 'provenance', role: 'Thai origin of birth doses still visible' },
    ],
    exchange: {
      from: 'Lao national FHIR server',
      to: 'Family wallet',
      carrier: 'FHIR API (HTTPS) via Info Gateway',
      payload: 'IPS Bundle per family member',
      online: true,
    },
    fhir: [
      { resource: 'Bundle (IPS)', change: 'Generated: 2 Thai + 4 Lao doses', spec: SPEC.ips, why: 'An International Patient Summary is what any country’s clinic can read, whatever its own system.', examples: [{ label: 'LA summary', url: IG.example('Bundle', 'TrustDemoJ4Ips') }, { label: 'LA dose', url: IG.example('Immunization', 'TrustDemoLaoPenta1') }] },
      { resource: 'Group (household)', change: 'Drives the profile switcher', inspect: 'group', spec: SPEC.group, profile: { id: 'TrustDemoLaoHousehold', country: 'Lao PDR' }, why: 'One shared phone, three family members: the household decides whose records the wallet shows.', examples: [{ label: 'LA household', url: IG.example('Group', 'TrustDemoHousehold') }] },
    ],
  },
  'J4.0b': {
    soWhat: 'The QR is a key, not a copy. The record stays on the Lao server, and the family’s consent (who, how long) is recorded in a standard form and enforced.',
    blocks: [
      { id: 'family-wallet', role: 'Generates the link and passcode' },
      { id: 'vhl', role: 'Signed QR holding a manifest URL + decryption key' },
      { id: 'pcf', role: '14-day, passcode-protected sharing consent' },
      { id: 'ohs-info-gateway', role: 'Registers the consent it will enforce when the link is used' },
    ],
    exchange: {
      from: 'Family wallet',
      to: 'Lao national server',
      carrier: 'HTTPS',
      payload: 'VHL manifest + Consent registered',
      online: true,
    },
    fhir: [
      { resource: 'Consent (IHE PCF)', change: 'Created: scope = IPS, expires in 14 days', spec: SPEC.pcf, why: 'Bounmy decides what is shared and for how long; the gateway checks this before releasing anything.', examples: [{ label: 'LA consent', url: IG.example('Consent', 'TrustDemoJ4Consent') }] },
      { resource: 'VHL manifest', change: 'Signed pointer to encrypted IPS', spec: SPEC.vhl, why: 'Not a copy of the record: a signed, passcode-protected pointer back to Lao PDR.' },
    ],
  },
  'J4.1': {
    soWhat: 'A standard viewer fetches the record from Lao PDR, decrypts it in memory, and leaves an audit trail at home. Cross-border care with no shared database between the countries.',
    blocks: [
      { id: 'vhl-viewer', role: 'Scans QR, takes passcode, displays IPS' },
      { id: 'vhl', role: 'Manifest fetched; decryption key used' },
      { id: 'ohs-info-gateway', role: 'Authorizes the request against passcode and consent, releases data, writes the AuditEvent' },
      { id: 'ips', role: 'Rendered for the Thai clinician' },
      { id: 'audit', role: 'AuditEvent recorded in Lao PDR' },
      { id: 'ohs-data-pipes', role: 'Feeds AuditEvents into a Ministry dashboard of cross-border access, so unusual access stands out' },
    ],
    exchange: {
      from: 'Lao national server',
      to: 'Thai clinic viewer',
      carrier: 'HTTPS (VHL fetch) across the border',
      payload: 'Encrypted IPS Bundle → decrypted in memory',
      online: true,
    },
    fhir: [
      { resource: 'Provenance', change: 'Summary viewed, not stored in Thailand', spec: SPEC.provenance, profile: { id: 'TrustDemoThVhlReceipt', country: 'Thailand' }, why: 'The Thai clinic keeps a note of what it saw and how it was verified, without copying the Lao record.', examples: [{ label: 'TH receipt', url: IG.example('Provenance', 'TrustDemoJ41Received') }, { label: 'LA summary', url: IG.example('Bundle', 'TrustDemoJ4Ips') }] },
      { resource: 'AuditEvent', change: 'Created at Lao Info Gateway', inspect: 'auditEvent', spec: SPEC.balp, profile: { id: 'TrustDemoLaoVhlAccess', country: 'Lao PDR' }, why: 'The data stays home, so the access log does too: the family can see who looked, from where and when.', examples: [{ label: 'LA access', url: IG.example('AuditEvent', 'TrustDemoJ41Access') }, { label: 'LA refused', url: IG.example('AuditEvent', 'TrustDemoJ41WrongPasscode') }] },
    ],
  },
};
