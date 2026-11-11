import React from 'react';
import { ArrowRight, Check, UserCheck } from 'lucide-react';
import { ExtLink } from './shared';
import { IG, SPEC } from '../../data/links';

/**
 * J3b in one picture: the issuer's codes (source value set) are mapped by a
 * FHIR ConceptMap to the national schedule's codes (target value set). The
 * Hep B product had no entry, so the nurse's decision is added to the map.
 */
const ROWS: { source: string; target: string; byNurse?: boolean }[] = [
  { source: 'vp-hepb-peds-monovalent', target: 'LAO-EPI-HEPB-BD', byNurse: true },
  { source: 'vp-bcg-freeze-dried', target: 'LAO-EPI-BCG' },
  { source: 'vp-pentavalent-liquid', target: 'LAO-EPI-PENTA-1' },
  { source: 'vp-bopv-drops', target: 'LAO-EPI-OPV-1' },
];

export const ConceptMapIllustration: React.FC = () => (
  <section className="bg-white rounded-2xl border border-sky-200 p-5 shadow-sm space-y-3">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-xs font-bold text-sky-800 uppercase tracking-wider">How the vaccine codes are matched</h3>
      <span className="text-[11px] flex gap-3">
        <ExtLink href={SPEC.conceptMap}>FHIR ConceptMap</ExtLink>
        <ExtLink href={IG.example('ConceptMap', 'TrustDemoProductToOnesaEpi')}>This map in the IG</ExtLink>
      </span>
    </div>
    <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 gap-y-1.5 items-center text-[11px]">
      <div className="text-[10px] font-bold text-amber-800 uppercase">
        Source value set
        <span className="block font-normal normal-case text-slate-500">Thailand’s product codes, as signed</span>
      </div>
      <div className="text-[10px] font-bold text-slate-700 uppercase text-center px-2">ConceptMap</div>
      <div className="text-[10px] font-bold text-sky-800 uppercase">
        Target value set
        <span className="block font-normal normal-case text-slate-500">Lao schedule codes</span>
      </div>
      {ROWS.map((r) => (
        <React.Fragment key={r.source}>
          <code className="rounded-md bg-amber-50 border border-amber-200 px-2 py-1 font-mono text-amber-900 truncate">{r.source}</code>
          <span className="flex items-center justify-center gap-1 text-slate-500 px-2" title={r.byNurse ? 'Added from the nurse’s decision' : 'equivalent'}>
            {r.byNurse ? <UserCheck className="w-3.5 h-3.5 text-sky-700" /> : <Check className="w-3.5 h-3.5" />}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <code className="rounded-md bg-sky-50 border border-sky-200 px-2 py-1 font-mono text-sky-900 truncate">{r.target}</code>
        </React.Fragment>
      ))}
    </div>
    <p className="text-[11px] text-slate-600 leading-snug">
      <UserCheck className="inline w-3.5 h-3.5 text-sky-700 -mt-0.5" /> The Hep B product had no entry: the nurse confirmed it
      counts as the birth dose, and her decision was added to the map. The dose keeps both codes; the Thai code is never
      overwritten. The codes are illustrative stand-ins.
    </p>
  </section>
);
