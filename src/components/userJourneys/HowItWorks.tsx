import React, { useState } from 'react';
import { Play, Building, Lightbulb, Info, Workflow } from 'lucide-react';
import { CHAPTERS, JOURNEY_STEPS } from '../../data/journeyData';
import { ARCH_LAYERS, BLOCK_BY_ID, BLOCK_LINKS, BUILDING_BLOCKS, BuildingBlockId, STEP_TECH } from '../../data/techData';
import { ARCHIMATE, BPMN_PROCESSES, IG, bpmnLinks, bpmnSvg } from '../../data/links';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ArchiMateViews } from './ArchiMateViews';
import { BpmnFullScreen, FullScreenButton } from './BpmnViewer';
import { ExtLink } from './shared';
import { stepHref } from '../../routes';

interface Props {
  selectedBlock: BuildingBlockId | null;
  onSelectBlock: (id: BuildingBlockId | null) => void;
  onPresentStep: (index: number) => void;
}

const LABEL_COL = 180;
const STEP_COL = 84;

/** The three ideas that make the cross-border journey work, in plain words. */
const BIG_IDEAS = [
  {
    title: 'Speak the same language',
    body: 'FHIR and WHO SMART Guidelines mean a dose recorded in Thailand has the same structure and codes in Lao PDR.',
    blocks: ['fhir-r4', 'smart-imm', 'conceptmap', 'ips'] as BuildingBlockId[],
  },
  {
    title: 'Trust without phoning home',
    body: 'Countries sign records and publish their keys on WHO GDHCN, so anyone can verify a certificate, even offline.',
    blocks: ['dvc', 'gdhcn', 'provenance'] as BuildingBlockId[],
  },
  {
    title: 'Share without copying',
    body: 'Data stays in its home country. The family hands out a time-limited key, and every access is logged at home.',
    blocks: ['vhl', 'pcf', 'ohs-info-gateway', 'audit'] as BuildingBlockId[],
  },
  {
    title: 'Open tools, offline first',
    body: 'Open Health Stack gives every app offline FHIR storage and configurable forms, one secure front door to the national server, and analytics on top.',
    blocks: ['ohs-fhir-sdk', 'ohs-sdc', 'ohs-info-gateway', 'ohs-data-pipes'] as BuildingBlockId[],
  },
];

export const HowItWorks: React.FC<Props> = ({ selectedBlock, onSelectBlock, onPresentStep }) => {
  const block = selectedBlock ? BLOCK_BY_ID[selectedBlock] : null;
  const [fullBpmn, setFullBpmn] = useState<{ file: string; title: string } | null>(null);
  const layerOf = (id: BuildingBlockId) => ARCH_LAYERS.find((l) => l.id === BLOCK_BY_ID[id].layer)!;

  const usage = (id: BuildingBlockId) =>
    JOURNEY_STEPS.map((s, i) => ({ s, i, use: STEP_TECH[s.stageCode]?.blocks.find((b) => b.id === id) })).filter((u) => u.use);

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `${LABEL_COL}px repeat(${JOURNEY_STEPS.length}, minmax(${STEP_COL}px, 1fr))`,
    minWidth: LABEL_COL + STEP_COL * JOURNEY_STEPS.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-clinical-ink">How it works: from journey to architecture</h3>
        <p className="text-xs text-clinical-steel max-w-3xl">
          Every moment in the journey depends on a few standards and open tools. Pick a big idea or a building block to
          see which moments it makes possible, or click a moment to present it with its technical layer. Everything here
          is specified in the <ExtLink href={IG.site}>SMART Trust demonstrator FHIR IG</ExtLink> (
          <ExtLink href={IG.repo}>source</ExtLink>).
        </p>
      </div>

      <ArchitectureDiagram />

      <ArchiMateViews />

      {/* Big ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {BIG_IDEAS.map((idea) => {
          const active = selectedBlock && idea.blocks.includes(selectedBlock);
          return (
            <div
              key={idea.title}
              className={`rounded-2xl border p-4 bg-white shadow-sm space-y-2 ${active ? 'border-sky-400 ring-2 ring-sky-100' : 'border-clinical-divider'}`}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Lightbulb className="w-4 h-4 text-amber-500" /> {idea.title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{idea.body}</p>
              <div className="flex flex-wrap gap-1">
                {idea.blocks.map((id) => {
                  const l = layerOf(id);
                  return (
                    <button
                      key={id}
                      onClick={() => onSelectBlock(id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${l.className.border} ${
                        selectedBlock === id ? `${l.className.soft} ${l.className.text}` : 'bg-white text-slate-600'
                      }`}
                    >
                      {BLOCK_BY_ID[id].short}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Traceability matrix */}
        <section className="xl:col-span-8 bg-white rounded-2xl border border-clinical-divider shadow-sm overflow-x-auto">
          <div className="grid text-xs" style={gridStyle}>
            {/* Chapter row */}
            <div className="sticky left-0 z-10 bg-slate-900 text-slate-300 font-mono text-[10px] uppercase p-2.5">Building block ↓ / Moment →</div>
            {CHAPTERS.map((ch) => {
              const span = JOURNEY_STEPS.filter((s) => s.chapterId === ch.id).length;
              return (
                <div key={ch.id} style={{ gridColumn: `span ${span}` }} className="bg-slate-900 text-white text-[11px] font-bold px-2 py-2.5 border-l border-slate-700 truncate">
                  {ch.number}. {ch.title}
                </div>
              );
            })}

            {/* Step row */}
            <div className="sticky left-0 z-10 bg-rose-50 border-b border-r border-rose-100 p-2.5">
              <div className="font-bold text-rose-800">Experience</div>
              <div className="text-[10px] text-slate-500">Click a moment to present it</div>
            </div>
            {JOURNEY_STEPS.map((s, i) => (
              <button
                key={s.stageCode}
                onClick={() => onPresentStep(i)}
                title={s.title}
                className="text-left p-2 border-l border-b border-rose-100 bg-rose-50/40 hover:bg-rose-100/60"
              >
                <div className="font-mono text-[10px] font-bold text-slate-700">{s.stageCode}</div>
                <div className="text-[10px] text-slate-600 leading-tight line-clamp-3">{s.title}</div>
              </button>
            ))}

            {/* Layers + blocks */}
            {ARCH_LAYERS.map((layer) => (
              <React.Fragment key={layer.id}>
                <div className={`sticky left-0 z-10 ${layer.className.soft} border-b border-r ${layer.className.border} px-2.5 py-1.5`}>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${layer.className.text}`}>{layer.label}</span>
                </div>
                <div style={{ gridColumn: `span ${JOURNEY_STEPS.length}` }} className={`${layer.className.soft} border-b ${layer.className.border}`} />
                {BUILDING_BLOCKS.filter((b) => b.layer === layer.id).map((b) => {
                  const isSel = selectedBlock === b.id;
                  const dim = selectedBlock && !isSel;
                  return (
                    <React.Fragment key={b.id}>
                      <button
                        onClick={() => onSelectBlock(isSel ? null : b.id)}
                        className={`sticky left-0 z-10 text-left border-b border-r border-slate-100 px-2.5 py-1.5 flex items-center gap-2 ${
                          isSel ? layer.className.soft : 'bg-white hover:bg-slate-50'
                        } ${dim ? 'opacity-50' : ''}`}
                      >
                        <span className={`w-2 h-2 rounded-[2px] flex-shrink-0 ${layer.className.dot}`} />
                        <span className={`text-[11px] leading-tight ${isSel ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{b.short}</span>
                      </button>
                      {JOURNEY_STEPS.map((s, i) => {
                        const use = STEP_TECH[s.stageCode]?.blocks.find((x) => x.id === b.id);
                        return (
                          <div
                            key={s.stageCode}
                            className={`border-l border-b border-slate-100 flex items-center justify-center py-1.5 ${isSel ? layer.className.soft : ''} ${dim ? 'opacity-40' : ''}`}
                          >
                            {use && (
                              <button
                                onClick={() => onSelectBlock(b.id)}
                                onDoubleClick={() => onPresentStep(i)}
                                title={`${s.stageCode}: ${use.role}`}
                                className={`w-3.5 h-3.5 rounded-[3px] ${layer.className.dot} ring-2 ring-white shadow-sm hover:scale-125 transition`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Block detail */}
        <aside className="xl:col-span-4">
          {block ? (
            <div className="bg-white rounded-2xl border border-clinical-divider shadow-sm p-5 space-y-4 xl:sticky xl:top-40">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${layerOf(block.id).className.soft} ${layerOf(block.id).className.text}`}
                >
                  {layerOf(block.id).label}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{block.name}</h4>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3" /> {block.owner}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">What it is</div>
                <p className="text-sm text-slate-700 leading-relaxed">{block.what}</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">So what for the journey</div>
                <p className="text-sm text-slate-900 leading-relaxed">{block.soWhat}</p>
              </div>
              {BLOCK_LINKS[block.id]?.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Learn more</div>
                  <ul className="space-y-0.5 text-xs">
                    {BLOCK_LINKS[block.id].map((l) => (
                      <li key={l.url}>
                        <ExtLink href={l.url}>{l.label}</ExtLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Moments it makes possible</div>
                <ul className="space-y-1.5">
                  {usage(block.id).map(({ s, i, use }) => (
                    <li key={s.stageCode}>
                      <button onClick={() => onPresentStep(i)} className="w-full text-left rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 p-2.5 group">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-slate-500">{s.stageCode}</span>
                          <span className="font-semibold text-slate-900 flex-1">{s.title}</span>
                          <Play className="w-3 h-3 text-sky-600 opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">{use!.role}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 flex items-start gap-3">
              <Info className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <p>
                Select a building block (left of the matrix, or a chip in a big idea) to see what it is, why it matters, and
                which moments in the journey depend on it.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Every workflow, as BPMN in the IG */}
      <section className="bg-white rounded-2xl border border-clinical-divider shadow-sm p-4 md:p-5 space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-bold text-clinical-ink flex items-center gap-2">
            <Workflow className="w-4 h-4 text-slate-600" /> Business processes (BPMN)
          </h3>
          <span className="text-xs text-clinical-steel">
            Each workflow in the journey is documented as BPMN in the IG: <ExtLink href={IG.processes}>business processes</ExtLink>.
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {BPMN_PROCESSES.map((p) => (
            <figure key={p.file} className="rounded-xl border border-slate-200 p-3 space-y-2">
              <figcaption className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-900">{p.title}</span>
                <span className="flex gap-1 ml-auto">
                  {p.stages.map((st) => (
                    <a key={st} href={stepHref(st)} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-sky-100 text-slate-700">
                      {st}
                    </a>
                  ))}
                </span>
              </figcaption>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                <ExtLink href={bpmnLinks(p).ig}>In the IG</ExtLink>
                <ExtLink href={bpmnLinks(p).viewer}>Process viewer</ExtLink>
                <ExtLink href={bpmnLinks(p).scenario}>User scenario</ExtLink>
                <ExtLink href={bpmnLinks(p).source}>BPMN source</ExtLink>
                {ARCHIMATE.forBpmn(p.file) && <ExtLink href={ARCHIMATE.viewPage(ARCHIMATE.forBpmn(p.file)!)}>ArchiMate view</ExtLink>}
              </div>
              <button type="button" onClick={() => setFullBpmn(p)} title="Open this diagram full screen" className="block w-full overflow-hidden rounded-lg border border-slate-100 hover:border-sky-300">
                <img src={bpmnSvg(p.file)} alt={`BPMN diagram: ${p.title}`} className="w-full h-auto" loading="lazy" />
              </button>
              <FullScreenButton onClick={() => setFullBpmn(p)} />
            </figure>
          ))}
        </div>
      </section>
      {fullBpmn && <BpmnFullScreen file={fullBpmn.file} title={fullBpmn.title} onClose={() => setFullBpmn(null)} />}
    </div>
  );
};
