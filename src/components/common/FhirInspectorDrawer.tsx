import React, { useEffect, useState } from 'react';
import { MOCK_FHIR_RESOURCES, GDHCN_DEV_KEY } from '../../data/storylineData';
import { FhirInspectorTab } from '../../data/techData';
import { Code2, ChevronUp, ChevronDown, Copy, Check, ShieldCheck, Layers, FileJson, X } from 'lucide-react';

interface FhirInspectorDrawerProps {
  currentStageCode?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  overrideResources?: Record<string, any>;
  /** When set (e.g. from a journey moment), jump to this resource tab. */
  focusTab?: FhirInspectorTab | null;
}

export const FhirInspectorDrawer: React.FC<FhirInspectorDrawerProps> = ({
  currentStageCode = 'main',
  isOpen = false,
  onToggle,
  overrideResources,
  focusTab,
}) => {
  const [selectedTab, setSelectedTab] = useState<FhirInspectorTab>('immunization');
  useEffect(() => {
    if (focusTab) setSelectedTab(focusTab);
  }, [focusTab]);
  const [copied, setCopied] = useState<boolean>(false);

  const mergedResources = {
    ...MOCK_FHIR_RESOURCES,
    ...overrideResources,
  };

  const getPayload = () => {
    switch (selectedTab) {
      case 'patient':
        return mergedResources.patient;
      case 'immunization':
        return mergedResources.immunizationHepB;
      case 'group':
        return mergedResources.group;
      case 'serviceRequest':
        return mergedResources.serviceRequest;
      case 'provenance':
        return mergedResources.provenance;
      case 'auditEvent':
        return mergedResources.auditEvent;
      case 'cbor':
        return mergedResources.cborPayload;
      case 'conceptMap':
        return mergedResources.conceptMap;
      default:
        return mergedResources.immunizationHepB;
    }
  };

  const currentJsonString = JSON.stringify(getPayload(), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t border-clinical-divider bg-slate-900 text-slate-100 shadow-2xl transition-all duration-300">
      {/* Toggle Bar / Header */}
      <div
        onClick={onToggle}
        className="px-6 py-2.5 bg-slate-950 flex items-center justify-between cursor-pointer hover:bg-slate-900 border-b border-slate-800 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold">
            <Code2 className="w-4 h-4" />
            <span>FHIR R4 & WHO GDHCN PAYLOAD INSPECTOR</span>
          </div>
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            Active Stage: {currentStageCode}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DEV Key: {GDHCN_DEV_KEY.kid} (XXR)</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden sm:inline">
            {isOpen ? 'Click to collapse developer drawer' : 'Click to inspect raw FHIR / CBOR payload'}
          </span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Content Drawer */}
      {isOpen && (
        <div className="p-4 md:p-6 bg-slate-900 max-h-[420px] flex flex-col">
          {/* Tab Selector & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setSelectedTab('immunization')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'immunization'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Immunization (HepB)
              </button>
              <button
                onClick={() => setSelectedTab('patient')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'patient'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setSelectedTab('group')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'group'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Group (Household)
              </button>
              <button
                onClick={() => setSelectedTab('serviceRequest')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'serviceRequest'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ServiceRequest
              </button>
              <button
                onClick={() => setSelectedTab('provenance')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'provenance'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Provenance
              </button>
              <button
                onClick={() => setSelectedTab('conceptMap')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'conceptMap'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ConceptMap (3-Layer)
              </button>
              <button
                onClick={() => setSelectedTab('auditEvent')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'auditEvent'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                AuditEvent
              </button>
              <button
                onClick={() => setSelectedTab('cbor')}
                className={`px-2.5 py-1 rounded transition ${
                  selectedTab === 'cbor'
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                HCERT / COSE (Raw)
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          {/* JSON Payload viewer with scroll */}
          <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs leading-relaxed text-emerald-400">
            <pre className="whitespace-pre-wrap">{currentJsonString}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
