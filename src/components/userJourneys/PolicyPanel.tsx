import React, { useCallback, useEffect, useState } from 'react';
import { ClipboardCheck, Gavel, Coins, Shuffle, ScrollText } from 'lucide-react';
import {
  COST_DRIVER_BY_ID,
  DECISION_RIGHT_BY_ID,
  GAP_STRIP,
  GapStatus,
  GapUrgency,
  LEGAL_BASIS_BY_ID,
  MODULE_BY_ID,
  PATTERNS,
  PATTERN_BY_ID,
  PatternId,
  STEP_POLICY,
} from '../../data/policyData';

/* ---------- Gap strip state: one answer per capability, kept in this browser ---------- */

export type GapAnswer = { status?: GapStatus; urgency?: GapUrgency; pattern?: PatternId };
type GapState = Record<string, GapAnswer>;

const KEY = 'vaxlink.gapStrip.v1';
const EVENT = 'vaxlink-gap-strip';

const load = (): GapState => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as GapState;
  } catch {
    return {};
  }
};

/** The table's gap-strip answers, shared by every view on the page and kept across reloads where storage allows. */
export const useGapStrip = () => {
  const [state, setState] = useState<GapState>(load);
  useEffect(() => {
    const sync = () => setState(load());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const save = (next: GapState) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: the answers last for this visit only */
    }
    setState(next);
    window.dispatchEvent(new Event(EVENT));
  };
  const set = useCallback(
    (cap: string, patch: Partial<GapAnswer>) => {
      const cur = { ...load(), ...state };
      const merged: GapAnswer = { ...cur[cap], ...patch };
      if (merged.status === 'exists') merged.urgency = merged.pattern = undefined;
      if (merged.urgency !== 'now') merged.pattern = undefined;
      save({ ...cur, [cap]: merged });
    },
    [state],
  );
  const reset = () => save({});
  return { state, set, reset };
};

/* ---------- Small pieces ---------- */

const Choice: React.FC<{ on: boolean; onClick: () => void; children: React.ReactNode; tone: string }> = ({ on, onClick, children, tone }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1.5 min-h-[32px] rounded-lg border transition ${
      on ? tone : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
    }`}
  >
    {children}
  </button>
);

export const ModuleChip: React.FC<{ id: keyof typeof MODULE_BY_ID }> = ({ id }) => (
  <span title={`${MODULE_BY_ID[id].title} · ${MODULE_BY_ID[id].sheet}`} className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 flex-shrink-0">
    {id}
  </span>
);

const STATUS_TONE: Record<GapStatus, string> = {
  exists: 'bg-emerald-600 text-white border-emerald-600',
  partial: 'bg-amber-500 text-white border-amber-500',
  absent: 'bg-rose-600 text-white border-rose-600',
};

/** The gap strip for one moment: for each capability it needs, exists / partial / absent, then how urgent, then which pattern. */
export const GapStrip: React.FC<{ stage: string }> = ({ stage }) => {
  const policy = STEP_POLICY[stage];
  const { state, set } = useGapStrip();
  if (!policy) return null;
  return (
    <div className="space-y-3">
      {policy.capabilities.map((c) => {
        const a = state[c.id] ?? {};
        const gap = a.status === 'partial' || a.status === 'absent';
        return (
          <div key={c.id} className="rounded-xl border border-slate-200 p-3 space-y-2">
            <div className="text-sm font-semibold text-slate-900 leading-snug">{c.label}</div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${c.label}: in your country`}>
              {GAP_STRIP.status.map((s) => (
                <Choice key={s.id} on={a.status === s.id} tone={STATUS_TONE[s.id]} onClick={() => set(c.id, { status: a.status === s.id ? undefined : s.id })}>
                  {s.label}
                </Choice>
              ))}
            </div>
            {gap && (
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${c.label}: how urgent`}>
                {GAP_STRIP.urgency.map((u) => (
                  <Choice key={u.id} on={a.urgency === u.id} tone="bg-slate-900 text-white border-slate-900" onClick={() => set(c.id, { urgency: a.urgency === u.id ? undefined : u.id })}>
                    {u.label}
                  </Choice>
                ))}
              </div>
            )}
            {gap && a.urgency === 'now' && (
              <div className="space-y-1">
                <div className="text-[11px] text-slate-600">Which pattern gets us moving? (Then: what debt does it create?)</div>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${c.label}: pattern`}>
                  {PATTERNS.map((p) => (
                    <Choice key={p.id} on={a.pattern === p.id} tone="bg-indigo-600 text-white border-indigo-600" onClick={() => set(c.id, { pattern: a.pattern === p.id ? undefined : p.id })}>
                      {p.label}
                      {p.id === policy.pattern.id && ' ★'}
                    </Choice>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <p className="text-[11px] italic text-slate-500">{GAP_STRIP.standingLine}</p>
    </div>
  );
};

/** The policy layer of one moment: its questions by module, what it forces, and the gap strip. */
export const PolicyPanel: React.FC<{ stage: string }> = ({ stage }) => {
  const policy = STEP_POLICY[stage];
  if (!policy) return null;
  const pattern = PATTERN_BY_ID[policy.pattern.id];
  return (
    <section className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
        <ScrollText className="w-4 h-4" /> Policy questions for the table
      </h3>
      <ol className="space-y-2.5">
        {policy.questions.map((q) => (
          <li key={q.text} className="flex items-start gap-2">
            <ModuleChip id={q.module} />
            <span className="text-sm text-slate-800 leading-snug">{q.text}</span>
          </li>
        ))}
      </ol>

      <dl className="grid grid-cols-1 gap-2 text-xs">
        <div className="flex items-start gap-2">
          <dt className="flex items-center gap-1 font-bold text-slate-600 w-28 flex-shrink-0"><Gavel className="w-3.5 h-3.5" /> Forces</dt>
          <dd className="flex flex-wrap gap-1">
            {policy.decisionRights.map((d) => (
              <span key={d} title={DECISION_RIGHT_BY_ID[d].question} className="px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-800 font-semibold">
                {DECISION_RIGHT_BY_ID[d].label}
              </span>
            ))}
            {policy.legalBasis.map((l) => (
              <span key={l} className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
                {LEGAL_BASIS_BY_ID[l].label}
              </span>
            ))}
          </dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="flex items-center gap-1 font-bold text-slate-600 w-28 flex-shrink-0"><Coins className="w-3.5 h-3.5" /> Cost driver</dt>
          <dd className="text-slate-800">{COST_DRIVER_BY_ID[policy.costDriver].label}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="flex items-center gap-1 font-bold text-slate-600 w-28 flex-shrink-0"><Shuffle className="w-3.5 h-3.5" /> If it is missing</dt>
          <dd className="text-slate-800">
            <strong>{pattern.label}</strong> ★ — {policy.pattern.why}
          </dd>
        </div>
      </dl>

      <div className="pt-3 border-t border-slate-100 space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardCheck className="w-4 h-4 text-indigo-600" /> Gap strip: what this moment needs, in your country
        </h4>
        <GapStrip stage={stage} />
      </div>
    </section>
  );
};
