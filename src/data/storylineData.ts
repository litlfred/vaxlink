import { JourneyStage, PatientDemographics, ImmunizationRecord } from '../types';
// FHIR examples from the SMART Trust demonstrator IG (litlfred/smart-trust-demo),
// where this journey is documented as a DAK and IG. Refresh with
// `node scripts/sync-ig-examples.mjs`.
import igPatient from './ig/Patient-TrustDemoSomsack.json';
import igGroup from './ig/Group-TrustDemoHousehold.json';
import igImmunizationHepB from './ig/Immunization-TrustDemoJ3HepB.json';
import igServiceRequest from './ig/ServiceRequest-TrustDemoJ2Referral.json';
import igProvenance from './ig/Provenance-TrustDemoJ3Verification.json';
import igAuditEvent from './ig/AuditEvent-TrustDemoJ41Access.json';
import igConceptMap from './ig/ConceptMap-TrustDemoProductToLaoEpi.json';

export const PATIENT_DATA: PatientDemographics = {
  infantName: "Somsack Sengmany",
  motherName: "Khamla Sengmany",
  fatherName: "Bounmy Sengmany",
  householdId: "HH-LAO-204",
  infantDob: "2025-10-28", // T0
  birthHospital: "Chiang Rai Provincial Hospital, Thailand",
  nationality: "Lao PDR",
  motherAge: 26,
  fatherAge: 29,
};

export const GDHCN_DEV_KEY = {
  kid: "916ffa567c0f44a2",
  iss: "XXR", // Thailand MOPH DEV Participant
  country: "Thailand",
  alg: "ES256",
  trustStatus: "ACTIVE_IN_DEV_TRUST_LIST",
  certificateThumbprint: "SHA256:d8a9e7f4...62b1",
  validityWindow: "2025-01-01T00:00:00Z to 2027-12-31T23:59:59Z",
};

export const INITIAL_IMMUNIZATIONS: ImmunizationRecord[] = [
  {
    id: "imm-th-hepb-001",
    vaccineName: "Hepatitis B Pediatric Birth Dose",
    targetDisease: "Hepatitis B",
    dateAdministered: "2025-10-28",
    countryAdministered: "Thailand",
    facility: "Chiang Rai Provincial Hospital",
    lotNumber: "TH-4821",
    preQualCode: "vp-hepb-peds-monovalent",
    laoEpiCode: undefined,
    primarySource: false, // Initially unverified when scanned offline
    status: "completed",
    doseNumber: 1,
    signedBy: "XXR (Thailand MOPH)",
    keyId: "916ffa567c0f44a2",
    provenanceAttached: false,
  },
  {
    id: "imm-th-bcg-002",
    vaccineName: "BCG Vaccine Freeze-Dried",
    targetDisease: "Tuberculosis",
    dateAdministered: "2025-10-28",
    countryAdministered: "Thailand",
    facility: "Chiang Rai Provincial Hospital",
    lotNumber: "TH-9012",
    preQualCode: "vp-bcg-freeze-dried",
    laoEpiCode: undefined,
    primarySource: false,
    status: "completed",
    doseNumber: 1,
    signedBy: "XXR (Thailand MOPH)",
    keyId: "916ffa567c0f44a2",
    provenanceAttached: false,
  },
];

export const SUBSEQUENT_LAO_IMMUNIZATIONS: ImmunizationRecord[] = [
  {
    id: "imm-lao-penta1-003",
    vaccineName: "Pentavalent (DTP-HepB-Hib-1)",
    targetDisease: "Diphtheria, Tetanus, Pertussis, Hep B, Hib",
    dateAdministered: "2025-12-10",
    countryAdministered: "Lao PDR",
    facility: "Vientiane District Health Center",
    lotNumber: "LA-2201",
    preQualCode: "vp-pentavalent-liquid",
    laoEpiCode: "LAO-EPI-PENTA-1",
    primarySource: true,
    status: "verified",
    doseNumber: 1,
    provenanceAttached: true,
  },
  {
    id: "imm-lao-opv1-004",
    vaccineName: "Bivalent Oral Polio (bOPV-1)",
    targetDisease: "Poliomyelitis",
    dateAdministered: "2025-12-10",
    countryAdministered: "Lao PDR",
    facility: "Vientiane District Health Center",
    lotNumber: "LA-5531",
    preQualCode: "vp-bopv-drops",
    laoEpiCode: "LAO-EPI-OPV-1",
    primarySource: true,
    status: "verified",
    doseNumber: 1,
    provenanceAttached: true,
  },
  {
    id: "imm-lao-pcv1-005",
    vaccineName: "Pneumococcal Conjugate (PCV-1)",
    targetDisease: "Streptococcus pneumoniae",
    dateAdministered: "2025-12-10",
    countryAdministered: "Lao PDR",
    facility: "Vientiane District Health Center",
    lotNumber: "LA-8819",
    preQualCode: "vp-pcv-13-dose",
    laoEpiCode: "LAO-EPI-PCV-1",
    primarySource: true,
    status: "verified",
    doseNumber: 1,
    provenanceAttached: true,
  },
  {
    id: "imm-lao-mr1-006",
    vaccineName: "Measles-Rubella Vaccine (MR-1)",
    targetDisease: "Measles, Rubella",
    dateAdministered: "2026-07-28",
    countryAdministered: "Lao PDR",
    facility: "Vientiane District Health Center",
    lotNumber: "LA-9923",
    preQualCode: "vp-mr-freeze-dried",
    laoEpiCode: "LAO-EPI-MR-1",
    primarySource: true,
    status: "verified",
    doseNumber: 1,
    provenanceAttached: true,
  },
];

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "stage-1",
    screenId: "S1",
    stageCode: "J1",
    title: "Birth Abroad & Printed DVC QR Cards",
    subtitle: "Maternity Discharge in Thailand",
    country: "Thailand",
    countryCode: "THA",
    location: "Chiang Rai Provincial Hospital",
    actor: "Maternity Nurse / Dr. Anan",
    actorRole: "Country A Birth Clinic",
    appConfig: "Hospital EMR & Print Station",
    deviceType: "TABLET",
    timeline: "T0 (Birth Day)",
    statusBadge: {
      label: "Issued (XXR DEV Key)",
      variant: "info",
    },
    summary: "Newborn Somsack is delivered in Thailand. Hep B and BCG birth doses are recorded using WHO PreQual product codes and issued as two paper DVC cards with high-density QR Version 16 signed by XXR.",
    learningObjective: "How non-national newborns receive verifiable digital vaccine certificates without requiring host-country civil registration or national identity numbers.",
  },
  {
    id: "stage-2",
    screenId: "S2",
    stageCode: "J2a",
    title: "Offline QR Scan of the Foreign Cards",
    subtitle: "Read, Not Verified",
    country: "Lao PDR",
    countryCode: "LAO",
    location: "Catchment Village 04, Lao PDR",
    actor: "Vilay (CHW)",
    actorRole: "Community Health Worker",
    appConfig: "OHS Player Community Config (Offline Android)",
    deviceType: "MOBILE",
    timeline: "T0 + 3 Weeks",
    statusBadge: {
      label: "Decode only",
      variant: "unverified",
    },
    summary: "On a home visit, the CHW finds Somsack in the Sengmany household and scans his two paper cards offline. The phone decodes the doses and their unmapped PreQual codes, but checks no signature and saves nothing yet.",
    learningObjective: "Why frontline offline devices decode rather than verify cryptographic signatures, safely capturing caregiver assertions without granting authoritative trust prematurely.",
  },
  {
    id: "stage-3",
    screenId: "S3",
    stageCode: "J2b",
    title: "Newborn Registration & Clinic Referral",
    subtitle: "Rural Community Visit in Lao PDR",
    country: "Lao PDR",
    countryCode: "LAO",
    location: "Catchment Village 04, Lao PDR",
    actor: "Vilay (CHW)",
    actorRole: "Community Health Worker",
    appConfig: "OHS Player Community Config (Offline Android)",
    deviceType: "MOBILE",
    timeline: "T0 + 3 Weeks",
    statusBadge: {
      label: "Offline Mode (28d)",
      variant: "warning",
    },
    summary: "CHW uses the SDC form to register Somsack under the household Group, saves the two doses read from the cards as Immunization records marked primarySource=false, and queues a ServiceRequest referral to the clinic.",
    learningObjective: "Offline Structured Data Capture (SDC) in rural low-connectivity areas, linking newborns into household rosters before civil registration is complete, and keeping reported doses apart from verified ones.",
  },
  {
    id: "stage-4",
    screenId: "S4",
    stageCode: "J3a",
    title: "Clinic Referral & GDHCN Verification",
    subtitle: "Cryptographic Trust Resolution at Health Center",
    country: "Lao PDR",
    countryCode: "LAO",
    location: "Vientiane District Health Center",
    actor: "Nurse Chanthasone",
    actorRole: "Facility Clinic Nurse",
    appConfig: "OHS Player Facility Config (Tablet EMR)",
    deviceType: "TABLET",
    timeline: "T0 + 4 Weeks",
    statusBadge: {
      label: "GDHCN Valid (ES256)",
      variant: "verified",
    },
    summary: "Nurse scans Somsack's paper DVC QR. Facility app verifies COSE_Sign1 signature against cached GDHCN DEV trust list (XXR key 916ffa567c0f44a2), flips primarySource to true, and binds FHIR Provenance.",
    learningObjective: "Cryptographic validation against decentralized WHO GDHCN trust lists, transforming unverified foreign assertions into high-trust clinical data.",
  },
  {
    id: "stage-5",
    screenId: "S5",
    stageCode: "J3b",
    title: "Terminology Adjudication & National Schedule",
    subtitle: "3-Layer ConceptMap & PlanDefinition",
    country: "Lao PDR",
    countryCode: "LAO",
    location: "Vientiane District Health Center",
    actor: "Nurse Chanthasone",
    actorRole: "Facility Clinic Nurse",
    appConfig: "OHS Player Facility Config (Tablet EMR)",
    deviceType: "TABLET",
    timeline: "T0 + 4 Weeks",
    statusBadge: {
      label: "ConceptMap Resolved",
      variant: "verified",
    },
    summary: "Nurse resolves missing ConceptMap translation: maps WHO PreQual code to Lao EPI schedule (HepB-BD). Schedule engine (PlanDefinition) calculates upcoming 6-week infant doses and generates reminder Task.",
    learningObjective: "3-layer terminology adjudication preserving source PreQual code while appending national schedule coding, enabling clinical decision support across borders.",
  },
  {
    id: "stage-6",
    screenId: "S6",
    stageCode: "J4.0a",
    title: "One Family, One Phone Household Wallet",
    subtitle: "Multi-Member Longitudinal IPS Record",
    country: "Lao PDR",
    countryCode: "LAO",
    location: "Vientiane Capital, Lao PDR",
    actor: "Bounmy Sengmany (Father)",
    actorRole: "Household Head & Phone Holder",
    appConfig: "OHS Player Family Config (Mobile Wallet)",
    deviceType: "MOBILE",
    timeline: "T0 + 12 Months",
    statusBadge: {
      label: "6 Doses Verified (IPS)",
      variant: "verified",
    },
    summary: "Family prepares for travel to Thailand. Father's smartphone manages 3 family profiles (Father, Mother, 1-year-old Somsack). Somsack's IPS bundle highlights full cross-border immunization provenance.",
    learningObjective: "Managing low-resource digital equity via shared household smartphones ('One Family, One Phone') while preserving individual patient summaries (FHIR IPS).",
  },
  {
    id: "stage-7",
    screenId: "S7",
    stageCode: "J4.0b",
    title: "VHL QR Display & Passcode Protection",
    subtitle: "IHE ITI VHL & IHE PCF Consent",
    country: "Lao PDR",
    countryCode: "LAO",
    location: "Lao-Thai Friendship Bridge / Mobile",
    actor: "Bounmy Sengmany (Father)",
    actorRole: "Household Head & Traveler",
    appConfig: "OHS Player Family Config (Mobile Wallet)",
    deviceType: "MOBILE",
    timeline: "T0 + 12 Months",
    statusBadge: {
      label: "VHL Active (14 Days)",
      variant: "info",
    },
    summary: "Father generates a Verifiable Health Link (VHL) QR code for Somsack. QR carries a secure pointer and decryption key, protected by a 4-digit verbal passcode (4829) with 14-day validity.",
    learningObjective: "How Verifiable Health Links provide lightweight, privacy-preserving cross-border sharing where health records remain hosted in the sovereign home country.",
  },
  {
    id: "stage-8",
    screenId: "S8",
    stageCode: "J4.1",
    title: "Foreign Clinic VHL Viewer & Audit Trace",
    subtitle: "Point-of-Care Access & Lao Info Gateway Callback",
    country: "Thailand",
    countryCode: "THA",
    location: "Bangkok / Chiang Rai Primary Care Clinic",
    actor: "Dr. Anan (Clinician)",
    actorRole: "Country A Clinician",
    appConfig: "OHS Player Viewer Config (Web/Tablet)",
    deviceType: "TABLET",
    timeline: "T0 + 12 Months",
    statusBadge: {
      label: "Live Audit Callback",
      variant: "verified",
    },
    summary: "Thai doctor scans VHL QR, enters father's verbal passcode 4829, and fetches Somsack's signed IPS bundle over HTTPS. A real-time AuditEvent logs at the Lao PDR OHS Info Gateway completing the loop.",
    learningObjective: "Full-circle cross-border continuity of care: from birth in Thailand, to verification in Lao PDR, to auditable retrieval back in Thailand without duplicate records.",
  },
];

// Sample raw payloads for FHIR and cryptographic inspection
export const MOCK_FHIR_RESOURCES = {
  patient: igPatient,
  group: igGroup,
  immunizationHepB: igImmunizationHepB,
  serviceRequest: igServiceRequest,
  provenance: igProvenance,
  auditEvent: igAuditEvent,
  conceptMap: igConceptMap,
  cborPayload: {
    header: {
      "1": -7, // ES256
      "4": "916ffa567c0f44a2", // kid
      "iss": "XXR", // Issuer
    },
    hcert: {
      v: [
        {
          tg: "840534001", // Target Hepatitis B
          vp: "vp-hepb-peds-monovalent",
          mp: "WHO-PQ-HEP-091",
          ma: "TH-GPO-MANUF",
          dn: 1,
          sd: 1,
          dt: "2025-10-28",
          co: "THA",
          is: "XXR",
          ci: "URN:UVCI:01:THA:916FFA567C0F:001"
        }
      ],
      dob: "2025-10-28",
      nam: {
        fn: "Sengmany",
        gn: "Somsack"
      },
      ver: "1.3.0"
    }
  }
};
