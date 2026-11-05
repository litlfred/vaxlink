import React from 'react';
import { Compass, Map, User, Presentation, Cpu, MessageCircleQuestion, Printer } from 'lucide-react';
import { ScreenId } from '../../types';
import { PersonaId } from '../../data/journeyData';
import { JourneyOverview } from './JourneyOverview';
import { JourneyMap } from './JourneyMap';
import { PersonaLens } from './PersonaLens';
import { Walkthrough } from './Walkthrough';
import { HowItWorks } from './HowItWorks';
import { DiscussionView } from './DiscussionView';
import { PrintSheets } from './PrintSheets';
import { BuildingBlockId, FhirInspectorTab } from '../../data/techData';
import { viewHref } from '../../routes';

export type JourneyView = 'overview' | 'map' | 'personas' | 'walkthrough' | 'how' | 'discuss' | 'sheets';

interface Props {
  view: JourneyView;
  onChangeView: (v: JourneyView) => void;
  stepIndex: number;
  onChangeStep: (i: number) => void;
  personaId: PersonaId;
  onChangePersona: (id: PersonaId) => void;
  onOpenScreen: (screenId: ScreenId) => void;
  showFacilitatorNotes: boolean;
  onInspectFhir: (tab: FhirInspectorTab) => void;
  selectedBlock: BuildingBlockId | null;
  onSelectBlock: (id: BuildingBlockId | null) => void;
}

const VIEWS: { id: JourneyView; label: string; hint: string; Icon: typeof Map }[] = [
  { id: 'overview', label: 'Overview', hint: 'The story & the cast', Icon: Compass },
  { id: 'walkthrough', label: 'Walkthrough', hint: 'Present one moment at a time', Icon: Presentation },
  { id: 'map', label: 'Journey map', hint: 'Everyone, every step', Icon: Map },
  { id: 'personas', label: 'Persona lens', hint: 'One person end-to-end', Icon: User },
  { id: 'how', label: 'How it works', hint: 'Standards & tools behind each moment', Icon: Cpu },
  { id: 'discuss', label: 'Discussion', hint: 'Policy questions to close', Icon: MessageCircleQuestion },
  { id: 'sheets', label: 'Table sheets', hint: 'Print the A3 canvas', Icon: Printer },
];

export const UserJourneys: React.FC<Props> = ({
  view,
  onChangeView,
  stepIndex,
  onChangeStep,
  personaId,
  onChangePersona,
  onOpenScreen,
  showFacilitatorNotes,
  onInspectFhir,
  selectedBlock,
  onSelectBlock: setSelectedBlock,
}) => {
  const openBlock = (id: BuildingBlockId) => {
    setSelectedBlock(id);
    onChangeView('how');
  };

  const present = (i: number) => {
    onChangeStep(i);
    onChangeView('walkthrough');
  };

  return (
    <div className="w-full bg-clinical-alabaster min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <nav className="flex flex-wrap gap-2" aria-label="User journey views">
          {VIEWS.map(({ id, label, hint, Icon }) => {
            const active = view === id;
            return (
              <a
                key={id}
                href={viewHref(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-left transition ${
                  active ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-sky-300' : 'text-sky-600'}`} />
                <span>
                  <span className="block text-sm font-semibold leading-tight">{label}</span>
                  <span className={`block text-[10px] ${active ? 'text-slate-300' : 'text-slate-400'}`}>{hint}</span>
                </span>
              </a>
            );
          })}
        </nav>

        {view === 'overview' && (
          <JourneyOverview
            onStartWalkthrough={present}
            onOpenPersona={(id) => {
              onChangePersona(id);
              onChangeView('personas');
            }}
            onOpenMap={() => onChangeView('map')}
          />
        )}
        {view === 'map' && (
          <JourneyMap
            selectedStep={stepIndex}
            onSelectStep={onChangeStep}
            onPresentStep={present}
            onOpenScreen={onOpenScreen}
            onOpenBlock={openBlock}
          />
        )}
        {view === 'personas' && (
          <PersonaLens personaId={personaId} onSelectPersona={onChangePersona} onPresentStep={present} />
        )}
        {view === 'walkthrough' && (
          <Walkthrough
            stepIndex={stepIndex}
            onChangeStep={onChangeStep}
            onOpenScreen={onOpenScreen}
            showFacilitatorNotes={showFacilitatorNotes}
            onOpenBlock={openBlock}
            onInspectFhir={onInspectFhir}
            onFinish={() => onChangeView('discuss')}
          />
        )}
        {view === 'how' && (
          <HowItWorks selectedBlock={selectedBlock} onSelectBlock={setSelectedBlock} onPresentStep={present} />
        )}
        {view === 'discuss' && <DiscussionView onPresentStep={present} />}
        {view === 'sheets' && <PrintSheets />}
      </div>
    </div>
  );
};
