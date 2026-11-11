import React, { useState } from 'react';
import { ArrowRight, Workflow, Play, Smartphone, AlertTriangle, Sparkles, Package, ArrowRightLeft, Cpu, WifiOff, Wifi } from 'lucide-react';
import { ARCH_LAYERS, BLOCK_BY_ID, BuildingBlockId, STEP_TECH } from '../../data/techData';
import { ScreenId } from '../../types';
import { CHAPTERS, JOURNEY_STEPS, PERSONAS, PersonaId, RECORD_TRUST_LADDER } from '../../data/journeyData';
import { EmotionBadge, PersonaAvatar, TrustMeter, countryChip } from './shared';
import { MomentIllustration } from './MomentIllustration';
import { stepHref } from '../../routes';
import { BPMN_FOR_STAGE, bpmnLinks, bpmnSvg } from '../../data/links';
import { ExtLink } from './shared';

interface Props {
  selectedStep: number;
  onSelectStep: (index: number) => void;
  onPresentStep: (index: number) => void;
  onOpenScreen: (screenId: ScreenId) => void;
  onOpenBlock: (id: BuildingBlockId) => void;
}

const LABEL_COL = 168;
const STEP_COL = 180;

const RowLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`sticky left-0 z-10 border-r p-2.5 flex items-start gap-2 ${className}`}>
    {children}
  </div>
);

export const JourneyMap: React.FC<Props> = ({ selectedStep, onSelectStep, onPresentStep, onOpenScreen, onOpenBlock }) => {
  const [showTech, setShowTech] = useState(true);
  const [focusPersona, setFocusPersona] = useState<PersonaId | null>(null);
  const [showFriction, setShowFriction] = useState(true);

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `${LABEL_COL}px repeat(${JOURNEY_STEPS.length}, minmax(${STEP_COL}px, 1fr))`,
    minWidth: LABEL_COL + STEP_COL * JOURNEY_STEPS.length,
  };

  const colClass = (i: number) =>
    `cursor-pointer transition-colors ${i === selectedStep ? 'bg-sky-50/80' : 'hover:bg-slate-50'}`;

  const step = JOURNEY_STEPS[selectedStep];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-clinical-ink">Journey map</h3>
          <p className="text-xs text-clinical-steel">
            Read across to follow one person. Read down to see everyone at one moment. Click a column to inspect it.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Focus on:</span>
          <button
            onClick={() => setFocusPersona(null)}
            className={`px-2.5 py-1 rounded-full border ${!focusPersona ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            Everyone
          </button>
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setFocusPersona(focusPersona === p.id ? null : p.id)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition ${
                focusPersona === p.id ? `${p.color.soft} ${p.color.border} ${p.color.text} font-semibold` : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${p.color.dot}`} />
              {p.name}
            </button>
          ))}
          <label className="flex items-center gap-1.5 ml-2 text-slate-600 cursor-pointer">
            <input type="checkbox" checked={showFriction} onChange={(e) => setShowFriction(e.target.checked)} />
            Pain points & enablers
          </label>
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input type="checkbox" checked={showTech} onChange={(e) => setShowTech(e.target.checked)} />
            Technical layer
          </label>
        </div>
      </div>

      {/* Swimlane grid */}
      <div className="bg-white rounded-2xl border border-clinical-divider shadow-sm overflow-x-auto">
        <div className="grid text-xs" style={gridStyle}>
          {/* Chapter header row */}
          <RowLabel className="bg-slate-900 text-slate-300 border-r-slate-700 font-mono text-[10px] uppercase">Chapter</RowLabel>
          {CHAPTERS.map((ch) => {
            const span = JOURNEY_STEPS.filter((s) => s.chapterId === ch.id).length;
            return (
              <div
                key={ch.id}
                style={{ gridColumn: `span ${span}` }}
                className="bg-slate-900 text-white px-3 py-2 border-l border-slate-700 flex items-center gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-white/15 text-[10px] font-bold flex items-center justify-center">{ch.number}</span>
                <MomentIllustration chapterId={ch.id} size="sm" />
                <span className="font-bold text-sm whitespace-nowrap">{ch.title}</span>
                {span > 1 && <span className="text-[10px] text-slate-400 whitespace-nowrap">{ch.when}</span>}
                <span className={`ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded ${countryChip(ch.country)}`}>{ch.country}</span>
              </div>
            );
          })}

          {/* Step header row */}
          <RowLabel className="bg-white border-r-slate-200 border-b border-b-slate-200 text-[10px] font-mono uppercase text-slate-400">Moment</RowLabel>
          {JOURNEY_STEPS.map((s, i) => (
            <div
              key={s.stageCode}
              onClick={() => onSelectStep(i)}
              className={`${colClass(i)} p-2.5 border-l border-b border-slate-200 ${i === selectedStep ? 'border-t-2 border-t-sky-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <a href={stepHref(s.stageCode)} onClick={(e) => e.stopPropagation()} className="font-mono text-[10px] font-bold text-sky-700 hover:underline" title="Link to this moment">
                  {s.stageCode}
                </a>
                <span className="text-[9px] text-slate-400">{s.when.split('·')[0]}</span>
              </div>
              <div className="font-bold text-[12px] text-slate-900 leading-snug">{s.title}</div>
              <div className="text-[10px] text-slate-500 mt-1">{s.where}</div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                <Smartphone className="w-3 h-3" />
                <span className="truncate">{s.touchpoint}</span>
              </div>
            </div>
          ))}

          {/* Persona rows */}
          {PERSONAS.map((p) => {
            const dim = focusPersona && focusPersona !== p.id;
            return (
              <React.Fragment key={p.id}>
                <RowLabel className={`bg-white border-r-slate-200 border-b border-b-slate-100 ${dim ? 'opacity-40' : ''}`}>
                  <PersonaAvatar persona={p} size="sm" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-[12px]">{p.name}</div>
                    <div className="text-[10px] text-slate-500 leading-tight">{p.role}</div>
                  </div>
                </RowLabel>
                {JOURNEY_STEPS.map((s, i) => {
                  const m = s.moments[p.id];
                  const isLead = s.lead === p.id;
                  return (
                    <div
                      key={s.stageCode}
                      onClick={() => onSelectStep(i)}
                      className={`${colClass(i)} p-2 border-l border-b border-slate-100 ${dim ? 'opacity-30' : ''}`}
                    >
                      {m ? (
                        <div className={`h-full rounded-lg border p-2 space-y-1.5 ${isLead ? `${p.color.soft} ${p.color.border}` : 'bg-white border-slate-200'}`}>
                          <div className="flex items-center justify-between gap-1">
                            <EmotionBadge emotion={m.emotion} />
                            {isLead && <span className={`text-[9px] font-bold uppercase ${p.color.text}`}>Lead</span>}
                          </div>
                          <p className="text-[11px] text-slate-800 leading-snug">{m.doing}</p>
                          <p className="text-[10px] italic text-slate-500 leading-snug">{m.feeling}</p>
                        </div>
                      ) : (
                        <div className="h-full min-h-[40px] flex items-center justify-center">
                          <span className="w-full border-t border-dashed border-slate-200" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* Record row */}
          <RowLabel className="bg-emerald-50 border-r-slate-200 border-b border-b-emerald-100">
            <Package className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-[12px]">Somsak’s record</div>
              <div className="text-[10px] text-slate-500 leading-tight">How far it can be trusted</div>
            </div>
          </RowLabel>
          {JOURNEY_STEPS.map((s, i) => (
            <div
              key={s.stageCode}
              onClick={() => onSelectStep(i)}
              className={`${colClass(i)} p-2.5 border-l border-b border-emerald-100 bg-emerald-50/30 space-y-1.5`}
            >
              <TrustMeter level={s.record.level} showLabels={false} />
              <div className="text-[11px] font-bold text-emerald-900">{RECORD_TRUST_LADDER[s.record.level].label}</div>
              <p className="text-[10px] text-slate-700 leading-snug">{s.record.description}</p>
              <p className="text-[10px] text-slate-400">Held in: {s.record.heldWhere}</p>
            </div>
          ))}

          {showFriction && (
            <>
              <RowLabel className="bg-rose-50 border-r-slate-200 border-b border-b-rose-100">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-[12px]">Pain point</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Without this system</div>
                </div>
              </RowLabel>
              {JOURNEY_STEPS.map((s, i) => (
                <div key={s.stageCode} onClick={() => onSelectStep(i)} className={`${colClass(i)} p-2.5 border-l border-b border-rose-100 bg-rose-50/30`}>
                  <p className="text-[11px] text-rose-900 leading-snug">{s.painPoint}</p>
                </div>
              ))}

              <RowLabel className="bg-sky-50 border-r-slate-200 border-b border-b-sky-100">
                <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-[12px]">What makes it work</div>
                  <div className="text-[10px] text-slate-500 leading-tight">The enabler, in plain words</div>
                </div>
              </RowLabel>
              {JOURNEY_STEPS.map((s, i) => (
                <div key={s.stageCode} onClick={() => onSelectStep(i)} className={`${colClass(i)} p-2.5 border-l border-b border-sky-100 bg-sky-50/30`}>
                  <p className="text-[11px] text-sky-950 leading-snug">{s.enabler}</p>
                </div>
              ))}
            </>
          )}

          {showTech && (
            <>
              <div className="sticky left-0 z-10 bg-slate-900 text-white border-r p-2.5 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-300" />
                <span className="font-bold text-[12px]">Under the hood</span>
              </div>
              <div style={{ gridColumn: `span ${JOURNEY_STEPS.length}` }} className="bg-slate-900 text-slate-400 text-[10px] px-3 flex items-center">
                The standards and tools that make each moment possible. Click a chip to see where else it is used.
              </div>

              {ARCH_LAYERS.map((layer) => (
                <React.Fragment key={layer.id}>
                  <RowLabel className={`${layer.className.soft} border-r-slate-200 border-b border-b-slate-100`}>
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${layer.className.dot}`} />
                    <div>
                      <div className={`font-bold text-[12px] ${layer.className.text}`}>{layer.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{layer.question}</div>
                    </div>
                  </RowLabel>
                  {JOURNEY_STEPS.map((s, i) => {
                    const blocks = (STEP_TECH[s.stageCode]?.blocks ?? []).filter((b) => BLOCK_BY_ID[b.id].layer === layer.id);
                    return (
                      <div key={s.stageCode} onClick={() => onSelectStep(i)} className={`${colClass(i)} p-2 border-l border-b border-slate-100 flex flex-wrap content-start gap-1`}>
                        {blocks.map((b) => (
                          <button
                            key={b.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenBlock(b.id);
                            }}
                            title={b.role}
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${layer.className.border} ${layer.className.soft} ${layer.className.text} hover:shadow-sm`}
                          >
                            {BLOCK_BY_ID[b.id].short}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}

              <RowLabel className="bg-white border-r-slate-200 border-b border-b-slate-100">
                <ArrowRightLeft className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-[12px]">Data on the move</div>
                  <div className="text-[10px] text-slate-500 leading-tight">From → to, and how</div>
                </div>
              </RowLabel>
              {JOURNEY_STEPS.map((s, i) => {
                const ex = STEP_TECH[s.stageCode]?.exchange;
                return (
                  <div key={s.stageCode} onClick={() => onSelectStep(i)} className={`${colClass(i)} p-2.5 border-l border-b border-slate-100 space-y-1`}>
                    {ex && (
                      <>
                        <div className="text-[11px] font-semibold text-slate-800 leading-snug">
                          {ex.from} → {ex.to}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-snug">{ex.carrier}</div>
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${ex.online ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {ex.online ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                          {ex.online ? 'Online' : 'Offline'}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Hand-off row */}
          <RowLabel className="bg-white border-r-slate-200">
            <ArrowRightLeft className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-[12px]">Hand-off</div>
              <div className="text-[10px] text-slate-500 leading-tight">What moves to the next step</div>
            </div>
          </RowLabel>
          {JOURNEY_STEPS.map((s, i) => (
            <div key={s.stageCode} onClick={() => onSelectStep(i)} className={`${colClass(i)} p-2.5 border-l border-slate-100 flex items-start gap-1.5`}>
              <ArrowRight className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-700 leading-snug">{s.handoff}</p>
            </div>
          ))}

          {/* Business process row: the IG's BPMN behind each step */}
          <RowLabel className="bg-white border-r-slate-200 border-t border-t-slate-100">
            <Workflow className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 text-[12px]">Business process</div>
              <div className="text-[10px] text-slate-500 leading-tight">The BPMN in the IG</div>
            </div>
          </RowLabel>
          {JOURNEY_STEPS.map((s, i) => {
            const b = BPMN_FOR_STAGE[s.stageCode];
            const l = b && bpmnLinks(b);
            return (
              <div key={s.stageCode} onClick={() => onSelectStep(i)} className={`${colClass(i)} p-2 border-l border-t border-slate-100`}>
                {b && l && (
                  <div className="rounded-lg border border-slate-200 bg-white p-1.5 space-y-1 shadow-sm">
                    <a href={l.ig} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title={`Open “${b.title}” in the IG`} className="block h-20 overflow-hidden rounded bg-slate-50 border border-slate-100">
                      <img src={bpmnSvg(b.file)} alt={`BPMN diagram: ${b.title}`} className="w-full h-full object-cover object-left-top" loading="lazy" />
                    </a>
                    <div className="text-[10px] font-semibold text-slate-800 leading-snug">{b.title}</div>
                    <div className="flex flex-wrap gap-x-2 text-[10px]" onClick={(e) => e.stopPropagation()}>
                      <ExtLink href={l.ig}>IG</ExtLink>
                      <ExtLink href={l.viewer}>Viewer</ExtLink>
                      <ExtLink href={l.source}>BPMN</ExtLink>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected step summary */}
      <div className="bg-white rounded-2xl border border-sky-200 shadow-sm p-5 flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-mono font-bold text-sky-700">{step.stageCode}</span>
            <span>{step.when}</span>
            <span>·</span>
            <span>{step.where}</span>
          </div>
          <div className="text-base font-bold text-clinical-ink">{step.title}</div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.headline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onPresentStep(selectedStep)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            <Play className="w-3.5 h-3.5" /> Present this moment
          </button>
          <button
            onClick={() => onOpenScreen(step.screenId)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <Smartphone className="w-3.5 h-3.5" /> Open screen {step.screenId}
          </button>
        </div>
      </div>
    </div>
  );
};
