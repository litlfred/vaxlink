import { ScreenId } from '../types';
import type { ModuleId } from './policyData';
import somsack_sengmany from './upstream/actors/somsack-sengmany.json';
import khamla_sengmany from './upstream/actors/khamla-sengmany.json';
import bounmy_sengmany from './upstream/actors/bounmy-sengmany.json';
import vilay from './upstream/actors/vilay.json';
import chanthasone from './upstream/actors/chanthasone.json';
import anan from './upstream/actors/anan.json';

/**
 * User-journey model for workshop facilitation.
 *
 * Where storylineData.ts describes *screens and systems*, this file describes
 * *people and moments*: who is involved at each step, what they do, how they
 * feel, what could go wrong, and how Somsack's record changes along the way.
 */

export type PersonaId = 'somsack' | 'khamla' | 'bounmy' | 'vilay' | 'chanthasone' | 'anan';

/** -2 = distressed, -1 = worried, 0 = neutral, 1 = reassured, 2 = delighted */
export type Emotion = -2 | -1 | 0 | 1 | 2;

export interface Persona {
  id: PersonaId;
  name: string;
  role: string;
  country: 'Lao PDR' | 'Thailand';
  initials: string;
  goal: string;
  needs: string[];
  frustrations: string[];
  /** Literal Tailwind classes so they survive purging */
  color: {
    dot: string;
    soft: string;
    border: string;
    text: string;
    hex: string;
  };
}

export interface PersonaMoment {
  doing: string;
  feeling: string;
  emotion: Emotion;
}

export interface JourneyChapter {
  id: string;
  number: number;
  title: string;
  when: string;
  where: string;
  country: 'Thailand' | 'Lao PDR' | 'Cross-Border';
  summary: string;
}

export interface RecordState {
  /** Index into RECORD_TRUST_LADDER */
  level: number;
  description: string;
  heldWhere: string;
}

export interface JourneyStep {
  stageCode: string;
  screenId: ScreenId;
  chapterId: string;
  title: string;
  headline: string;
  when: string;
  where: string;
  touchpoint: string;
  lead: PersonaId;
  moments: Partial<Record<PersonaId, PersonaMoment>>;
  painPoint: string;
  enabler: string;
  record: RecordState;
  handoff: string;
  whatIf: {
    scenario: string;
    outcome: string;
    tryOnScreen?: string;
  };
  askTheRoom: string;
  /** The policy point this moment makes, for delegates. */
  policyTakeaway: string;
  facilitatorCue: string;
}

/**
 * Who each persona is — name, role, country, goal, needs, frustrations — is
 * kept once, in the smart-trust-demo actor it is (`meta.persona`), copied at
 * a pinned commit by scripts/sync-upstream.mjs. Only how the walkthrough
 * draws them (initials, colours) is kept here.
 */
type ActorPersona = { name: string; role: string; country: string; goal: string; needs: string[]; frustrations: string[] };
type Actor = { id: string; meta?: { persona?: ActorPersona } };

const fromActor = (id: PersonaId, actor: Actor, initials: string, color: Persona['color']): Persona => {
  const p = actor.meta?.persona;
  if (!p) throw new Error(`actor ${actor.id} has no meta.persona`);
  if (p.country !== 'Lao PDR' && p.country !== 'Thailand') throw new Error(`actor ${actor.id}: unknown country ${p.country}`);
  return { id, name: p.name, role: p.role, country: p.country, initials, goal: p.goal, needs: p.needs, frustrations: p.frustrations, color };
};

const PERSONA_STYLE: { id: PersonaId; actor: Actor; initials: string; color: Persona['color'] }[] = [
  { id: 'somsack', actor: somsack_sengmany, initials: 'baby', color: { dot: 'bg-lime-600', soft: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-800', hex: '#65a30d' } },
  { id: 'khamla', actor: khamla_sengmany, initials: 'KS', color: { dot: 'bg-rose-500', soft: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', hex: '#f43f5e' } },
  { id: 'bounmy', actor: bounmy_sengmany, initials: 'BS', color: { dot: 'bg-violet-500', soft: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', hex: '#8b5cf6' } },
  { id: 'vilay', actor: vilay, initials: 'VI', color: { dot: 'bg-teal-500', soft: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', hex: '#14b8a6' } },
  { id: 'chanthasone', actor: chanthasone, initials: 'CH', color: { dot: 'bg-sky-500', soft: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', hex: '#0ea5e9' } },
  { id: 'anan', actor: anan, initials: 'DA', color: { dot: 'bg-amber-500', soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', hex: '#f59e0b' } },
];

export const PERSONAS: Persona[] = PERSONA_STYLE.map((s) => fromActor(s.id, s.actor, s.initials, s.color));

export const PERSONA_BY_ID: Record<PersonaId, Persona> = PERSONAS.reduce(
  (acc, p) => ({ ...acc, [p.id]: p }),
  {} as Record<PersonaId, Persona>,
);

export const CHAPTERS: JourneyChapter[] = [
  {
    id: 'born-abroad',
    number: 1,
    title: 'Born abroad',
    when: 'Birth day (T0)',
    where: 'Chiang Rai, Thailand',
    country: 'Thailand',
    summary: 'A Lao baby gets his first vaccines in Thailand and leaves with signed paper cards.',
  },
  {
    id: 'found-at-home',
    number: 2,
    title: 'Found at home',
    when: '3 weeks later',
    where: 'Village 04, Lao PDR',
    country: 'Lao PDR',
    summary: 'A health worker registers him offline and records the cards as "reported, not yet verified".',
  },
  {
    id: 'made-official',
    number: 3,
    title: 'Made official',
    when: '4 weeks later',
    where: 'District Health Center, Lao PDR',
    country: 'Lao PDR',
    summary: 'A nurse verifies the cards are genuine and fits the Thai doses into the Lao schedule.',
  },
  {
    id: 'crossing-back',
    number: 4,
    title: 'Crossing back',
    when: '12 months later',
    where: 'Lao PDR → Thailand',
    country: 'Cross-Border',
    summary: 'The family shares his full record with a Thai doctor using a link on Dad’s phone.',
  },
];

/** How much a clinician can rely on Somsack's vaccine record, step by step. */
export const RECORD_TRUST_LADDER = [
  { label: 'On paper', hint: 'Signed cards in the family’s hands' },
  { label: 'Reported', hint: 'Captured, but marked unverified' },
  { label: 'Verified', hint: 'Signature checked against WHO trust list' },
  { label: 'Scheduled', hint: 'Counts toward the Lao schedule' },
  { label: 'Portable', hint: 'Full summary the family can share' },
  { label: 'Shared & audited', hint: 'Viewed abroad, every access logged home' },
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    stageCode: 'J1',
    screenId: 'S1',
    chapterId: 'born-abroad',
    title: 'A Lao baby is born in Thailand',
    headline: 'Somsack gets his birth vaccines in a Thai hospital — and the only thing that will cross the border with him is a pair of paper cards.',
    when: 'T0 · Birth day',
    where: 'Chiang Rai Provincial Hospital',
    touchpoint: 'Hospital records + printed QR cards',
    lead: 'anan',
    moments: {
      anan: {
        doing: 'Gives Hep B and BCG birth doses and prints two signed QR vaccine cards.',
        feeling: '“He isn’t Thai, but he still needs a record he can take home.”',
        emotion: 1,
      },
      somsack: {
        doing: 'Is born, and gets his Hep B and BCG birth doses within hours.',
        feeling: '“Two small jabs, and a record that will follow him.”',
        emotion: 0,
      },
      khamla: {
        doing: 'Gives birth away from home and receives two paper cards at discharge.',
        feeling: '“Will anyone back home believe these papers?”',
        emotion: -1,
      },
    },
    painPoint: 'The baby has no Thai ID number, so his records would normally stay locked inside the Thai hospital’s system.',
    enabler: 'A digitally signed QR card travels with the family — no ID number or database lookup needed.',
    record: { level: 0, description: '2 signed paper cards (Hep B, BCG)', heldWhere: 'Khamla’s bag' },
    handoff: 'Two paper cards go home with Khamla',
    whatIf: {
      scenario: 'The cards are lost on the way home.',
      outcome: 'The doses still happened, but no proof travels. Lao clinicians must re-vaccinate or rely on memory.',
    },
    askTheRoom: 'What is the minimum a family should leave hospital with when their baby has no national ID?',
    policyTakeaway: 'Babies born abroad can get a verifiable vaccine record before they have the host country’s civil registration or a national ID — and registering the birth at home still matters.',
    facilitatorCue: 'Start with Khamla, not the technology. Hold up a paper card: this is the only thing that crosses the border.',
  },
  {
    stageCode: 'J2a',
    screenId: 'S2',
    chapterId: 'found-at-home',
    title: 'A health worker finds the baby at home',
    headline: 'On a routine village visit, Vilay discovers a newborn the Lao system doesn’t know exists — and registers him with no signal.',
    when: 'T0 + 3 weeks',
    where: 'Catchment Village 04',
    touchpoint: 'Offline phone app (household form)',
    lead: 'vilay',
    moments: {
      vilay: {
        doing: 'Adds Somsack to the Sengmany household roster on her offline phone.',
        feeling: '“No signal for weeks — but I need to register him today.”',
        emotion: 0,
      },
      somsack: {
        doing: 'Is added to his household: the Lao health system now knows he exists.',
        feeling: '“Three weeks old, and now he counts.”',
        emotion: 1,
      },
      khamla: {
        doing: 'Tells Vilay about the birth in Thailand and shows the cards.',
        feeling: '“I hope we’re not in trouble for giving birth abroad.”',
        emotion: -1,
      },
      bounmy: {
        doing: 'Confirms household details as head of household.',
        feeling: '“Good, he’s on our family record now.”',
        emotion: 0,
      },
    },
    painPoint: 'Babies born abroad are invisible to the home health system until civil registration catches up — sometimes months later.',
    enabler: 'An offline form links the baby to his household immediately; it syncs once the phone finds a signal.',
    record: { level: 0, description: 'Baby registered; vaccines still only on paper', heldWhere: 'Paper cards + CHW phone' },
    handoff: 'Somsack is now on the household roster',
    whatIf: {
      scenario: 'Vilay’s phone stays offline for 28 days.',
      outcome: 'Everything stays queued safely on the device and syncs when she next reaches the health center.',
    },
    askTheRoom: 'Who should be allowed to create a health identity for a newborn — and how early?',
    policyTakeaway: 'Newborns can be registered at home, offline, before civil registration or a national ID exists.',
    facilitatorCue: 'Ask who in the room has worked with CHWs. What does “offline” really mean in their context?',
  },
  {
    stageCode: 'J2b',
    screenId: 'S3',
    chapterId: 'found-at-home',
    title: 'The cards are scanned — but not trusted yet',
    headline: 'Vilay can read the vaccines on the cards, but she can’t prove they are genuine. So she records them as “reported” and refers the family on.',
    when: 'T0 + 3 weeks',
    where: 'Catchment Village 04',
    touchpoint: 'Offline phone app (QR scan + referral)',
    lead: 'vilay',
    moments: {
      vilay: {
        doing: 'Scans both QR cards, saves them as unverified and books a clinic referral.',
        feeling: '“I can read it, but I can’t prove it’s real out here.”',
        emotion: 0,
      },
      khamla: {
        doing: 'Receives a referral to the District Health Center.',
        feeling: '“Another trip — but at least they know about his vaccines now.”',
        emotion: 0,
      },
    },
    painPoint: 'Without a check, a forged or mistyped card could quietly become an official record.',
    enabler: 'The app keeps “what the family told us” clearly separate from “what we have verified”.',
    record: { level: 1, description: '2 doses saved as “reported by family”', heldWhere: 'CHW phone (waiting to sync)' },
    handoff: 'Referral to the District Health Center',
    whatIf: {
      scenario: 'What if the CHW phone could verify signatures offline too?',
      outcome: 'Technically possible with a cached trust list — but who keeps it current on thousands of village phones?',
    },
    askTheRoom: 'Is an “unverified but recorded” vaccine useful to the next clinician — or a risk?',
    policyTakeaway: 'Keep a clear line between what families report and what has been verified, and don’t grant trust too early.',
    facilitatorCue: 'This is the key trust boundary in the story. Pause and make sure everyone sees why the CHW does not verify.',
  },
  {
    stageCode: 'J3a',
    screenId: 'S4',
    chapterId: 'made-official',
    title: 'The clinic confirms the cards are genuine',
    headline: 'Nurse Chanthasone scans the card, and her tablet checks Thailand’s digital signature against the WHO trust list — without contacting Thailand.',
    when: 'T0 + 4 weeks',
    where: 'Vientiane District Health Center',
    touchpoint: 'Clinic tablet (verification)',
    lead: 'chanthasone',
    moments: {
      chanthasone: {
        doing: 'Scans the card; the tablet confirms the Thai signature and marks the doses verified.',
        feeling: '“A green tick — I can trust a hospital I’ve never heard of.”',
        emotion: 2,
      },
      khamla: {
        doing: 'Brings Somsack in for the referral visit.',
        feeling: '“They believe the Thai papers!”',
        emotion: 1,
      },
    },
    painPoint: 'Clinicians either distrust foreign paper and re-vaccinate, or trust it blindly.',
    enabler: 'Thailand’s signing key is on the shared WHO trust list, so any clinic can check it locally.',
    record: { level: 2, description: 'Doses verified; Thailand recorded as the source', heldWhere: 'District clinic records' },
    handoff: 'Verified doses, ready to schedule',
    whatIf: {
      scenario: 'The card has been tampered with.',
      outcome: 'The signature check fails, the doses stay unverified and the nurse follows the local catch-up policy.',
      tryOnScreen: 'Try “Simulate Tampered QR Card” on this screen',
    },
    askTheRoom: 'When verification fails, what should the nurse do — and how is it explained to the family?',
    policyTakeaway: 'Trust is decentralized: a Lao clinic verifies a Thai signature itself, without contacting Thailand.',
    facilitatorCue: 'Open the screen and flip the tamper toggle live. The contrast lands better than any explanation.',
  },
  {
    stageCode: 'J3b',
    screenId: 'S5',
    chapterId: 'made-official',
    title: 'Thai vaccines are fitted to the Lao schedule',
    headline: 'The Thai Hep B product doesn’t match anything on the Lao schedule. Chanthasone makes the clinical call, and the system works out what’s due next.',
    when: 'T0 + 4 weeks',
    where: 'Vientiane District Health Center',
    touchpoint: 'Clinic tablet (vaccine matching + schedule)',
    lead: 'chanthasone',
    moments: {
      chanthasone: {
        doing: 'Confirms the Thai product equals the Lao birth dose; the system books the 6-week vaccines.',
        feeling: '“Different name, same vaccine — I can make that call.”',
        emotion: 1,
      },
      khamla: {
        doing: 'Leaves with a date for Somsack’s next vaccines.',
        feeling: '“Now I know exactly when to come back.”',
        emotion: 2,
      },
    },
    painPoint: 'Countries name and package vaccines differently, so doses get missed or repeated.',
    enabler: 'Thailand’s original code is kept and the Lao code is added alongside; the schedule engine calculates what’s due.',
    record: { level: 3, description: 'Birth doses count; next appointment booked', heldWhere: 'Lao national health records' },
    handoff: 'Somsack continues on the Lao schedule for a year',
    whatIf: {
      scenario: 'There is no automatic match for the foreign vaccine.',
      outcome: 'That is exactly this step. The nurse decides — and her decision could be shared so the next nurse doesn’t have to.',
      tryOnScreen: 'Walk through the 3-layer match on this screen',
    },
    askTheRoom: 'Who should own the mapping between countries’ vaccine codes — WHO, each country, or each clinic?',
    policyTakeaway: 'Never overwrite another country’s record: keep the original coding alongside the national one.',
    facilitatorCue: 'Emphasize: the Thai record is never overwritten. Both codes live side by side.',
  },
  {
    stageCode: 'J4.0a',
    screenId: 'S6',
    chapterId: 'crossing-back',
    title: 'One phone holds the whole family’s records',
    headline: 'A year on, the family plans a trip to Thailand. Bounmy’s phone holds records for all three of them, including Somsack’s six verified doses.',
    when: 'T0 + 12 months',
    where: 'Vientiane, Lao PDR',
    touchpoint: 'Family wallet app on Dad’s phone',
    lead: 'bounmy',
    moments: {
      bounmy: {
        doing: 'Opens the family wallet: profiles for himself, Khamla and Somsack.',
        feeling: '“One phone, three people — I can manage all of us.”',
        emotion: 1,
      },
      khamla: {
        doing: 'Relies on Bounmy’s phone for her own and the baby’s records.',
        feeling: '“It’s on his phone. What if I travel without him?”',
        emotion: -1,
      },
    },
    painPoint: 'Many families share one smartphone; one-app-per-person designs leave them out.',
    enabler: 'A household wallet on one phone, with a separate health summary for each person.',
    record: { level: 4, description: '12-month summary: 2 Thai + 4 Lao doses', heldWhere: 'Lao national records + family wallet' },
    handoff: 'Somsack’s summary is ready to share',
    whatIf: {
      scenario: 'Khamla travels alone with Somsack.',
      outcome: 'Who can access the baby’s record without Bounmy’s phone? Delegated access within a household is still an open design question.',
    },
    askTheRoom: 'How do we design for shared phones without compromising each person’s privacy?',
    policyTakeaway: 'Design for shared devices (“One Family, One Phone”) so families with only one phone aren’t left out.',
    facilitatorCue: 'Notice Khamla’s mood dips here. Ask the room why — this is the equity tension in the story.',
  },
  {
    stageCode: 'J4.0b',
    screenId: 'S7',
    chapterId: 'crossing-back',
    title: 'Dad creates a link to share at the clinic',
    headline: 'Before the trip, Bounmy creates a QR link for Somsack’s record, locked with a 4-digit passcode and valid for 14 days (the demo’s settings: each country would set its own). The record itself stays in Lao PDR.',
    when: 'T0 + 12 months',
    where: 'Lao–Thai Friendship Bridge',
    touchpoint: 'Family wallet app (share link)',
    lead: 'bounmy',
    moments: {
      bounmy: {
        doing: 'Creates a passcode-protected QR link for Somsack, valid for 14 days.',
        feeling: '“I decide who sees it, and for how long.”',
        emotion: 2,
      },
    },
    painPoint: 'Sending photos or PDFs of records leaks data and can’t be verified by the receiver.',
    enabler: 'A Verifiable Health Link: the QR holds only a locked pointer; the data stays home until the passcode is given.',
    record: { level: 4, description: 'Shareable link created; data stays in Lao PDR', heldWhere: 'Lao national records (QR is just a pointer)' },
    handoff: 'A QR on Dad’s phone + a passcode he can say aloud',
    whatIf: {
      scenario: 'Bounmy’s phone battery dies at the clinic.',
      outcome: 'The link could be printed in advance, and the original paper cards still prove the birth doses.',
    },
    askTheRoom: 'Is a 4-digit spoken passcode the right balance of security and ease for this family?',
    policyTakeaway: 'Data sovereignty: the record stays in Lao PDR until the family authorizes someone to open it.',
    facilitatorCue: 'Ask: what is inside this QR? (Answer: not the health data — just a pointer and a key.)',
  },
  {
    stageCode: 'J4.1',
    screenId: 'S8',
    chapterId: 'crossing-back',
    title: 'A Thai doctor sees the full history',
    headline: 'Back where it all began, Dr. Anan scans the link, hears the passcode, and sees Somsack’s whole first year — and Lao PDR is told who looked.',
    when: 'T0 + 12 months',
    where: 'Chiang Rai primary care clinic',
    touchpoint: 'Clinic viewer (scan link + passcode)',
    lead: 'anan',
    moments: {
      anan: {
        doing: 'Scans the QR, enters the passcode Bounmy tells him, and sees all six doses.',
        feeling: '“Born here, vaccinated there — and I can see all of it.”',
        emotion: 2,
      },
      somsack: {
        doing: 'Back in Chiang Rai with a fever, he is seen by the doctor who vaccinated him at birth.',
        feeling: '“A strange room, but nobody has to guess what he has had.”',
        emotion: 1,
      },
      bounmy: {
        doing: 'Shows the QR on his phone and says the passcode out loud.',
        feeling: '“No folder of papers this time.”',
        emotion: 2,
      },
      khamla: {
        doing: 'Watches the doctor see everything that happened since the birth.',
        feeling: '“It all followed him.”',
        emotion: 2,
      },
    },
    painPoint: 'Without the history, the doctor would repeat vaccines or have to guess.',
    enabler: 'The record is fetched live from Lao PDR, viewed without being copied, and an access log is sent home.',
    record: { level: 5, description: 'Viewed in Thailand, never copied; access logged in Lao PDR', heldWhere: 'Lao national records' },
    handoff: 'Journey complete — full circle back to Thailand',
    whatIf: {
      scenario: 'The wrong passcode is entered.',
      outcome: 'Access is refused and the attempt is still logged back in Lao PDR.',
      tryOnScreen: 'Try the wrong-passcode test on this screen',
    },
    askTheRoom: 'Should the family be notified every time their child’s record is viewed abroad?',
    policyTakeaway: 'Continuity of care across borders: each country keeps its own records, with no international patient registry and no vendor lock-in. What is agreed regionally is the data model and the trust list, not a shared copy of the data.',
    facilitatorCue: 'Close the loop: the story started and ends in Thailand. Ask what changed for each persona since step 1.',
  },
];

/** Closing questions for delegates (from the original Workshop Guide). */
/** The closing questions, each in the workshop module that carries it (policyData.ts). */
export const DISCUSSION_QUESTIONS: { id: string; module: ModuleId; theme: string; question: string; relatedSteps: string[] }[] = [
  {
    id: 'q1',
    module: 'M2',
    theme: 'Identity for babies born abroad',
    question: 'How should national immunization systems handle temporary IDs for cross-border infants before civil registration is complete?',
    relatedSteps: ['J1', 'J2a'],
  },
  {
    id: 'q2',
    module: 'M4',
    theme: 'Where trust begins',
    question: 'Why should offline CHW devices store foreign cards as “reported, not verified” rather than trying to verify them in the field?',
    relatedSteps: ['J2b', 'J3a'],
  },
  {
    id: 'q3',
    module: 'M3',
    theme: 'Matching vaccines across countries',
    question: 'When a monovalent vaccine is given abroad but the home schedule uses a combination (e.g. pentavalent), how should schedule rules calculate the doses still due?',
    relatedSteps: ['J3b'],
  },
  {
    id: 'q4',
    module: 'M5',
    theme: 'Cross-border access and audit',
    question: 'What agreements do countries need so that a clinician viewing a record abroad triggers an audit entry back in the patient’s home country?',
    relatedSteps: ['J4.0b', 'J4.1'],
  },
];
