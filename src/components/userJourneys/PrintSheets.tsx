import React from 'react';
import { createPortal } from 'react-dom';
import { Printer } from 'lucide-react';
import { JOURNEY_STEPS } from '../../data/journeyData';
import {
  COST_DRIVERS,
  DECISION_RIGHTS,
  GAP_STRIP,
  LEGAL_BASES,
  MODULE_BY_ID,
  ModuleId,
  PATTERNS,
  QUESTIONS_BY_MODULE,
  SCOPE_PROMISE,
  STEP_POLICY,
  USE_CASE_STATEMENT,
} from '../../data/policyData';
import { LAYERS } from './ArchitectureDiagram';

/**
 * The table canvas, printable: a cover and Sheets 1–6 in the order the
 * workshop fills them, one A3 landscape page each. Every sheet carries the
 * questions this journey asks in its module(s), tick-boxes rather than prose
 * where it can, and the gap strip across its foot. Printing shows only the
 * sheets (see the print rules at the end of this file).
 */

const SHEETS: { n: number; title: string; modules: ModuleId[] }[] = [
  { n: 1, title: 'Our journey and where it breaks', modules: ['M1'] },
  { n: 2, title: 'Our architecture today', modules: ['M2'] },
  { n: 3, title: 'Core data set, terminology and specifications', modules: ['M3'] },
  { n: 4, title: 'Trust, and who decides', modules: ['M4', 'M5'] },
  { n: 5, title: 'Doing it once, together: our nomination', modules: ['M6'] },
  { n: 6, title: 'Our first move and our ask', modules: ['M7'] },
];


const Box: React.FC = () => <span className="inline-block w-3.5 h-3.5 border-[1.5px] border-slate-800 rounded-[2px] align-middle flex-shrink-0" />;
const Tick: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-1 mr-2 whitespace-nowrap">
    <Box /> {label}
  </span>
);
const Lines: React.FC<{ n?: number }> = ({ n = 2 }) => (
  <div className="space-y-3.5 pt-2.5">
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="border-b border-slate-400" />
    ))}
  </div>
);
const Field: React.FC<{ label: string; lines?: number }> = ({ label, lines = 1 }) => (
  <div>
    <div className="text-[11px] font-bold text-slate-700">{label}</div>
    <Lines n={lines} />
  </div>
);

const SheetHead: React.FC<{ n: number | string; title: string; modules: ModuleId[] }> = ({ n, title, modules }) => (
  <header className="flex items-end justify-between gap-4 border-b-2 border-slate-900 pb-2 mb-3">
    <div>
      <div className="text-[11px] font-mono font-bold text-slate-500">
        SHEET {n}
        {modules.length > 0 && ` · ${modules.map((m) => `${m} ${MODULE_BY_ID[m].title}`).join(' · ')}`}
      </div>
      <h2 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h2>
    </div>
    <div className="text-[11px] text-slate-600 whitespace-nowrap">Country ____________ Table ___</div>
  </header>
);

/** The questions this journey asks in a module, one per moment, each with room to answer. */
const Questions: React.FC<{ m: ModuleId; lines?: number; compact?: boolean }> = ({ m, lines = 2, compact }) => (
  <div className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
    <div className="text-[11px] italic text-slate-600">DISCUSS: {MODULE_BY_ID[m].carries}</div>
    {QUESTIONS_BY_MODULE[m].map((q, i) => (
      <div key={i} className="break-inside-avoid">
        <div className={`${compact ? 'text-[11px]' : 'text-[12px]'} text-slate-900 leading-snug`}>
          <span className="font-mono font-bold text-slate-500 mr-1.5">{q.stage}</span>
          {q.text}
        </div>
        <Lines n={lines} />
      </div>
    ))}
  </div>
);

/** Short tick labels for the gap strip, whose header says what each column asks. */
const URGENCY_SHORT: Record<string, string> = { now: 'Now', '12m': '12 months', wait: 'Wait' };

/** The gap strip, at the foot of every sheet: the capabilities of the moments this sheet asks about. */
const GapStrip: React.FC<{ modules: ModuleId[] }> = ({ modules }) => {
  const stages = Array.from(new Set(modules.flatMap((m) => QUESTIONS_BY_MODULE[m].map((q) => q.stage))));
  const caps = Array.from(new Map(stages.flatMap((s) => STEP_POLICY[s].capabilities.map((c) => [c.id, { s, c }] as const))).values());
  return (
    <section className="mt-auto pt-2 border-t-2 border-dashed border-slate-500 break-inside-avoid">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
        Gap strip — for everything Partial or Absent: does it block us <u>now</u>, is it needed within <u>12 months</u>, or can it <u>wait</u>?
        If it blocks us now, which pattern gets us moving (narrow, shared, borrowed), and what debt does that create?
      </div>
      <div className="grid grid-cols-2 gap-x-6 mt-1">
        {caps.map(({ s, c }) => (
          <div key={c.id} className="flex items-center gap-2 text-[10.5px] border-b border-slate-200 py-[3px]">
            <span className="font-mono text-slate-500 w-9 flex-shrink-0">{s}</span>
            <span className="flex-1 min-w-0 leading-tight">{c.label}</span>
            <span className="flex-shrink-0">{GAP_STRIP.status.map((x) => <Tick key={x.id} label={x.label} />)}</span>
            <span className="flex-shrink-0 border-l border-slate-300 pl-2">{GAP_STRIP.urgency.map((x) => <Tick key={x.id} label={URGENCY_SHORT[x.id]} />)}</span>
            <span className="flex-shrink-0 border-l border-slate-300 pl-2">{PATTERNS.map((p) => <Tick key={p.id} label={p.label.replace('Start ', '')} />)}</span>
          </div>
        ))}
      </div>
      <div className="text-[10px] italic text-slate-600 mt-1">Debt this creates: ________________________________________________ · {GAP_STRIP.standingLine}</div>
    </section>
  );
};

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <article className="a3-sheet bg-white text-slate-900 shadow-sm border border-slate-300 p-7 flex flex-col">{children}</article>
);

/** Sheet-specific blocks, after the questions. */
const Extra: React.FC<{ n: number }> = ({ n }) => {
  if (n === 1)
    return (
      <div className="space-y-3">
        <Field label={`Our use-case statement: “${USE_CASE_STATEMENT}”`} lines={2} />
        <div className="text-[11px] font-bold text-slate-700">The journey — tick where it breaks for us</div>
        <div className="grid grid-cols-4 gap-2 text-[11px]">
          {JOURNEY_STEPS.map((s) => (
            <div key={s.stageCode} className="border border-slate-400 rounded p-2 flex items-start gap-2">
              <Box />
              <span>
                <span className="font-mono font-bold">{s.stageCode}</span> {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  if (n === 2) {
    const blocks = LAYERS.map((l) => ({ layer: l.ra.name, items: Array.from(new Map([...l.th, ...l.la].map((c) => [c.ra.id, c.ra.name])).values()) }));
    return (
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-left text-slate-600 border-b border-slate-400">
            <th className="py-1 pr-2">DPI-H RA block</th>
            <th className="py-1 pr-2 w-[34%]">The system we use today</th>
            <th className="py-1 pr-2">In our country</th>
            <th className="py-1">Could be shared regionally</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((b) => (
            <React.Fragment key={b.layer}>
              <tr>
                <td colSpan={4} className="pt-2 font-bold text-slate-800">{b.layer}</td>
              </tr>
              {b.items.map((name) => (
                <tr key={name} className="border-b border-slate-200">
                  <td className="py-1.5 pr-2">{name}</td>
                  <td className="py-1.5 pr-2 border-b border-slate-400" />
                  <td className="py-1.5 pr-2">{GAP_STRIP.status.map((x) => <Tick key={x.id} label={x.label} />)}</td>
                  <td className="py-1.5"><Box /></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  }
  if (n === 3) return <Field label="Which institution would own the national core data set?" />;
  if (n === 4)
    return (
      <div className="space-y-3">
        <Field label="Three questions to take home (phrased as questions, not answers)" lines={3} />
        <div className="text-[11px] font-bold text-slate-700">Who holds each decision — name the institution, or tick “unassigned”</div>
        <table className="w-full text-[11px]">
          <tbody>
            {DECISION_RIGHTS.map((d) => (
              <tr key={d.id} className="border-b border-slate-200">
                <td className="py-1 pr-2 font-bold w-48" title={d.question}>{d.label}</td>
                <td className="py-1 pr-2 border-b border-slate-400" />
                <td className="py-1 w-28"><Tick label="Unassigned" /></td>
              </tr>
            ))}
            {LEGAL_BASES.map((l) => (
              <tr key={l.id} className="border-b border-slate-200">
                <td className="py-1.5 pr-2 font-bold">{l.label}</td>
                <td className="py-1.5" colSpan={2}>{GAP_STRIP.status.map((x) => <Tick key={x.id} label={x.label} />)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Field label="The one policy or governance change that would unblock the most" />
      </div>
    );
  if (n === 5)
    return (
      <div className="border-2 border-slate-800 rounded p-3 space-y-2">
        <div className="text-[12px] font-bold">Our nomination — written by each country</div>
        <Field label="The component or artefact that should be done once, regionally" />
        <Field label="Who should lead it" />
        <Field label="What our country would contribute" />
        <div className="text-[11px]">
          Where our table’s four nominations coincide: <Lines n={1} />
        </div>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
      <Field label="Use-case statement (carried from Sheet 1)" />
      <Field label="Top national priority" lines={2} />
      <Field label="Our 12-month action, and its named owner" lines={4} />
      <div>
        <div className="text-[11px] font-bold text-slate-700">Cost drivers (tick) and likely source</div>
        <div className="text-[11px] pt-1">{COST_DRIVERS.map((c) => <Tick key={c.id} label={c.label} />)}</div>
        <Lines n={1} />
      </div>
      <Field label="Support needed, and from whom" lines={3} />
      <Field label="Regional commitment text, in our own words" lines={4} />
      <Field label="The one gap we refer for partner follow-up, and to whom" lines={2} />
    </div>
  );
};

/** The cover and the six sheets. */
const Sheets: React.FC = () => (
  <>
      <Page>
        <SheetHead n="—" title="Cover" modules={[]} />
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-w-4xl">
          <Field label="Country" />
          <Field label="Delegation" lines={2} />
          <Field label="Table" />
          <Field label="Facilitator" />
        </div>
        <div className="mt-8 max-w-4xl rounded border-2 border-slate-800 p-4 text-[15px] leading-relaxed">
          <strong>The scope promise.</strong> {SCOPE_PROMISE}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 max-w-5xl text-[12px]">
          {PATTERNS.map((p) => (
            <div key={p.id} className="border border-slate-400 rounded p-3">
              <div className="font-bold">{p.label}</div>
              <div>{p.what}</div>
              <div className="text-slate-500 text-[11px] mt-1">e.g. {p.example}</div>
            </div>
          ))}
        </div>
      </Page>
      {SHEETS.map((s) => (
        <Page key={s.n}>
          <SheetHead n={s.n} title={s.title} modules={s.modules} />
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="space-y-4">
              {s.modules.map((m) => (
                <div key={m}>
                  {s.modules.length > 1 && <div className="text-[12px] font-bold mb-1">{m} {MODULE_BY_ID[m].title}</div>}
                  <Questions m={m} lines={s.n === 2 || s.n === 3 || s.n === 5 ? 2 : 1} compact={s.modules.length > 1} />
                </div>
              ))}
            </div>
            <div>
              <Extra n={s.n} />
            </div>
          </div>
          <GapStrip modules={s.modules} />
        </Page>
      ))}
  </>
);

export const PrintSheets: React.FC = () => (
  <div className="space-y-4">
    <div className="no-print flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-clinical-divider p-4 shadow-sm">
      <div className="flex-1 min-w-[240px]">
        <h3 className="text-base font-bold text-clinical-ink">Table canvas: A3 sheets</h3>
        <p className="text-xs text-clinical-steel">
          A cover and Sheets 1–6, each with this journey’s questions for its module, tick-boxes, and the gap strip at its foot.
          Print on A3, landscape.
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl bg-slate-900 text-white text-sm font-semibold"
      >
        <Printer className="w-4 h-4" /> Print the sheets
      </button>
    </div>

    <div className="space-y-6 overflow-x-auto">
      <Sheets />
    </div>
    {createPortal(
      <div className="print-sheets">
        <Sheets />
      </div>,
      document.body,
    )}

    <style>{`
      .a3-sheet { width: 420mm; min-height: 297mm; box-sizing: border-box; }
      .print-sheets { display: none; }
      @media print {
        @page { size: A3 landscape; margin: 0; }
        body > *:not(.print-sheets) { display: none !important; }
        .print-sheets { display: block; }
        .a3-sheet { height: 296mm; min-height: 0; overflow: hidden; border: none; box-shadow: none; page-break-after: always; break-after: page; }
        .a3-sheet:last-child { page-break-after: auto; break-after: auto; }
        .no-print { display: none !important; }
      }
    `}</style>
  </div>
);

