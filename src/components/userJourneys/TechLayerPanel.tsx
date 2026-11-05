import React from 'react';
import { Cpu, ArrowRight, Wifi, WifiOff, FileJson, Lightbulb, Users, Workflow } from 'lucide-react';
import { ARCH_LAYERS, BLOCK_BY_ID, BuildingBlockId, FhirInspectorTab, STEP_TECH } from '../../data/techData';
import { JourneyStep, PERSONA_BY_ID } from '../../data/journeyData';
import { BPMN_FOR_STAGE, IG, bpmnLinks } from '../../data/links';
import { BpmnViewer } from './BpmnViewer';
import { ExtLink, PersonaText, countryChip } from './shared';

interface Props {
  step: JourneyStep;
  onOpenBlock: (id: BuildingBlockId) => void;
  onInspectFhir: (tab: FhirInspectorTab) => void;
}

/**
 * "Under the hood" for one journey moment: shows the experience layer on top,
 * then the tools, data standards and trust/exchange layers that make it work.
 */
export const TechLayerPanel: React.FC<Props> = ({ step, onOpenBlock, onInspectFhir }) => {
  const tech = STEP_TECH[step.stageCode];
  if (!tech) return null;
  const lead = PERSONA_BY_ID[step.lead];
  const bpmn = BPMN_FOR_STAGE[step.stageCode];

  return (
    <section className="bg-white rounded-2xl border-2 border-slate-900 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center gap-2">
        <Cpu className="w-4 h-4 text-sky-300" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Under the hood</h3>
        <span className="text-xs text-slate-400">What the standards and tools are doing at this moment</span>
      </div>

      <div className="p-5 space-y-4">
        {/* So what */}
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Technical so-what</div>
            <p className="text-sm md:text-base text-slate-900 leading-snug font-medium">{tech.soWhat}</p>
          </div>
        </div>

        {/* Layer stack */}
        <div className="space-y-2">
          {/* Experience layer, linking back to the story */}
          <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 items-stretch">
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2">
              <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Experience
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">What people see and do</div>
            </div>
            <div className="rounded-lg border border-rose-100 px-3 py-2 text-sm text-slate-800 flex items-center">
              <span><PersonaText text={`${lead.name}: ${step.moments[step.lead]?.doing ?? ''}`} /></span>
            </div>
          </div>

          {ARCH_LAYERS.map((layer) => {
            const blocks = tech.blocks.filter((b) => BLOCK_BY_ID[b.id].layer === layer.id);
            return (
              <div key={layer.id} className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-2 items-stretch">
                <div className={`rounded-lg ${layer.className.soft} border ${layer.className.border} px-3 py-2`}>
                  <div className={`text-xs font-bold ${layer.className.text}`}>{layer.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{layer.question}</div>
                </div>
                <div className="flex flex-wrap gap-2 rounded-lg border border-slate-100 p-2">
                  {blocks.length === 0 && <span className="text-xs text-slate-400 italic self-center px-1">Not involved at this moment</span>}
                  {blocks.map((b) => {
                    const block = BLOCK_BY_ID[b.id];
                    return (
                      <button
                        key={b.id}
                        onClick={() => onOpenBlock(b.id)}
                        title={`${block.name}: open in "How it works"`}
                        className={`text-left rounded-lg border ${layer.className.border} bg-white hover:bg-slate-50 hover:shadow-sm px-3 py-2 transition max-w-xs`}
                      >
                        <div className={`text-xs font-bold ${layer.className.text} flex items-center gap-1.5`}>
                          <span className={`w-1.5 h-1.5 rounded-[1px] ${layer.className.dot}`} />
                          {block.short}
                        </div>
                        <div className="text-[11px] text-slate-600 leading-snug mt-0.5">{b.role}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Data exchange */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Data hand-off</div>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  tech.exchange.online ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {tech.exchange.online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {tech.exchange.online ? 'Online' : 'Works offline'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 font-semibold text-slate-800 text-center">{tech.exchange.from}</span>
              <div className="flex-1 flex flex-col items-center min-w-0">
                <span className="text-[10px] text-slate-500 text-center leading-tight">{tech.exchange.carrier}</span>
                <div className="w-full flex items-center">
                  <span className="flex-1 border-t-2 border-dashed border-slate-300" />
                  <ArrowRight className="w-4 h-4 text-slate-400 -ml-1" />
                </div>
              </div>
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 font-semibold text-slate-800 text-center">{tech.exchange.to}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-700 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100">
              {tech.exchange.payload}
            </div>
          </div>

          {/* FHIR changes */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">FHIR resources created or changed</div>
              <ExtLink href={IG.profiles} className="text-[10px]">Thai and Lao profiles in the IG</ExtLink>
            </div>
            {tech.fhir.length === 0 && (
              <p className="text-xs text-slate-500">None: this moment reads data but writes nothing.</p>
            )}
            <ul className="space-y-1.5">
              {tech.fhir.map((f) => (
                <li key={f.resource} className="text-xs border-b border-slate-100 last:border-0 pb-1.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <FileJson className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                    {f.profile ? (
                      <ExtLink href={IG.profile(f.profile.id)} className="font-mono font-semibold">{f.resource}</ExtLink>
                    ) : (
                      <span className="font-mono font-semibold text-slate-900">{f.resource}</span>
                    )}
                    {f.profile && (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${countryChip(f.profile.country)}`} title={`${f.profile.country} profile in the IG`}>
                        {f.profile.country === 'Thailand' ? 'TH' : 'LA'} profile
                      </span>
                    )}
                    <span className="text-slate-600 flex-1 min-w-[8rem]">{f.change}</span>
                    {f.inspect && (
                      <button onClick={() => onInspectFhir(f.inspect!)} className="text-[10px] font-semibold text-sky-700 hover:underline flex-shrink-0">
                        Inspect JSON
                      </button>
                    )}
                  </div>
                  {f.why && <p className="pl-5 text-[11px] text-slate-500 leading-snug mt-0.5">{f.why}</p>}
                  <div className="pl-5 flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10px] mt-0.5">
                    {f.examples?.map((e) => (
                      <ExtLink key={e.url} href={e.url}>{e.label}</ExtLink>
                    ))}
                    {f.spec && (
                      <ExtLink href={f.spec} className="!text-slate-500">base standard</ExtLink>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The business process this moment belongs to, as documented in the IG */}
        {bpmn && (
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Workflow className="w-4 h-4 text-slate-600" />
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Business process (BPMN)</div>
              <span className="text-xs text-slate-600">{bpmn.title}</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
              <ExtLink href={bpmnLinks(bpmn).ig}>Process in the IG</ExtLink>
              <ExtLink href={bpmnLinks(bpmn).viewer}>Process viewer (tasks and skills)</ExtLink>
              <ExtLink href={bpmnLinks(bpmn).scenario}>User scenario in the IG</ExtLink>
              <ExtLink href={bpmnLinks(bpmn).source}>BPMN source</ExtLink>
            </div>
            <BpmnViewer file={bpmn.file} title={bpmn.title} />
          </div>
        )}
      </div>
    </section>
  );
};
