import React from 'react';
import { ArrowRight, Play, Users, Route, Package, BookOpen } from 'lucide-react';
import {
  CHAPTERS,
  JOURNEY_STEPS,
  PERSONAS,
  PersonaId,
  RECORD_TRUST_LADDER,
} from '../../data/journeyData';
import { ExtLink, PersonaAvatar, PersonaText, countryChip, trustColor } from './shared';
import { MomentIllustration } from './MomentIllustration';
import { MomentPicture } from './MomentPicture';
import { IG } from '../../data/links';

interface Props {
  onStartWalkthrough: (stepIndex: number) => void;
  onOpenPersona: (id: PersonaId) => void;
  onOpenMap: () => void;
}

export const JourneyOverview: React.FC<Props> = ({ onStartWalkthrough, onOpenPersona, onOpenMap }) => {
  const firstStepOf = (chapterId: string) => JOURNEY_STEPS.findIndex((s) => s.chapterId === chapterId);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white p-6 md:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-sky-300">
            <Route className="w-3.5 h-3.5" /> The story in one sentence
          </span>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Somsak is born in Thailand, grows up in Lao PDR, and one year later a Thai doctor can see
            every vaccine he has ever had — without a single record being copied across the border.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            A baby and five people around him, four moments, twelve months. Follow the people first; the technology is what makes each
            hand-off possible.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => onStartWalkthrough(0)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition"
            >
              <Play className="w-4 h-4" /> Start the walkthrough
            </button>
            <button
              onClick={onOpenMap}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
            >
              See the whole journey map <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Four moments that matter</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {CHAPTERS.map((ch, i) => {
            const steps = JOURNEY_STEPS.filter((s) => s.chapterId === ch.id);
            const people = Array.from(new Set(steps.flatMap((s) => Object.keys(s.moments)))) as PersonaId[];
            return (
              <button
                key={ch.id}
                onClick={() => onStartWalkthrough(firstStepOf(ch.id))}
                className="relative text-left bg-white rounded-2xl border border-clinical-divider p-5 shadow-sm hover:border-sky-400 hover:shadow-md transition group"
              >
                {i < CHAPTERS.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 z-10" />
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                    {ch.number}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${countryChip(ch.country)}`}>
                    {ch.country}
                  </span>
                </div>
                <div className="text-lg font-bold text-clinical-ink group-hover:text-sky-700">{ch.title}</div>
                <div className="text-[11px] text-slate-500 mb-2">
                  {ch.when} · {ch.where}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{ch.summary}</p>
                <div className="mt-3 space-y-2">
                  <MomentPicture chapterId={ch.id} />
                  <MomentIllustration chapterId={ch.id} />
                </div>
                <div className="flex -space-x-1.5 mt-4">
                  {people.map((pid) => {
                    const p = PERSONAS.find((x) => x.id === pid)!;
                    return <PersonaAvatar key={pid} persona={p} size="sm" />;
                  })}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* The IG behind the demo */}
      <section className="bg-white rounded-2xl border border-clinical-divider p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-3">
        <BookOpen className="w-6 h-6 text-sky-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-slate-900">This walkthrough is the demo of a FHIR implementation guide</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The same journey is documented as a WHO SMART Guidelines DAK and FHIR IG: personas, business processes (BPMN),
            requirements, and every payload shown here as a published FHIR example.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
          <ExtLink href={IG.site}>The IG</ExtLink>
          <ExtLink href={IG.journeys}>Journeys</ExtLink>
          <ExtLink href={IG.processes}>Business processes</ExtLink>
          <ExtLink href={IG.examples}>FHIR examples</ExtLink>
          <ExtLink href={IG.repo}>Source</ExtLink>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cast */}
        <section className="lg:col-span-3 bg-white rounded-2xl border border-clinical-divider p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-600" /> Meet the people
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PERSONAS.map((p) => {
              const count = JOURNEY_STEPS.filter((s) => s.moments[p.id]).length;
              return (
                <button
                  key={p.id}
                  onClick={() => onOpenPersona(p.id)}
                  className={`flex items-start gap-3 text-left p-3 rounded-xl border ${p.color.border} ${p.color.soft} hover:shadow-sm transition`}
                >
                  <PersonaAvatar persona={p} />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900">{p.name}</div>
                    <div className={`text-[11px] font-medium ${p.color.text}`}>
                      {p.role} · {p.country}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">{p.goal}</p>
                    <div className="text-[10px] text-slate-400 mt-1">Appears in {count} of {JOURNEY_STEPS.length} steps</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Record ladder */}
        <section className="lg:col-span-2 bg-white rounded-2xl border border-clinical-divider p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" /> Follow the record
          </h3>
          <p className="text-[11px] text-slate-500">
            How far can the next clinician rely on Somsak’s vaccine history? Each hand-off moves it one rung up.
          </p>
          <ol className="space-y-2">
            {RECORD_TRUST_LADDER.map((rung, level) => {
              const reachedAt = JOURNEY_STEPS.findIndex((s) => s.record.level === level);
              const step = JOURNEY_STEPS[reachedAt];
              return (
                <li key={rung.label} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full ${trustColor(level)} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                    {level + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900">{rung.label}</div>
                    <div className="text-[10px] text-slate-500">{rung.hint}</div>
                  </div>
                  {step && (
                    <button
                      onClick={() => onStartWalkthrough(reachedAt)}
                      className="text-[10px] font-mono text-sky-700 hover:underline flex-shrink-0"
                    >
                      {step.stageCode}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
};
