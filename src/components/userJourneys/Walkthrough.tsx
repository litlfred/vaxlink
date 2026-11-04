import React, { useEffect, useState } from 'react';
import { PolicyPanel } from './PolicyPanel';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleQuestion,
  GitBranch,
  Package,
  Smartphone,
  Keyboard,
  Mic,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Cpu,
  Landmark,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { CHAPTERS, JOURNEY_STEPS, PERSONA_BY_ID, PersonaId, RECORD_TRUST_LADDER } from '../../data/journeyData';
import { EmotionBadge, PersonaAvatar, PersonaText, TrustMeter, countryChip } from './shared';
import { MomentIllustration } from './MomentIllustration';
import { MomentPicture } from './MomentPicture';
import { ConceptMapIllustration } from './ConceptMapIllustration';
import { stepHref } from '../../routes';
import { TechLayerPanel } from './TechLayerPanel';
import { BuildingBlockId, FhirInspectorTab } from '../../data/techData';

interface Props {
  stepIndex: number;
  onChangeStep: (index: number) => void;
  onOpenScreen: (screenId: ScreenId) => void;
  showFacilitatorNotes: boolean;
  onOpenBlock: (id: BuildingBlockId) => void;
  onInspectFhir: (tab: FhirInspectorTab) => void;
  /** Called when moving past the last moment (opens the closing discussion). */
  onFinish: () => void;
}

export const Walkthrough: React.FC<Props> = ({ stepIndex, onChangeStep, onOpenScreen, showFacilitatorNotes, onOpenBlock, onInspectFhir, onFinish }) => {
  const [revealWhatIf, setRevealWhatIf] = useState(false);
  const [showTech, setShowTech] = useState(true);
  const step = JOURNEY_STEPS[stepIndex];
  const chapter = CHAPTERS.find((c) => c.id === step.chapterId)!;
  const prevRecordLevel = stepIndex > 0 ? JOURNEY_STEPS[stepIndex - 1].record.level : -1;
  const recordMoved = step.record.level > prevRecordLevel;

  const isLast = stepIndex === JOURNEY_STEPS.length - 1;
  const go = (delta: number) => {
    if (delta > 0 && isLast) {
      onFinish();
      return;
    }
    const next = Math.max(0, Math.min(JOURNEY_STEPS.length - 1, stepIndex + delta));
    if (next !== stepIndex) onChangeStep(next);
  };

  useEffect(() => setRevealWhatIf(false), [stepIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1);
      if (e.key.toLowerCase() === 'w') setRevealWhatIf((v) => !v);
      if (e.key.toLowerCase() === 't') setShowTech((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const people = (Object.keys(step.moments) as PersonaId[]).sort((a, b) => (a === step.lead ? -1 : b === step.lead ? 1 : 0));

  return (
    <div className="space-y-5">
      {/* Progress through chapters */}
      <div className="bg-white rounded-2xl border border-clinical-divider p-3 shadow-sm flex items-center gap-3">
        <button
          onClick={() => go(-1)}
          disabled={stepIndex === 0}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30"
          aria-label="Previous moment"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: CHAPTERS.map((c) => `${JOURNEY_STEPS.filter((s) => s.chapterId === c.id).length}fr`).join(' ') }}>
          {CHAPTERS.map((c) => {
            const indices = JOURNEY_STEPS.map((s, i) => (s.chapterId === c.id ? i : -1)).filter((i) => i >= 0);
            const isCurrent = c.id === chapter.id;
            return (
              <div key={c.id} className="space-y-1">
                <div
                  className={`text-[10px] font-semibold truncate ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}
                  title={`${c.number}. ${c.title}`}
                >
                  {c.number}.<span className="hidden sm:inline"> {c.title}</span>
                </div>
                <div className="flex gap-1">
                  {indices.map((i) => (
                    <a
                      key={i}
                      href={stepHref(JOURNEY_STEPS[i].stageCode)}
                      onClick={() => onChangeStep(i)}
                      aria-label={`${JOURNEY_STEPS[i].stageCode}: ${JOURNEY_STEPS[i].title}`}
                      title={`${JOURNEY_STEPS[i].stageCode}: ${JOURNEY_STEPS[i].title}`}
                      className={`h-2 flex-1 rounded-full transition ${
                        i === stepIndex ? 'bg-sky-600' : i < stepIndex ? 'bg-sky-300' : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <span className="hidden md:flex items-center gap-1 text-[10px] text-slate-400 font-mono">
          <Keyboard className="w-3.5 h-3.5" /> ← → · W · T
        </span>
        <button
          onClick={() => go(1)}
          className="p-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center gap-1"
          aria-label={isLast ? 'Go to discussion' : 'Next moment'}
          title={isLast ? 'Go to discussion' : 'Next moment'}
        >
          {isLast && <span className="text-xs font-semibold pl-1">Discuss</span>}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Story */}
        <div className="lg:col-span-7 space-y-4">
          <section className="bg-white rounded-2xl border border-clinical-divider p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">
                Chapter {chapter.number} · {chapter.title}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${countryChip(chapter.country)}`}>{chapter.country}</span>
              <span className="ml-auto font-mono text-slate-400">
                {step.stageCode} · {stepIndex + 1}/{JOURNEY_STEPS.length}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <h2 className="flex-1 text-2xl md:text-3xl font-bold text-clinical-ink leading-tight">
                <a href={stepHref(step.stageCode)} className="hover:underline decoration-slate-300" title="Link to this moment">
                  {step.title}
                </a>
              </h2>
              <div className="sm:w-64 flex-shrink-0 space-y-1.5">
                <MomentPicture chapterId={step.chapterId} />
                <MomentIllustration chapterId={step.chapterId} size="sm" />
              </div>
            </div>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              <PersonaText text={step.headline} />
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>🕒 {step.when}</span>
              <span>📍 {step.where}</span>
              <span className="inline-flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> {step.touchpoint}
              </span>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Who’s in this moment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {people.map((pid) => {
                const p = PERSONA_BY_ID[pid];
                const m = step.moments[pid]!;
                return (
                  <div key={pid} className={`rounded-xl border ${p.color.border} ${p.color.soft} p-4 space-y-2`}>
                    <div className="flex items-center gap-2">
                      <PersonaAvatar persona={p} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900">{p.name}</div>
                        <div className={`text-[11px] ${p.color.text}`}>{p.role}</div>
                      </div>
                      <EmotionBadge emotion={m.emotion} />
                    </div>
                    <p className="text-sm text-slate-800 leading-snug"><PersonaText text={m.doing} /></p>
                    <p className="text-sm italic text-slate-600 leading-snug">{m.feeling}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {step.stageCode === 'J3b' && <ConceptMapIllustration />}

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider mb-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Without this
              </div>
              <p className="text-slate-800 leading-snug"><PersonaText text={step.painPoint} /></p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> What makes it work
              </div>
              <p className="text-slate-800 leading-snug"><PersonaText text={step.enabler} /></p>
            </div>
          </section>
        </div>

        {/* Facilitation panel */}
        <div className="lg:col-span-5 space-y-4">
          <section className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4" /> Somsack’s record
              </h3>
              {recordMoved && stepIndex > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">▲ Moved up</span>
              )}
            </div>
            <TrustMeter level={step.record.level} />
            <div className="text-lg font-bold text-slate-900">{RECORD_TRUST_LADDER[step.record.level].label}</div>
            <p className="text-sm text-slate-700"><PersonaText text={step.record.description} /></p>
            <p className="text-xs text-slate-500">Held in: {step.record.heldWhere}</p>
            <div className="flex items-start gap-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Hand-off:</strong> <PersonaText text={step.handoff} />
              </span>
            </div>
          </section>

          <section className="bg-indigo-950 text-white rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircleQuestion className="w-4 h-4" /> Ask the room
            </h3>
            <p className="text-lg font-semibold leading-snug">{step.askTheRoom}</p>
          </section>

          <section className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" /> What if…
            </h3>
            <p className="text-sm font-semibold text-slate-900">{step.whatIf.scenario}</p>
            {revealWhatIf ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-700 leading-snug">{step.whatIf.outcome}</p>
                {step.whatIf.tryOnScreen && (
                  <button
                    onClick={() => onOpenScreen(step.screenId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:underline"
                  >
                    {step.whatIf.tryOnScreen} <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => setRevealWhatIf(true)}
                className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 hover:bg-amber-100"
              >
                Let the room guess, then reveal
              </button>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4" /> Policy takeaway
            </h3>
            <p className="text-sm text-slate-800 leading-snug">{step.policyTakeaway}</p>
          </section>

          <PolicyPanel stage={step.stageCode} />

          {showFacilitatorNotes && (
            <section className="bg-slate-900 text-slate-200 rounded-2xl p-4 text-xs space-y-1">
              <div className="font-mono text-[10px] text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> Facilitator cue
              </div>
              <p className="leading-relaxed">{step.facilitatorCue}</p>
            </section>
          )}

          <button
            onClick={() => onOpenScreen(step.screenId)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
          >
            <Smartphone className="w-4 h-4" /> See what {PERSONA_BY_ID[step.lead].name} sees (screen {step.screenId})
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex-1 border-t border-slate-200" />
        <button
          onClick={() => setShowTech((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition ${
            showTech ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          {showTech ? 'Hide what’s under the hood' : 'Show what’s under the hood'}
        </button>
        <span className="flex-1 border-t border-slate-200" />
      </div>

      {showTech && <TechLayerPanel step={step} onOpenBlock={onOpenBlock} onInspectFhir={onInspectFhir} />}
    </div>
  );
};
