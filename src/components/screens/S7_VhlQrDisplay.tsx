import React, { useState } from 'react';
import { PATIENT_DATA } from '../../data/storylineData';
import { QrCodeView } from '../common/QrCodeView';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  ArrowRight, 
  RotateCcw,
  Check,
  KeyRound,
  Users
} from 'lucide-react';

interface S7Props {
  onNext: () => void;
  onOpenFhirInspector?: () => void;
}

export const S7_VhlQrDisplay: React.FC<S7Props> = ({ onNext }) => {
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [passcodeEnabled, setPasscodeEnabled] = useState<boolean>(true);
  const [activeTravellerIndex, setActiveTravellerIndex] = useState<number>(0);

  const travellers = [
    { name: "Somsak Sengmany", role: "Infant (12m)", record: "IPS Immunizations (6 Doses)" },
    { name: "Bounmy Sengmany", role: "Father (29y)", record: "IPS MedicationStatement" },
    { name: "Khamla Sengmany", role: "Mother (26y)", record: "IPS Maternal Summary" },
  ];

  const currentTraveller = travellers[activeTravellerIndex];

  // Simulated Verifiable Health Link URL
  const vhlManifestUrl = `https://portal.moh.gov.la/vhl/manifest/vhl-lao-somsak-2026?token=e4a899bc01&exp=1797292800#key=f91b7c3d2e5a8812`;

  const handleCycle = () => {
    setActiveTravellerIndex((prev) => (prev + 1) % travellers.length);
  };

  return (
    <div className="flex flex-col h-full bg-clinical-alabaster font-sans">
      {/* 1. Mobile Header */}
      <div className="bg-white border-b border-clinical-divider px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-clinical-ink tracking-tight truncate max-w-[200px]">
              Travel Credential — {currentTraveller.name}
            </h2>
            <div className="text-[10px] text-clinical-steel">
              Traveller {activeTravellerIndex + 1} of 3 &bull; {currentTraveller.role}
            </div>
          </div>
          <button
            onClick={handleCycle}
            className="flex items-center gap-1 text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition"
          >
            <Users className="w-3 h-3 text-dpi-cobalt" />
            <span>Cycle (1/3)</span>
          </button>
        </div>
      </div>

      {/* 2 & 3. Primary Content: VHL QR & Security Controls */}
      <div className="flex-1 px-3 py-3 space-y-3 overflow-y-auto">
        
        {/* QR Credential Card */}
        <div className="bg-white rounded-xl border border-clinical-divider p-4 shadow-sm flex flex-col items-center">
          <div className="text-center mb-2">
            <span className="text-[10px] font-bold text-dpi-cobalt uppercase tracking-wider block">
              IHE ITI Verifiable Health Link (VHL)
            </span>
            <div className="text-xs font-bold text-clinical-ink">{currentTraveller.name}</div>
          </div>

          {/* Centered high-contrast QR */}
          <QrCodeView
            value={vhlManifestUrl}
            size={160}
            badge="Signed VHL Manifest &bull; Lao National Portal"
            badgeVariant="verified"
            caption="QR contains secure token link & key only. Patient data stays in Lao PDR."
          />

          <div className="mt-2 text-center text-[10px] text-clinical-steel font-mono">
            Host: sovereign-fhir.moh.gov.la (HTTPS)
          </div>
        </div>

        {/* Security & Passcode Controls Card */}
        <div className="bg-white rounded-xl border border-clinical-divider p-3.5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-clinical-ink">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>Passcode Protection (Required at PoC)</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
              ACTIVE
            </span>
          </div>

          {/* Passcode display toggle */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Father's Verbal Passcode</span>
              <div className="text-sm font-mono font-bold text-slate-900 tracking-wider">
                {showPasscode ? '4829' : '••••'}
              </div>
            </div>
            <button
              onClick={() => setShowPasscode(!showPasscode)}
              className="flex items-center gap-1 text-xs text-dpi-cobalt font-medium px-2 py-1 rounded hover:bg-slate-200/60"
            >
              {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPasscode ? 'Hide' : 'Reveal'}</span>
            </button>
          </div>

          {/* Validity & Expiry */}
          <div className="space-y-1 text-xs text-clinical-steel">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Link Validity:</span>
              </span>
              <span className="font-mono text-slate-700 font-semibold">14 Days (Dec 15, 2026)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Rate Limit:</span>
              <span className="font-mono text-slate-700">Max 3 Failed Attempts</span>
            </div>
          </div>

          {/* Consent Note (IHE PCF) */}
          <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200 text-[10px] text-emerald-900 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Consent to share recorded at generation (IHE PCF / FHIR Consent).</span>
          </div>
        </div>

      </div>

      {/* 4. Bottom Action Bar */}
      <div className="bg-white border-t border-clinical-divider p-3 shadow-lg space-y-1.5">
        <button
          onClick={onNext}
          className="w-full py-3 px-4 bg-dpi-cobalt hover:bg-dpi-cobalt-dark text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2"
        >
          <span>Show Passcode to Clinician in Thailand (J4.1)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[10px] text-center text-clinical-steel font-mono">
          Father presents Somsak's VHL QR & verbal code 4829
        </p>
      </div>
    </div>
  );
};
