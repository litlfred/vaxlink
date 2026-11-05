/**
 * The policy layer of the journey, woven to the policy-maker track of the
 * DPI-H workshop (seven modules, M1–M7, around this one use case: domestic and
 * cross-border verifiable immunization records as the entry point to a
 * personal health record).
 *
 * Each moment of the journey carries the questions a table asks of it, tagged
 * with the module and canvas sheet they belong to; the decision rights and the
 * legal basis it forces (M5); the cost driver that dominates it (M7); the
 * substitution pattern that gets a country moving if it lacks what the moment
 * needs (M1); and the capabilities it needs, which the gap strip asks about.
 *
 * Questions are questions: the module asks countries to name, not to decide.
 */

export type ModuleId = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7';

export interface WorkshopModule {
  id: ModuleId;
  day: 1 | 2;
  title: string;
  /** The canvas sheet the module fills in. */
  sheet: string;
  /** The question the module carries, in one line. */
  carries: string;
}

export const MODULES: WorkshopModule[] = [
  { id: 'M1', day: 1, title: 'From journey to capabilities', sheet: 'Sheet 1', carries: 'What had to exist for this moment to work — and where does our version of the journey break?' },
  { id: 'M2', day: 1, title: 'The reference architecture and where you stand', sheet: 'Sheet 2', carries: 'Which system do we use today for each block — and is it there, partly there, or absent?' },
  { id: 'M3', day: 1, title: 'Standards, specifications and the core data set', sheet: 'Sheet 3', carries: 'Which standards do we adopt rather than author — and who owns the national core data set?' },
  { id: 'M4', day: 2, title: 'Trust, credentials and wallets', sheet: 'Sheet 4 (upper)', carries: 'Who signs, who verifies, and who would hold the national trust anchor? Name it; do not decide it.' },
  { id: 'M5', day: 2, title: 'Governance, decision rights and the legal basis', sheet: 'Sheet 4 (lower)', carries: 'Who holds each decision — and what legal basis lets the record cross a border and be shared for a child?' },
  { id: 'M6', day: 2, title: 'Doing it once, together', sheet: 'Sheet 5', carries: 'Would your neighbour need this too? If yes, why would you each build it?' },
  { id: 'M7', day: 2, title: 'Our first move, what it costs, and what we ask for', sheet: 'Sheet 6', carries: 'What is realistic in twelve months with the people and money we have — and who owns it?' },
];
export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, WorkshopModule>;

/** The four decision rights the use case forces (M5). */
export type DecisionRightId = 'architecture' | 'standards' | 'core-data-set' | 'trust-anchor';
export const DECISION_RIGHTS: { id: DecisionRightId; label: string; question: string }[] = [
  { id: 'architecture', label: 'Architecture authority', question: 'Who decides which national systems play which part, and that they must connect?' },
  { id: 'standards', label: 'Standards mandate', question: 'Who can require suppliers to conform to the national implementation guide — in a tender, for example?' },
  { id: 'core-data-set', label: 'Core data set custodian', question: 'Who owns the national core data set, its codes and its mappings to other countries’ codes?' },
  { id: 'trust-anchor', label: 'Trust anchor', question: 'Which institution signs on behalf of the health sector, and who accepts a foreign signature?' },
];
export const DECISION_RIGHT_BY_ID = Object.fromEntries(DECISION_RIGHTS.map((d) => [d.id, d])) as Record<DecisionRightId, (typeof DECISION_RIGHTS)[number]>;

/** The legal basis the use case needs (M5). */
export type LegalBasisId = 'cross-border' | 'consent-dependants';
export const LEGAL_BASES: { id: LegalBasisId; label: string }[] = [
  { id: 'cross-border', label: 'Legal basis for cross-border sharing' },
  { id: 'consent-dependants', label: 'Consent, including for minors and dependants' },
];
export const LEGAL_BASIS_BY_ID = Object.fromEntries(LEGAL_BASES.map((l) => [l.id, l])) as Record<LegalBasisId, (typeof LEGAL_BASES)[number]>;

/** The three substitution patterns (taught at the end of M1, reused all workshop). */
export type PatternId = 'narrow' | 'shared' | 'borrowed';
export const PATTERNS: { id: PatternId; label: string; what: string; example: string }[] = [
  { id: 'narrow', label: 'Start narrow', what: 'One population, one credential, one facility type.', example: 'Malaysia’s Hajj Health Card' },
  { id: 'shared', label: 'Start shared', what: 'Build the foundation once for several programmes, not once for immunization.', example: 'Thailand’s registry shared across parts of government' },
  { id: 'borrowed', label: 'Start borrowed', what: 'Adopt a regional or international artefact rather than authoring your own.', example: 'The ICVP IG, the IPS, a SNOMED subset' },
];
export const PATTERN_BY_ID = Object.fromEntries(PATTERNS.map((p) => [p.id, p])) as Record<PatternId, (typeof PATTERNS)[number]>;

/** Cost drivers for this use case (M7) — drivers, not unit costs. */
export type CostDriverId = 'integration' | 'licensing' | 'devices' | 'recurrent' | 'not-once';
export const COST_DRIVERS: { id: CostDriverId; label: string }[] = [
  { id: 'integration', label: 'Integration effort' },
  { id: 'licensing', label: 'Terminology licensing' },
  { id: 'devices', label: 'Devices and connectivity at the point of care' },
  { id: 'recurrent', label: 'Recurrent cost of running shared infrastructure' },
  { id: 'not-once', label: 'The cost of not doing it once' },
];
export const COST_DRIVER_BY_ID = Object.fromEntries(COST_DRIVERS.map((c) => [c.id, c])) as Record<CostDriverId, (typeof COST_DRIVERS)[number]>;

/** The gap strip, asked at the foot of every module in the same form. */
export const GAP_STRIP = {
  standingLine: '“Absent” is a finding, not a failure — the question is only whether it blocks this use case.',
  status: [
    { id: 'exists', label: 'Exists' },
    { id: 'partial', label: 'Partial' },
    { id: 'absent', label: 'Absent' },
  ],
  urgency: [
    { id: 'now', label: 'Blocks us now' },
    { id: '12m', label: 'Needed within 12 months' },
    { id: 'wait', label: 'Can wait' },
  ],
} as const;
export type GapStatus = (typeof GAP_STRIP.status)[number]['id'];
export type GapUrgency = (typeof GAP_STRIP.urgency)[number]['id'];

export const SCOPE_PROMISE =
  'You will not leave with an assessment or a plan. You will leave knowing what each consists of, where your country stands on its first page, and who you would do the rest with.';

export const USE_CASE_STATEMENT = 'A child vaccinated in ___ should be able to ___ in ___.';

export interface PolicyQuestion {
  module: ModuleId;
  text: string;
}

export interface Capability {
  id: string;
  label: string;
}

export interface StepPolicy {
  /** M1: what had to exist for this moment to work. */
  capabilities: Capability[];
  questions: PolicyQuestion[];
  decisionRights: DecisionRightId[];
  legalBasis: LegalBasisId[];
  costDriver: CostDriverId;
  pattern: { id: PatternId; why: string };
}

export const STEP_POLICY: Record<string, StepPolicy> = {
  J1: {
    capabilities: [
      { id: 'issuer-signing', label: 'A national service that signs vaccination certificates' },
      { id: 'facility-immz-record', label: 'An immunization record at the birth facility' },
      { id: 'product-codes', label: 'Vaccine product codes' },
    ],
    questions: [
      { module: 'M1', text: `Write your country’s use-case statement: “${USE_CASE_STATEMENT}”` },
      { module: 'M4', text: 'Who in your government would sign this card on behalf of the health sector: the hospital, the ministry, or a national trust service?' },
      { module: 'M5', text: 'Does your law let a facility issue a health credential to a child who is not a citizen and has no national ID?' },
    ],
    decisionRights: ['trust-anchor'],
    legalBasis: ['consent-dependants'],
    costDriver: 'integration',
    pattern: { id: 'borrowed', why: 'Issue to the WHO digital certificate specification rather than design a national card.' },
  },
  J2a: {
    capabilities: [
      { id: 'reported-vs-verified', label: 'A core data set that marks a dose as reported or verified' },
    ],
    questions: [
      { module: 'M3', text: 'Does your national core data set tell a dose the family reported from one that was verified? Who defines that element?' },
      { module: 'M4', text: 'Who is allowed to verify a foreign credential: a health worker’s phone, a clinic, or only a national service?' },
    ],
    decisionRights: ['core-data-set'],
    legalBasis: [],
    costDriver: 'integration',
    pattern: { id: 'borrowed', why: 'Take the element from the WHO immunization core data dictionary rather than define it nationally.' },
  },
  J2b: {
    capabilities: [
      { id: 'client-registry', label: 'A client registry that can hold a child with no birth record' },
      { id: 'crvs-link', label: 'A link from birth registration (CRVS) to the health registries' },
      { id: 'chw-offline-app', label: 'An offline app for community health workers' },
      { id: 'referral', label: 'A referral from the community to a facility' },
    ],
    questions: [
      { module: 'M2', text: 'Which block gives this child his first identifier in your country: birth registration, the national ID, or the health client registry? Exists, partial or absent?' },
      { module: 'M2', text: 'When a birth happened abroad and is not registered at home, how does the child enter your registries — and your coverage denominator?' },
      { module: 'M5', text: 'Who may create a health identity for a newborn at a home visit, and on whose consent?' },
    ],
    decisionRights: ['architecture'],
    legalBasis: ['consent-dependants'],
    costDriver: 'devices',
    pattern: { id: 'narrow', why: 'One population first: newborns found in border districts.' },
  },
  J3a: {
    capabilities: [
      { id: 'trust-list', label: 'Membership of a trust network, its list cached for offline use' },
      { id: 'clinic-verification', label: 'Verification inside the clinic’s system' },
    ],
    questions: [
      { module: 'M1', text: 'What must be true for this nurse to trust a record she did not create?' },
      { module: 'M4', text: 'Who would hold your national trust anchor, and who accepts a foreign signature on behalf of your health sector?' },
      { module: 'M4', text: 'What must your country have, and what must it decide, before it can verify a neighbour’s card offline? Name it; do not decide it here.' },
    ],
    decisionRights: ['trust-anchor'],
    legalBasis: [],
    costDriver: 'recurrent',
    pattern: { id: 'shared', why: 'The trust network is built once, for every programme that signs credentials, not for immunization alone.' },
  },
  J3b: {
    capabilities: [
      { id: 'terminology-service', label: 'A terminology service holding vaccine codes and mappings' },
      { id: 'schedule-logic', label: 'The national schedule as computable decision logic' },
    ],
    questions: [
      { module: 'M3', text: 'Who owns the national core data set and the mapping between other countries’ vaccine codes and yours?' },
      { module: 'M3', text: 'Which code systems do you use for vaccine products, and is the licence question settled?' },
      { module: 'M6', text: 'Would your neighbour need this mapping too? If yes, why would you each build it?' },
    ],
    decisionRights: ['core-data-set', 'standards'],
    legalBasis: [],
    costDriver: 'licensing',
    pattern: { id: 'borrowed', why: 'Map to a shared regional or international code set rather than one country at a time.' },
  },
  'J4.0a': {
    capabilities: [
      { id: 'family-wallet', label: 'A wallet or citizen app that holds a family’s records' },
      { id: 'dependant-consent', label: 'Rules for a parent holding a child’s record' },
    ],
    questions: [
      { module: 'M4', text: 'Is a family wallet a national service, a private app, or both — and who decides which apps may hold a record?' },
      { module: 'M5', text: 'Who may hold and share a child’s record: either parent, a guardian, the child from what age? What does your law say about dependants?' },
    ],
    decisionRights: ['standards'],
    legalBasis: ['consent-dependants'],
    costDriver: 'devices',
    pattern: { id: 'narrow', why: 'One credential first: the child’s vaccination record, on the phone the family already has.' },
  },
  'J4.0b': {
    capabilities: [
      { id: 'national-record', label: 'A national health record the family’s link points to' },
      { id: 'share-link', label: 'A service that issues time-limited links on the family’s consent' },
    ],
    questions: [
      { module: 'M5', text: 'What legal basis lets a record held at home be opened by a clinician abroad, on the family’s consent?' },
      { module: 'M5', text: 'Would one clause in your procurement — conformance to the national IG — be enough for your portal to issue this link?' },
      { module: 'M5', text: 'Who sets how a shared link is protected — the passcode, how long it lasts, who may open it: a national rule, or the family’s choice?' },
      { module: 'M6', text: 'Should the part of the record that crosses borders (IPS plus an immunization core) be profiled once for the region, with national extensions left sovereign?' },
    ],
    decisionRights: ['architecture', 'standards'],
    legalBasis: ['cross-border', 'consent-dependants'],
    costDriver: 'recurrent',
    pattern: { id: 'borrowed', why: 'Adopt the IPS and an existing link specification rather than author a national format.' },
  },
  'J4.1': {
    capabilities: [
      { id: 'poc-viewer', label: 'A point-of-care viewer that accepts a foreign link' },
      { id: 'access-log', label: 'An access log kept in the home country' },
    ],
    questions: [
      { module: 'M5', text: 'What agreement makes every view abroad leave an entry in the home country’s log — and who reads it?' },
      { module: 'M6', text: 'What would your country send to a regional connectathon within twelve months to prove this moment works?' },
      { module: 'M7', text: 'What is a realistic twelve-month first move toward this moment, with a named owner — and which cost driver dominates it?' },
    ],
    decisionRights: ['trust-anchor', 'architecture'],
    legalBasis: ['cross-border'],
    costDriver: 'not-once',
    pattern: { id: 'shared', why: 'Shared testing and one regional data model, rather than each pair of countries agreeing its own.' },
  },
};

/** Every question of the journey, by module, with the moment it belongs to. */
export const QUESTIONS_BY_MODULE: Record<ModuleId, { stage: string; text: string }[]> = MODULES.reduce(
  (acc, m) => ({
    ...acc,
    [m.id]: Object.entries(STEP_POLICY).flatMap(([stage, p]) => p.questions.filter((q) => q.module === m.id).map((q) => ({ stage, text: q.text }))),
  }),
  {} as Record<ModuleId, { stage: string; text: string }[]>,
);
