import React, { useState } from 'react';
import { PATIENT_DATA, GDHCN_DEV_KEY } from '../../data/storylineData';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  FileCheck2,
  Syringe,
  QrCode
} from 'lucide-react';

interface S4Props {
  onNext: () => void;
  onOpenFhirInspector?: () => void;
}

export const S4_ClinicVerification: React.FC<S4Props> = ({ onNext }) => {
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(true);

  const toggleTamperSimulation = () => {
    setIsTampered(!isTampered);
  };

  return (
    <div className="flex flex-col h-full bg-clinical-alabaster font-sans">
      {/* 1. Facility Header */}
      <div className="bg-white border-b border-clinical-divider px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-50 rounded-lg text-dpi-cobalt border border-sky-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-clinical-ink">
              Vientiane District Health Center — OHS Player Facility EMR
            </h2>
            <div className="flex items-center gap-2 text-xs text-clinical-steel mt-0.5">
              <span>Practitioner: <strong>Nurse Chanthason</strong></span>
              <span>&bull;</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                DEV Trust List Cached &bull; Updated 2h ago
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTamperSimulation}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition border ${
              isTampered
                ? 'bg-tampered-crimson text-white border-tampered-crimson animate-pulse'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            {isTampered ? 'Tampered State ACTIVE (Click to Reset)' : 'Simulate Tampered QR Card'}
          </button>
        </div>
      </div>

      {/* Patient Demographic Banner */}
      <div className="bg-slate-900 text-white px-6 py-2.5 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sky-400">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">{PATIENT_DATA.infantName}</span>
                <span className="bg-sky-950 text-sky-300 px-2 py-0.5 rounded font-mono text-[11px] border border-sky-800">
                  Age: 4 Weeks (T0+4w)
                </span>
                <span className="bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded text-[11px] border border-amber-700">
                  Referred by CHW Vilay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 & 3. Primary Content Area: 2-Column Clinical Split */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
        
        {/* Left Pane (5 cols): Incoming Referral & Pending Immunizations */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Referral Card */}
          <div className="bg-white rounded-xl border border-clinical-divider p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Incoming CHW Referral
              </span>
              <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200">
                ServiceRequest #req-verify-001
              </span>
            </div>
            <p className="text-xs text-clinical-steel">
              <strong className="text-slate-800">Reason:</strong> Foreign vaccination cards presented at household in Village 04 — require cryptographic signature verification & Lao EPI schedule check.
            </p>
          </div>

          {/* Pending Immunizations List */}
          <div className="bg-white rounded-xl border border-clinical-divider p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-clinical-ink uppercase tracking-wider">
                Unverified Records Under Review
              </h3>
              <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                2 Pending DVC Doses
              </span>
            </div>

            {/* Dose 1: Hep B */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">Hepatitis B Pediatric Dose</span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                  primarySource: false
                </span>
              </div>
              <div className="text-[11px] text-clinical-steel font-mono">
                Code: vp-hepb-peds-monovalent &bull; Lot: TH-4821
              </div>
              <div className="text-[10px] text-amber-700">
                Origin: Chiang Rai Provincial Hospital (Thailand)
              </div>
            </div>

            {/* Dose 2: BCG */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">BCG Vaccine (Freeze-Dried)</span>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                  primarySource: false
                </span>
              </div>
              <div className="text-[11px] text-clinical-steel font-mono">
                Code: vp-bcg-freeze-dried &bull; Lot: TH-9012
              </div>
              <div className="text-[10px] text-amber-700">
                Origin: Chiang Rai Provincial Hospital (Thailand)
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane (7 cols): Camera Scanner & Verification Result */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-clinical-divider p-5 shadow-sm space-y-4">
            
            {/* Camera Viewport Simulation */}
            <div className="relative bg-slate-950 rounded-xl overflow-hidden h-44 flex items-center justify-center border-2 border-slate-800">
              {/* Reticle frame */}
              <div
                className={`w-32 h-32 border-2 rounded-lg relative flex items-center justify-center transition-colors ${
                  isTampered ? 'border-tampered-crimson' : 'border-emerald-500'
                }`}
              >
                {/* Corner notches */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-inherit"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-inherit"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-inherit"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-inherit"></div>
                <QrCode
                  className={`w-20 h-20 opacity-80 ${
                    isTampered ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                />
              </div>

              {/* Scanning badge */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded backdrop-blur-sm">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-sky-400" />
                  <span>Optical Camera Feed &bull; Live Frame</span>
                </span>
                <span className={isTampered ? 'text-rose-400' : 'text-emerald-400'}>
                  {isTampered ? 'CBOR Decoded (Signature Mismatch)' : 'Decoded: HC1:6BFOXN...'}
                </span>
              </div>
            </div>

            {/* Verification Result Card */}
            {isTampered ? (
              /* TAMPERED / INVALID STATE */
              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-tampered-crimson font-bold text-sm">
                  <XCircle className="w-5 h-5 text-tampered-crimson flex-shrink-0" />
                  <span>SIGNATURE VERIFICATION FAILED — INVALID COSE_Sign1</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Trust Resolution</span>
                    <span className="text-slate-800 font-medium">Untrusted / Altered Card</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Diagnostic Code</span>
                    <span className="font-mono text-tampered-crimson font-bold">ERR_CRYPTO_SIG_MISMATCH</span>
                  </div>
                </div>

                <p className="text-xs text-rose-900 leading-relaxed bg-white/60 p-2.5 rounded border border-rose-200">
                  The cryptographic signature attached to this paper certificate does not match the computed hash of the vaccination payload. This record cannot be upgraded to primarySource=true.
                </p>
              </div>
            ) : (
              /* VALID / VERIFIED STATE */
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-verified-emerald font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>VALID COSE_Sign1 SIGNATURE (ES256)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold border border-emerald-300">
                    PASS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Trust Authority</span>
                    <span className="text-slate-800 font-medium">Thailand MOPH (DEV Participant XXR)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Key ID (kid)</span>
                    <span className="font-mono text-slate-800 font-semibold">{GDHCN_DEV_KEY.kid}</span>
                  </div>
                </div>

                <div className="text-xs text-emerald-900 bg-white/70 p-2.5 rounded border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Header Validated &bull; Certificate Within DSC Validity Window</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Action: Attaches FHIR Provenance referencing DVC entity & updates Immunization.primarySource to true.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* 4. Bottom Action Bar */}
      <div className="bg-white border-t border-clinical-divider px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-clinical-steel">
          Status: {isTampered ? (
            <span className="text-tampered-crimson font-medium">Signature rejected &bull; Adjudication blocked</span>
          ) : (
            <span className="text-emerald-700 font-medium">Cryptographic trust verified via GDHCN DEV network</span>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={isTampered}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition ${
            isTampered
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-dpi-cobalt hover:bg-dpi-cobalt-dark text-white'
          }`}
        >
          <span>Confirm Verification & Proceed to Schedule Evaluation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
