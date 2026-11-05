import React, { useEffect, useState } from 'react';
import { ActiveTab, ScreenId, DeviceType } from './types';
import { JOURNEY_STAGES } from './data/storylineData';
import { Header } from './components/common/Header';
import { DeviceFrame } from './components/common/DeviceFrame';
import { FhirInspectorDrawer } from './components/common/FhirInspectorDrawer';

// Screens
import { S1_BirthDosePreview } from './components/screens/S1_BirthDosePreview';
import { S2_ChwScanCards } from './components/screens/S2_ChwScanCards';
import { S3_ChwRegisterRefer } from './components/screens/S3_ChwRegisterRefer';
import { S4_ClinicVerification } from './components/screens/S4_ClinicVerification';
import { S5_TerminologyAdjudication } from './components/screens/S5_TerminologyAdjudication';
import { S6_FamilyWallet } from './components/screens/S6_FamilyWallet';
import { S7_VhlQrDisplay } from './components/screens/S7_VhlQrDisplay';
import { S8_ForeignClinicViewer } from './components/screens/S8_ForeignClinicViewer';

import { UserJourneys, JourneyView } from './components/userJourneys/UserJourneys';
import { JOURNEY_STEPS, PERSONA_BY_ID, PersonaId } from './data/journeyData';
import { BLOCK_BY_ID, BuildingBlockId, FhirInspectorTab } from './data/techData';
import { parseHash, screenHref, viewHref } from './routes';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('journeys');
  const [journeyView, setJourneyView] = useState<JourneyView>('overview');
  const [journeyStepIndex, setJourneyStepIndex] = useState<number>(0);
  const [journeyPersona, setJourneyPersona] = useState<PersonaId>('khamla');
  const [fhirFocusTab, setFhirFocusTab] = useState<FhirInspectorTab | null>(null);

  const inspectFhir = (tab: FhirInspectorTab) => {
    // Reset first so clicking the same resource twice still re-focuses it.
    setFhirFocusTab(null);
    setTimeout(() => setFhirFocusTab(tab), 0);
    setIsFhirDrawerOpen(true);
  };
  const [currentScreenId, setCurrentScreenId] = useState<ScreenId>('S1');
  const [isFramed, setIsFramed] = useState<boolean>(true);
  const [isFhirDrawerOpen, setIsFhirDrawerOpen] = useState<boolean>(false);
  const [isPresenterMode, setIsPresenterMode] = useState<boolean>(true);

  const [selectedBlock, setSelectedBlock] = useState<BuildingBlockId | null>('gdhcn');

  // Every view has its own address (#/walkthrough/J3b, #/demo/S4, …) so it can be linked and bookmarked.
  useEffect(() => {
    const apply = () => {
      const r = parseHash(window.location.hash);
      if (!r) return;
      if (r.tab === 'screens') {
        setCurrentScreenId(r.screen);
        setActiveTab('screens');
        return;
      }
      setActiveTab('journeys');
      setJourneyView(r.view);
      if (!r.arg) return;
      if (r.view === 'walkthrough' || r.view === 'map') {
        const i = JOURNEY_STEPS.findIndex((s) => s.stageCode === r.arg);
        if (i >= 0) setJourneyStepIndex(i);
      } else if (r.view === 'personas' && r.arg in PERSONA_BY_ID) {
        setJourneyPersona(r.arg as PersonaId);
      } else if (r.view === 'how' && r.arg in BLOCK_BY_ID) {
        setSelectedBlock(r.arg as BuildingBlockId);
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  useEffect(() => {
    const arg =
      journeyView === 'walkthrough'
        ? JOURNEY_STEPS[journeyStepIndex]?.stageCode
        : journeyView === 'personas'
        ? journeyPersona
        : journeyView === 'how'
        ? selectedBlock ?? undefined
        : undefined;
    const hash = activeTab === 'screens' ? screenHref(currentScreenId) : viewHref(journeyView, arg);
    if (window.location.hash === hash) return;
    if (window.location.hash) window.history.pushState(null, '', hash);
    else window.history.replaceState(null, '', hash);
  }, [activeTab, journeyView, journeyStepIndex, journeyPersona, selectedBlock, currentScreenId]);

  const currentStageMetadata = JOURNEY_STAGES.find((s) => s.screenId === currentScreenId) || JOURNEY_STAGES[0];

  const openScreenFromJourney = (screenId: ScreenId) => {
    setCurrentScreenId(screenId);
    setActiveTab('screens');
  };

  const handleResetSimulation = () => {
    setCurrentScreenId('S1');
    setJourneyStepIndex(0);
    setJourneyView('overview');
    setIsFhirDrawerOpen(false);
  };

  const renderActiveScreenContent = () => {
    switch (currentScreenId) {
      case 'S1':
        return (
          <S1_BirthDosePreview
            onNext={() => setCurrentScreenId('S2')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      case 'S2':
        return (
          <S2_ChwScanCards
            onNext={() => setCurrentScreenId('S3')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      case 'S3':
        return (
          <S3_ChwRegisterRefer
            onNext={() => setCurrentScreenId('S4')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      case 'S4':
        return (
          <S4_ClinicVerification
            onNext={() => setCurrentScreenId('S5')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      case 'S5':
        return (
          <S5_TerminologyAdjudication
            onNext={() => setCurrentScreenId('S6')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      case 'S6':
        return (
          <S6_FamilyWallet
            onNext={() => setCurrentScreenId('S7')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      case 'S7':
        return (
          <S7_VhlQrDisplay
            onNext={() => setCurrentScreenId('S8')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      case 'S8':
        return (
          <S8_ForeignClinicViewer
            onRestart={() => setCurrentScreenId('S1')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
      default:
        return (
          <S1_BirthDosePreview
            onNext={() => setCurrentScreenId('S2')}
            onOpenFhirInspector={() => setIsFhirDrawerOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-clinical-alabaster flex flex-col text-clinical-ink">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScreenId={currentScreenId}
        setCurrentScreenId={setCurrentScreenId}
        onResetSimulation={handleResetSimulation}
        isPresenterMode={isPresenterMode}
        setIsPresenterMode={setIsPresenterMode}
      />

      {/* Presenter Guidelines / Objective Ribbon */}
      {isPresenterMode && (
        <div className="bg-sky-950 text-sky-200 px-6 py-2 border-b border-sky-900 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-sky-800 text-white px-2 py-0.5 rounded font-bold text-[10px]">
              PRESENTER NOTE
            </span>
            <span>
              {activeTab === 'journeys' &&
                (journeyView === 'walkthrough'
                  ? `Moment ${JOURNEY_STEPS[journeyStepIndex].stageCode} — ${JOURNEY_STEPS[journeyStepIndex].facilitatorCue}`
                  : journeyView === 'how'
                  ? 'Use this when the room asks "how?": start from a big idea, then show which moments in the journey depend on it.'
                  : journeyView === 'discuss'
                  ? 'Close the session: take one question per table, and use the moment links to revisit the story.'
                  : 'Lead with people, not screens: introduce the cast, walk the four moments, then drop into a screen only when the room asks "what does that look like?"')}
              {activeTab === 'screens' && `Stage ${currentStageMetadata.stageCode} (${currentStageMetadata.title}) — ${currentStageMetadata.learningObjective}`}
            </span>
          </div>
          <button
            onClick={() => setIsPresenterMode(false)}
            className="text-[11px] text-sky-400 hover:text-white underline font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Body Viewport */}
      <main className="flex-1 flex flex-col">
        {/* Tab 0: User Journeys (default, facilitator-first) */}
        {activeTab === 'journeys' && (
          <UserJourneys
            view={journeyView}
            onChangeView={setJourneyView}
            stepIndex={journeyStepIndex}
            onChangeStep={setJourneyStepIndex}
            personaId={journeyPersona}
            onChangePersona={setJourneyPersona}
            onOpenScreen={openScreenFromJourney}
            showFacilitatorNotes={isPresenterMode}
            onInspectFhir={inspectFhir}
            selectedBlock={selectedBlock}
            onSelectBlock={setSelectedBlock}
          />
        )}

        {/* Device Demo: interactive screens S1–S8 */}
        {activeTab === 'screens' && (
          <div className="px-4 md:px-8 pt-3 -mb-2 flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                const idx = JOURNEY_STEPS.findIndex((s) => s.screenId === currentScreenId);
                if (idx >= 0) setJourneyStepIndex(idx);
                setJourneyView('walkthrough');
                setActiveTab('journeys');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 font-semibold hover:bg-rose-100"
            >
              ← Back to the user journey
            </button>
            <span className="text-clinical-steel">
              You are looking at what {currentStageMetadata.actor} sees at this moment.
            </span>
          </div>
        )}
        {activeTab === 'screens' && (
          <DeviceFrame
            deviceType={currentStageMetadata.deviceType}
            title={currentStageMetadata.title}
            appConfig={currentStageMetadata.appConfig}
            isFramed={isFramed}
            onToggleFrame={() => setIsFramed(!isFramed)}
          >
            {renderActiveScreenContent()}
          </DeviceFrame>
        )}

      </main>

      {/* Persistent Collapsible Developer Payload Drawer */}
      <FhirInspectorDrawer
        currentStageCode={activeTab === 'screens' ? currentStageMetadata.stageCode : 'main'}
        isOpen={isFhirDrawerOpen}
        onToggle={() => setIsFhirDrawerOpen(!isFhirDrawerOpen)}
        focusTab={fhirFocusTab}
      />
    </div>
  );
}

export default App;
