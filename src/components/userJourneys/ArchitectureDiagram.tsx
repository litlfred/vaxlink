import React from 'react';
import { Globe2, KeyRound, ShieldCheck, ArrowLeftRight } from 'lucide-react';
import { DPI_H_RA, IG, SPEC } from '../../data/links';
import { ExtLink, countryChip } from './shared';

/**
 * The Thai and Lao components of the demo, laid out on the layers of the
 * DPI-H reference architecture's Integrated View (smart-ra, Fig. 3.2), with
 * WHO GDHCN as the foundation both countries build on. Every building-block
 * name links to its element page in the smart-ra ArchiMate model; every
 * component links to its place in the SMART Trust demonstrator IG.
 */

const RA_MODEL = 'https://litlfred.github.io/smart-ra/en/dpi-h-ra/archimate/0.3.0-draft.1';
const ra = (id: string) => `${RA_MODEL}/elements/${id}/`;
const RA_VIEW = `${RA_MODEL}/views/id-b16aba0577295090bd77388f73c61239/`;

/** DPI-H RA elements (smart-ra ArchiMate model 0.3.0-draft.1). */
export const RA = {
  pos: { name: 'Point-of-service & functional applications', id: 'id-c9b5f2ae923b5e38801bd1dbf8b382b9' },
  reusable: { name: 'DPI-H reusable components', id: 'id-08403902fa3e5df4920a1fbe8eddd82f' },
  shared: { name: 'DPI-H shared data layer', id: 'id-00d4ffa565f55eb996137917386ecac1' },
  dpif: { name: 'Foundational DPI (DPI-F)', id: 'id-077b000f20b95c899adb1143f8ee8cd5' },
  providerSystems: { name: 'Provider Systems', id: 'id-270f6a946e9d5feea37702bdb93980ba' },
  chw: { name: 'CHW & Community', id: 'id-3384363f5f8d5ab09a43380f2f8962ba' },
  citizenApps: { name: 'Citizen / Patient Apps', id: 'id-b1c7360ab5595d6ca684259d405c5889' },
  cdss: { name: 'Computable Decision Support Engine', id: 'id-539b04ae45f147258d8253ae5cb87402' },
  terminology: { name: 'Terminology Service', id: 'id-3f41de2b51c24041b08243bf72b140d1' },
  hmis: { name: 'Health Management Information System', id: 'id-d626508a7dc55b1fb11bf34f57f8ddd9' },
  clientRegistry: { name: 'Client Registry for Health', id: 'id-bc813024f32358c98e5512e43cf2c9bc' },
  facilityRegistry: { name: 'Health Facility Registry', id: 'id-4e0767822dcf46409554156a133fbc67' },
  workforceRegistry: { name: 'Health Workforce Registry', id: 'id-350840520ae44f658b6ad3b3762e382e' },
  productRegistry: { name: 'Product Registry', id: 'id-59c26d672a4248e0bb83cf4d26cba10c' },
  lhr: { name: 'Lifelong Health Record', id: 'id-0e6d89398fff4f20994a31b4de58e7d7' },
  trustServices: { name: 'National Trust Services', id: 'id-847e6eea9ee15a39ad97e8861444ce79' },
  mediator: { name: 'DPI-F Information Mediator', id: 'id-3c5d846710034c4595e206e748d65e36' },
  openStandards: { name: 'Open standards', id: 'id-2610e41fcdf258fe80fd948303fe2d74' },
};
export type RaEl = (typeof RA)[keyof typeof RA];

export type Comp = { ra: RaEl; name: string; stages: string; href: string };
export type Layer = { ra: RaEl; tone: string; th: Comp[]; la: Comp[] };

export const LAYERS: Layer[] = [
  {
    ra: RA.pos,
    tone: 'bg-teal-50 border-teal-200',
    th: [
      { ra: RA.providerSystems, name: 'Birth hospital EHR', stages: 'J1', href: IG.profile('TrustDemoThImmunization') },
      { ra: RA.providerSystems, name: 'Clinic VHL viewer', stages: 'J4.1', href: IG.profile('TrustDemoThVhlReceipt') },
    ],
    la: [
      { ra: RA.chw, name: 'CHW app (OHS, SDC forms)', stages: 'J2', href: IG.profile('TrustDemoLaoRegistration') },
      { ra: RA.providerSystems, name: 'District health centre EHR', stages: 'J3', href: IG.profile('TrustDemoLaoImmunization') },
      { ra: RA.citizenApps, name: 'Family wallet', stages: 'J4.0', href: IG.example('Consent', 'TrustDemoJ4Consent') },
    ],
  },
  {
    ra: RA.reusable,
    tone: 'bg-sky-50 border-sky-200',
    th: [],
    la: [
      { ra: RA.terminology, name: 'ConceptMap: product → Lao EPI', stages: 'J3', href: IG.example('ConceptMap', 'TrustDemoProductToLaoEpi') },
      { ra: RA.cdss, name: 'Infant schedule (PlanDefinition)', stages: 'J3', href: IG.example('PlanDefinition', 'TrustDemoLaoInfantSchedule') },
      { ra: RA.hmis, name: 'OHS FHIR Data Pipes', stages: 'J3', href: SPEC.ohsPipes },
    ],
  },
  {
    ra: RA.shared,
    tone: 'bg-indigo-50 border-indigo-200',
    th: [
      { ra: RA.lhr, name: 'Hospital immunization record', stages: 'J1', href: IG.example('Immunization', 'TrustDemoJ1HepB') },
      { ra: RA.productRegistry, name: 'Vaccine product codes', stages: 'J1', href: IG.example('CodeSystem', 'TrustDemoVaccineProduct') },
    ],
    la: [
      { ra: RA.clientRegistry, name: 'Child + household', stages: 'J2', href: IG.profile('TrustDemoLaoPatient') },
      { ra: RA.facilityRegistry, name: 'Clinics and health centres', stages: 'J2, J3', href: IG.example('Organization', 'TrustDemoVientianeDhc') },
      { ra: RA.workforceRegistry, name: 'CHWs and nurses', stages: 'J2, J3', href: IG.example('Practitioner', 'TrustDemoVilay') },
      { ra: RA.lhr, name: 'National FHIR server', stages: 'J3, J4', href: IG.example('Bundle', 'TrustDemoJ4Ips') },
    ],
  },
  {
    ra: RA.dpif,
    tone: 'bg-violet-50 border-violet-200',
    th: [{ ra: RA.trustServices, name: 'DVC signer (HCERT)', stages: 'J1', href: SPEC.trust }],
    la: [
      { ra: RA.trustServices, name: 'DVC verifier, VHL issuer', stages: 'J3, J4', href: IG.profile('TrustDemoLaoDvcVerification') },
      { ra: RA.mediator, name: 'OHS Info Gateway + access log', stages: 'J4.1', href: IG.profile('TrustDemoLaoVhlAccess') },
    ],
  },
];

const Box: React.FC<{ c: Comp }> = ({ c }) => (
  <div className="rounded-md border border-slate-300 bg-white px-2 py-1.5 shadow-[1px_1px_0_rgba(15,23,42,0.08)]">
    <a href={ra(c.ra.id)} target="_blank" rel="noopener noreferrer" className="block text-[9px] uppercase tracking-wider text-slate-500 font-semibold hover:text-sky-700" title="DPI-H RA element (smart-ra)">
      {c.ra.name}
    </a>
    <div className="text-xs font-semibold leading-snug">
      <ExtLink href={c.href}>{c.name}</ExtLink>
    </div>
    <div className="text-[10px] font-mono text-slate-500">{c.stages}</div>
  </div>
);

const Cell: React.FC<{ comps: Comp[]; country: 'Thailand' | 'Lao PDR' }> = ({ comps, country }) => (
  <div className="rounded-lg border border-dashed border-slate-300/80 bg-white/60 p-1.5">
    <div className="md:hidden text-[9px] font-bold text-slate-500 mb-1">{country}</div>
    {comps.length === 0 ? (
      <div className="text-[10px] italic text-slate-400 px-1 py-2">Not needed in this journey</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {comps.map((c) => (
          <Box key={c.name} c={c} />
        ))}
      </div>
    )}
  </div>
);

const Flag: React.FC<{ country: 'Thailand' | 'Lao PDR' }> = ({ country }) => (
  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 px-1">
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${countryChip(country)}`}>{country === 'Thailand' ? 'TH' : 'LA'}</span>
    {country === 'Thailand' ? 'Thailand (Chiang Rai)' : 'Lao PDR (home)'}
  </div>
);

export const ArchitectureDiagram: React.FC = () => (
  <section className="bg-white rounded-2xl border border-clinical-divider shadow-sm p-4 md:p-5 space-y-3">
    <div className="space-y-1">
      <h3 className="text-base font-bold text-clinical-ink">Architecture: two countries on one trust foundation</h3>
      <p className="text-xs text-clinical-steel max-w-4xl">
        Each country builds its own stack on the layers of the{' '}
        <ExtLink href={RA_VIEW}>DPI-H reference architecture’s Integrated View</ExtLink> (
        <ExtLink href={DPI_H_RA}>DPI-H RA</ExtLink>). Underneath both is WHO GDHCN: the shared trust list that lets a Lao clinic
        believe a Thai certificate, and a Thai clinic believe a Lao link, with no direct connection between the two. Small
        capitals name the RA building block; the component links to its place in the{' '}
        <ExtLink href={IG.site}>IG</ExtLink>; codes are the journey moments.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr_1fr] gap-1.5">
      <div className="hidden md:block" />
      <div className="hidden md:block"><Flag country="Thailand" /></div>
      <div className="hidden md:block"><Flag country="Lao PDR" /></div>

      {LAYERS.map((l) => (
        <React.Fragment key={l.ra.id}>
          <a
            href={ra(l.ra.id)}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-lg border ${l.tone} px-2.5 py-2 text-[11px] font-bold text-slate-700 leading-tight hover:underline md:mt-0 mt-2`}
          >
            {l.ra.name}
          </a>
          <div className={`rounded-lg border ${l.tone} p-1`}>
            <Cell comps={l.th} country="Thailand" />
          </div>
          <div className={`rounded-lg border ${l.tone} p-1`}>
            <Cell comps={l.la} country="Lao PDR" />
          </div>
        </React.Fragment>
      ))}

      {/* Cross-cutting interoperability: the open standards both sides speak */}
      <a
        href={ra(RA.openStandards.id)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border bg-slate-50 border-slate-200 px-2.5 py-2 text-[11px] font-bold text-slate-700 leading-tight hover:underline mt-2 md:mt-0"
      >
        Interoperability (cross-cutting): open standards
      </a>
      <div className="md:col-span-2 rounded-lg border bg-slate-50 border-slate-200 px-3 py-2 text-xs text-slate-700 flex flex-wrap gap-x-4 gap-y-1">
        <ExtLink href={SPEC.fhir}>HL7 FHIR</ExtLink>
        <ExtLink href={SPEC.smartImm}>WHO SMART Immunizations</ExtLink>
        <ExtLink href={SPEC.hcertQr}>HCERT (DVC)</ExtLink>
        <ExtLink href={SPEC.vhl}>IHE VHL</ExtLink>
        <ExtLink href={SPEC.ips}>IPS</ExtLink>
        <ExtLink href={SPEC.sdc}>SDC</ExtLink>
        <ExtLink href={SPEC.pcf}>IHE PCF</ExtLink>
        <ExtLink href={SPEC.balp}>IHE BALP</ExtLink>
      </div>

      {/* The foundation */}
      <div className="md:col-span-3 mt-1 rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 p-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Globe2 className="w-6 h-6 text-amber-600" />
          <div className="text-sm font-bold text-slate-900">
            Foundation: <ExtLink href={SPEC.gdhcn}>WHO Global Digital Health Certification Network (GDHCN)</ExtLink>
          </div>
          <span className="text-[11px] text-slate-600">
            the trust list of participants’ public keys (<ExtLink href={SPEC.trust}>SMART Trust</ExtLink>)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-[11px] text-slate-700">
          <div className="flex gap-1.5"><KeyRound className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" /> Thailand publishes the key it signs certificates with.</div>
          <div className="flex gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" /> Lao PDR caches the list, so its clinics verify Thai cards offline; Thailand does the same for Lao VHLs.</div>
          <div className="flex gap-1.5"><ArrowLeftRight className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" /> <span>Data crosses only as a signed QR the family carries, or a VHL the family shares; never system to system.</span></div>
        </div>
      </div>
    </div>
  </section>
);
