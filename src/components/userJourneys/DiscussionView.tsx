import React from 'react';
import { MessageCircleQuestion, Play, Landmark, RotateCcw, Gavel, ClipboardList, Shuffle, Printer } from 'lucide-react';
import { DECISION_RIGHTS, GAP_STRIP, MODULES, PATTERNS, PATTERN_BY_ID, QUESTIONS_BY_MODULE, SCOPE_PROMISE, STEP_POLICY } from '../../data/policyData';
import { ModuleChip, useGapStrip } from './PolicyPanel';
import { DISCUSSION_QUESTIONS, JOURNEY_STEPS } from '../../data/journeyData';

interface Props {
  onPresentStep: (index: number) => void;
}

/** Closing view: the policy takeaways of the whole journey and the questions for delegates. */
export const DiscussionView: React.FC<Props> = ({ onPresentStep }) => {
  const indexOf = (code: string) => JOURNEY_STEPS.findIndex((s) => s.stageCode === code);
  const { state: gaps, reset } = useGapStrip();
  const label = (list: readonly { id: string; label: string }[], id?: string) => list.find((x) => x.id === id)?.label ?? '—';
  const StepButton: React.FC<{ code: string }> = ({ code }) => (
    <button
      onClick={() => onPresentStep(indexOf(code))}
      className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-1 min-h-[28px] rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700"
    >
      <Play className="w-3 h-3 text-sky-600" /> {code}
    </button>
  );
  const gapRows = Object.entries(STEP_POLICY).flatMap(([stage, p]) =>
    p.capabilities.filter((c) => gaps[c.id]?.status === 'partial' || gaps[c.id]?.status === 'absent').map((c) => ({ stage, c, a: gaps[c.id] })),
  );
  const answered = Object.values(gaps).filter((a) => a.status).length;
  const total = Object.values(STEP_POLICY).reduce((n, p) => n + p.capabilities.length, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-indigo-950 text-white p-6 md:p-10 shadow-sm">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-indigo-300">
          <MessageCircleQuestion className="w-3.5 h-3.5" /> Questions for the room
        </span>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight mt-2 max-w-3xl">
          The technology works. What do countries need to agree on to make it real?
        </h2>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DISCUSSION_QUESTIONS.map((q, i) => (
          <article key={q.id} className="bg-white rounded-2xl border border-clinical-divider p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">{q.theme}</span>
              <span className="ml-auto"><ModuleChip id={q.module} /></span>
            </div>
            <p className="text-lg font-semibold text-slate-900 leading-snug">{q.question}</p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500">Revisit:</span>
              {q.relatedSteps.map((code) => {
                const idx = indexOf(code);
                const step = JOURNEY_STEPS[idx];
                return (
                  <button
                    key={code}
                    onClick={() => onPresentStep(idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700"
                  >
                    <Play className="w-3 h-3 text-sky-600" />
                    <span className="font-mono">{code}</span> {step.title}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 text-sm text-indigo-950">
        <strong>The scope promise.</strong> {SCOPE_PROMISE}
      </section>

      {/* The journey's questions, module by module */}
      <section className="bg-white rounded-2xl border border-clinical-divider p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <MessageCircleQuestion className="w-4 h-4 text-indigo-600" /> The journey’s questions, module by module
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MODULES.map((m) => (
            <article key={m.id} className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex flex-wrap items-baseline gap-2">
                <ModuleChip id={m.id} />
                <span className="text-sm font-bold text-slate-900">{m.title}</span>
                <span className="text-[11px] text-slate-500">Day {m.day} · {m.sheet}</span>
              </div>
              <p className="text-xs italic text-slate-600">{m.carries}</p>
              <ul className="space-y-2">
                {QUESTIONS_BY_MODULE[m.id].map((q) => (
                  <li key={q.stage + q.text} className="flex items-start gap-2">
                    <StepButton code={q.stage} />
                    <span className="text-sm text-slate-800 leading-snug">{q.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* The four decision rights */}
      <section className="bg-white rounded-2xl border border-clinical-divider p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Gavel className="w-4 h-4 text-violet-600" /> The four decisions this journey forces (M5, Sheet 4)
        </h3>
        <p className="text-xs text-slate-600">
          Name the institution that holds each one. Where the table cannot, write “unassigned”: that is often the most valuable output of the two days.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DECISION_RIGHTS.map((d) => (
            <article key={d.id} className="rounded-xl border border-violet-200 bg-violet-50/40 p-4 space-y-2">
              <div className="text-sm font-bold text-violet-900">{d.label}</div>
              <p className="text-sm text-slate-800 leading-snug">{d.question}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Forced by:</span>
                {Object.entries(STEP_POLICY)
                  .filter(([, p]) => p.decisionRights.includes(d.id))
                  .map(([code]) => (
                    <StepButton key={code} code={code} />
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* The gap list, assembled from every moment's strip */}
      <section className="bg-white rounded-2xl border border-clinical-divider p-6 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 flex-1">
            <ClipboardList className="w-4 h-4 text-rose-600" /> Our gap list
          </h3>
          <span className="text-[11px] text-slate-500">{answered} of {total} capabilities marked</span>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 min-h-[32px] rounded-lg border border-slate-300 hover:bg-slate-50">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 min-h-[32px] rounded-lg border border-slate-300 hover:bg-slate-50">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <p className="text-xs text-slate-600">
          Assembled from the gap strip on every moment of the walkthrough, in this browser. {GAP_STRIP.standingLine}
        </p>
        {gapRows.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Nothing marked partial or absent yet. Open a moment in the walkthrough and use its gap strip.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-3">Moment</th>
                  <th className="py-2 pr-3">Capability</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Urgency</th>
                  <th className="py-2">Pattern</th>
                </tr>
              </thead>
              <tbody>
                {gapRows.map(({ stage, c, a }) => (
                  <tr key={c.id} className="border-b border-slate-100 align-top">
                    <td className="py-2 pr-3"><StepButton code={stage} /></td>
                    <td className="py-2 pr-3 text-slate-800">{c.label}</td>
                    <td className="py-2 pr-3">{label(GAP_STRIP.status, a.status)}</td>
                    <td className="py-2 pr-3">{label(GAP_STRIP.urgency, a.urgency)}</td>
                    <td className="py-2">{a.pattern ? PATTERN_BY_ID[a.pattern].label : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* The three substitution patterns */}
      <section className="bg-white rounded-2xl border border-clinical-divider p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-indigo-600" /> Three ways to start without everything in place
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PATTERNS.map((p) => (
            <article key={p.id} className="rounded-xl border border-slate-200 p-4 space-y-1.5">
              <div className="text-sm font-bold text-slate-900">{p.label}</div>
              <p className="text-sm text-slate-700 leading-snug">{p.what}</p>
              <p className="text-xs text-slate-500">e.g. {p.example}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(STEP_POLICY)
                  .filter(([, sp]) => sp.pattern.id === p.id)
                  .map(([code]) => (
                    <StepButton key={code} code={code} />
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-clinical-divider p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Landmark className="w-4 h-4 text-indigo-600" /> Policy takeaways, moment by moment
        </h3>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {JOURNEY_STEPS.map((s, i) => (
            <li key={s.stageCode}>
              <button onClick={() => onPresentStep(i)} className="w-full text-left flex items-start gap-2 rounded-lg p-2 hover:bg-slate-50">
                <span className="font-mono text-[11px] font-bold text-slate-500 mt-0.5 w-10 flex-shrink-0">{s.stageCode}</span>
                <span className="text-sm text-slate-800 leading-snug">{s.policyTakeaway}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          onClick={() => onPresentStep(0)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Back to the start of the walkthrough
        </button>
      </section>
    </div>
  );
};
