/**
 * Where to read more. The journey is documented as a WHO SMART Guidelines L2
 * DAK and L3 FHIR implementation guide in litlfred/smart-trust-demo; the
 * standards are linked lightly, one click from the moment that uses them.
 */

export const IG = {
  site: 'https://litlfred.github.io/smart-trust-demo/',
  repo: 'https://github.com/litlfred/smart-trust-demo',
  journeys: 'https://litlfred.github.io/smart-trust-demo/journeys.html',
  personas: 'https://litlfred.github.io/smart-trust-demo/personas.html',
  processes: 'https://litlfred.github.io/smart-trust-demo/business-processes.html',
  examples: 'https://litlfred.github.io/smart-trust-demo/vaxlink-examples.html',
  /** The page of one IG example, e.g. igExample('ConceptMap', 'TrustDemoProductToLaoEpi'). */
  profile: (id: string) => `https://litlfred.github.io/smart-trust-demo/artifact/StructureDefinition-${id}.html`,
  profiles: 'https://litlfred.github.io/smart-trust-demo/vaxlink-examples.html#country-profiles',
  example: (type: string, id: string) => `https://litlfred.github.io/smart-trust-demo/artifact/${type}-${id}.html`,
};

/** The WHO draft architecture whose DPI-H building blocks the architecture view uses. */
export const DPI_H_RA = 'https://litlfred.github.io/smart-ra/en/dpi-h-ra/index.html';

export const SPEC = {
  fhir: 'https://hl7.org/fhir/',
  fhirR4: 'https://hl7.org/fhir/R4/',
  conceptMap: 'https://hl7.org/fhir/conceptmap.html',
  valueSet: 'https://hl7.org/fhir/valueset.html',
  planDefinition: 'https://hl7.org/fhir/plandefinition.html',
  cql: 'https://cql.hl7.org/',
  provenance: 'https://hl7.org/fhir/provenance.html',
  questionnaire: 'https://hl7.org/fhir/questionnaire.html',
  group: 'https://hl7.org/fhir/group.html',
  immunization: 'https://hl7.org/fhir/immunization.html',
  serviceRequest: 'https://hl7.org/fhir/servicerequest.html',
  consent: 'https://hl7.org/fhir/consent.html',
  auditEvent: 'https://hl7.org/fhir/auditevent.html',
  sdc: 'https://hl7.org/fhir/uv/sdc/',
  ips: 'https://hl7.org/fhir/uv/ips/',
  smartImm: 'https://smart.who.int/immunizations/',
  trust: 'https://smart.who.int/trust/',
  hcertQr: 'https://smart.who.int/trust/hcert_spec.html#422-qr-2d-barcode',
  gdhcn: 'https://www.who.int/initiatives/global-digital-health-certification-network',
  vhl: 'https://profiles.ihe.net/ITI/VHL/',
  pcf: 'https://profiles.ihe.net/ITI/PCF/',
  balp: 'https://profiles.ihe.net/ITI/BALP/',
  ohsSdk: 'https://github.com/google/android-fhir',
  ohsGateway: 'https://github.com/google/fhir-gateway',
  ohsPipes: 'https://github.com/google/fhir-data-pipes',
};

type Bpmn = { file: string; title: string; igAnchor: string; scenarioAnchor: string };

/** The IG's business process (BPMN) for each moment, drawn as SVG in public/bpmn/. */
export const BPMN_FOR_STAGE: Record<string, Bpmn> = {
  J1: { file: 'j1-birth-dose-dvc', title: 'J1 Issue the newborn’s birth-dose DVCs', igAnchor: 'j1-issue-the-newborns-birth-dose-dvcs-in-country-a', scenarioAnchor: 'j1--born-abroad-thailand-birth-day' },
  J2a: { file: 'j2-chw-discovery-referral', title: 'J2 Discover and refer an unregistered infant', igAnchor: 'j2-discover-and-refer-an-unregistered-infant-in-country-b', scenarioAnchor: 'j2--found-at-home-lao-pdr-3-weeks-later' },
  J2b: { file: 'j2-chw-discovery-referral', title: 'J2 Discover and refer an unregistered infant', igAnchor: 'j2-discover-and-refer-an-unregistered-infant-in-country-b', scenarioAnchor: 'j2--found-at-home-lao-pdr-3-weeks-later' },
  J3a: { file: 'j3-clinic-verification-schedule', title: 'J3 Verify, import and schedule at the home clinic', igAnchor: 'j3-verify-import-and-schedule-at-the-home-clinic', scenarioAnchor: 'j3--made-official-vientiane-district-health-center-4-weeks-later' },
  J3b: { file: 'j3-clinic-verification-schedule', title: 'J3 Verify, import and schedule at the home clinic', igAnchor: 'j3-verify-import-and-schedule-at-the-home-clinic', scenarioAnchor: 'j3--made-official-vientiane-district-health-center-4-weeks-later' },
  'J4.0a': { file: 'j4-0-family-vhl-issuance', title: 'J4.0 Issue the family’s records to one phone as VHLs', igAnchor: 'j40-issue-the-familys-records-to-one-phone-as-vhls', scenarioAnchor: 'j40--crossing-back-one-family-one-phone-lao-pdr-12-months-later' },
  'J4.0b': { file: 'j4-0-family-vhl-issuance', title: 'J4.0 Issue the family’s records to one phone as VHLs', igAnchor: 'j40-issue-the-familys-records-to-one-phone-as-vhls', scenarioAnchor: 'j40--crossing-back-one-family-one-phone-lao-pdr-12-months-later' },
  'J4.1': { file: 'j4-1-vhl-point-of-care', title: 'J4.1 Read a family member’s records at the point of care', igAnchor: 'j41-read-a-family-members-records-at-the-point-of-care-abroad', scenarioAnchor: 'j41--crossing-back-a-thai-doctor-sees-the-full-history-chiang-rai-12-months-later' },
};

export const BPMN_PROCESSES = Array.from(
  new Map(Object.entries(BPMN_FOR_STAGE).map(([stage, p]) => [p.file, { ...p, stages: [] as string[] }])).values(),
).map((p) => ({ ...p, stages: Object.entries(BPMN_FOR_STAGE).filter(([, q]) => q.file === p.file).map(([s]) => s) }));

/** Where each process lives in the IG: its section, the process viewer, the scenario and the BPMN source. */
export const bpmnLinks = (p: Bpmn) => ({
  ig: `${IG.processes}#${p.igAnchor}`,
  viewer: `${IG.site}cat-harness/processes/${p.file}.html`,
  scenario: `${IG.journeys}#${p.scenarioAnchor}`,
  source: `${IG.repo}/blob/main/processes/content/${p.file}.bpmn`,
});

/** BPMN SVG served with the site (base-relative, so it works under any Pages path). */
export const bpmnSvg = (file: string) => `${import.meta.env.BASE_URL}bpmn/${file}.svg`;

/**
 * The demonstrator's ArchiMate views: its journeys and systems as an overlay on
 * the DPI-H RA's own ArchiMate model (smart-trust-demo `archimate/`), drawn as
 * SVG in public/archimate/ by scripts/sync-archimate.mjs. Every box links to
 * its element page on the demonstrator's site.
 */
const ARCHIMATE_MODEL = `${IG.site}en/smart-trust-demo/archimate/0.1.0/`;
export type ArchimateView = { file: string; slug: string; id: string; label: string; title: string; bpmn?: string };
export const ARCHIMATE = {
  page: `${IG.site}architecture.html`,
  model: ARCHIMATE_MODEL,
  views: [
    { file: 'systems', slug: 'smart-trust-demo-on-the-dpi-h-integrated-view', id: 'id-249a1002c32e50199e27a502ef0ec3d8', label: 'Systems', title: 'Thai and Lao systems on the DPI-H Integrated View' },
    { file: 'journeys', slug: 'smart-trust-demo-journeys-use-cases', id: 'id-c6cae81c85da5fc197ab58547274a481', label: 'Journeys', title: 'Journeys (use cases), people and RA capabilities' },
    { file: 'j1', slug: 'j1-on-the-dpi-h-ra', id: 'id-18d2033f445f5b8895f20719cb97bd91', label: 'J1', title: 'J1 on the DPI-H RA', bpmn: 'j1-birth-dose-dvc' },
    { file: 'j2', slug: 'j2-on-the-dpi-h-ra', id: 'id-099b088dc52f57289c647bfb64e8c4d6', label: 'J2', title: 'J2 on the DPI-H RA', bpmn: 'j2-chw-discovery-referral' },
    { file: 'j3', slug: 'j3-on-the-dpi-h-ra', id: 'id-c1154579a67d5815921b72f71587df50', label: 'J3', title: 'J3 on the DPI-H RA', bpmn: 'j3-clinic-verification-schedule' },
    { file: 'j4-0', slug: 'j4-0-on-the-dpi-h-ra', id: 'id-ae1502fd9fb158c3bcb643bf39006d41', label: 'J4.0', title: 'J4.0 on the DPI-H RA', bpmn: 'j4-0-family-vhl-issuance' },
    { file: 'j4-1', slug: 'j4-1-on-the-dpi-h-ra', id: 'id-42b408eba96159c187c0612ce7c2c6cf', label: 'J4.1', title: 'J4.1 on the DPI-H RA', bpmn: 'j4-1-vhl-point-of-care' },
  ] as ArchimateView[],
  /** The view's page on the demonstrator's site, addressed by name. */
  viewPage: (v: ArchimateView) => `${ARCHIMATE_MODEL}views/${v.slug}/`,
  /** The view's drawing, as served by this site. */
  svg: (v: ArchimateView) => `${import.meta.env.BASE_URL}archimate/${v.file}.svg`,
  /** The journey view for a BPMN process, if there is one. */
  forBpmn: (file: string) => ARCHIMATE.views.find((v) => v.bpmn === file),
};
