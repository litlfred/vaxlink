import React, { useState } from 'react';
import { PATIENT_DATA } from '../../data/storylineData';
import { 
  Scan, 
  AlertTriangle, 
  CheckCircle2, 
  WifiOff, 
  ArrowRight, 
  Calendar, 
  Building, 
  FilePlus2,
  Syringe,
  SendHorizontal
} from 'lucide-react';

interface S2Props {
  onNext: () => void;
  onOpenFhirInspector?: () => void;
}

export const S2_ChwScanCards: React.FC<S2Props> = ({ onNext }) => {
  const [synced, setSynced] = useState(false);

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSynced(true);
    setTimeout(() => {
      onNext();
    }, 600);
  };

  return (
    <form onSubmit={handleSyncSubmit} className="flex flex-col h-full bg-clinical-alabaster font-sans">
      {/* 1. Mobile Top Navigation Bar */}
      <div className="bg-white border-b border-clinical-divider px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-dpi-cobalt" />
            <h2 className="text-xs font-bold text-clinical-ink">
              Foreign Card Scan (2 of 2)
            </h2>
          </div>
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium">
            Offline Decode Only
          </span>
        </div>
      </div>

      {/* 2. Prominent Status Callout Banner */}
      <div className="p-3">
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 shadow-sm space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Unverified Foreign Record (read, not checked)</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Payload decoded offline from paper QR. Nothing is saved yet: the doses are saved as reported (primarySource: false) when Somsack is registered. Signature verification and schedule mapping happen at the health center.
          </p>
        </div>
      </div>

      {/* 3. Primary Content Area: Decoded Cards */}
      <div className="flex-1 px-3 pb-3 space-y-3 overflow-y-auto">
        
        {/* Scanned Card 1: BCG */}
        <div className="bg-white rounded-xl border border-clinical-divider p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Syringe className="w-3.5 h-3.5 text-slate-500" />
              <h4 className="font-bold text-xs text-clinical-ink">BCG Birth Dose</h4>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
              Card 1 / 2
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Date (T0)</span>
              <span className="font-medium text-slate-800">{PATIENT_DATA.infantDob}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Issuer</span>
              <span className="font-medium text-slate-800">Thailand (XXR)</span>
            </div>
          </div>

          <div className="text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-100 text-slate-700">
            PreQual Code: <span className="font-bold">vp-bcg-freeze-dried</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
            <span>No Local Lao Schedule Mapping — Stored as Issued</span>
          </div>
        </div>

        {/* Scanned Card 2: Hepatitis B */}
        <div className="bg-white rounded-xl border border-clinical-divider p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Syringe className="w-3.5 h-3.5 text-slate-500" />
              <h4 className="font-bold text-xs text-clinical-ink">Hepatitis B Birth Dose</h4>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
              Card 2 / 2
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Date (T0)</span>
              <span className="font-medium text-slate-800">{PATIENT_DATA.infantDob}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Issuer</span>
              <span className="font-medium text-slate-800">Thailand (XXR)</span>
            </div>
          </div>

          <div className="text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-100 text-slate-700">
            PreQual Code: <span className="font-bold">vp-hepb-peds-monovalent</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
            <span>Unmapped Foreign Product Code — Preserved Unchanged</span>
          </div>
        </div>

      </div>

      {/* 4. Bottom Sticky Action Bar */}
      <div className="bg-white border-t border-clinical-divider p-3 shadow-lg">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-dpi-cobalt hover:bg-dpi-cobalt-dark text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Continue: Register Somsack & Save the Doses</span>
        </button>
        <p className="text-[10px] text-center text-clinical-steel mt-1.5 font-mono">
          Decoded on the phone only; nothing is written until registration
        </p>
      </div>
    </form>
  );
};
