import React, { useState } from 'react';
import { PATIENT_DATA, GDHCN_DEV_KEY } from '../../data/storylineData';
import { QrCodeView } from '../common/QrCodeView';
import { 
  Building2, 
  Printer, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Code2,
  Syringe,
  Globe2
} from 'lucide-react';

interface S1Props {
  onNext: () => void;
  onOpenFhirInspector?: () => void;
}

export const S1_BirthDosePreview: React.FC<S1Props> = ({ onNext, onOpenFhirInspector }) => {
  const [showRawPayload, setShowRawPayload] = useState<boolean>(false);
  const [printed, setPrinted] = useState<boolean>(false);

  // Simulated Version 16 HCERT HC1 strings
  const hepbQrPayload = "HC1:6BFOXN%TSMAHN-H8/N2S$K980F2A.0K.136D/S6A5$P*Q0*3YF3$G4*43-C3XED9/D:98$H:836XDXK7/93.3%J9$6K90K:98-H$H83-D:837W6V5R254G59$6-C66O4442*96/3DF98%HN-HM/G$07*G7-G4$C4*D3*K3%J47/D%HN-H/8E/N2$Q9.0K8E%J9*K9$6-C6604%J9$6-C6604-A7*G4%J9*K9$6-C6604*E3*K3%J47/D8HN";
  const bcgQrPayload = "HC1:6BFOXN%TSMAHN-H8/N2S$K980F2A.0K.136D/S6A5$P*Q0*3YF3$G4*43-C3XED9/D:98$H:836XDXK7/93.3%J9$6K90K:98-H$H83-D:837W6V5R254G59$6-C66O4442*96/3DF98%HN-HM/G$07*G7-G4$C4*D3*K3%J47/D%HN-H/8E/N2$Q9.0K8E%J9*K9$6-C6604%J9$6-C6604-A7*G4%J9*K9$6-C6604*E3*K3%J47/D8HN-BCG";

  const handlePrint = () => {
    setPrinted(true);
    setTimeout(() => {
      // simulate print completion
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-clinical-alabaster font-sans">
      {/* 1. Hospital Maternity Unit Header */}
      <div className="bg-white border-b border-clinical-divider px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-700 border border-amber-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-clinical-ink">
              Chiang Rai Provincial Hospital — Newborn Immunization Discharge
            </h2>
            <div className="flex items-center gap-2 text-xs text-clinical-steel mt-0.5">
              <span>Maternity Ward &bull; Bed 304</span>
              <span>&bull;</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                GDHCN DEV Participant: XXR (Thailand MOPH)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online &bull; CA Key Active</span>
          </div>
        </div>
      </div>

      {/* 2. Patient Summary Banner */}
      <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sky-400">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">{PATIENT_DATA.infantName}</span>
                <span className="bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded font-mono text-[11px] border border-amber-700">
                  Temporary ID: TH-NB-2025-8812
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[11px]">
                  No Thai CID
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Born: Today (T0) &bull; Guardian/Mother: {PATIENT_DATA.motherName} &bull; Nationality: {PATIENT_DATA.nationality}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-medium text-[11px]">
              Cross-Border Visitor — Paper DVC Required
            </span>
          </div>
        </div>
      </div>

      {/* 3. Primary Content Area: 2-Column Split Layout */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
        
        {/* Left Column: Recorded Birth Immunizations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-clinical-divider p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-clinical-ink flex items-center gap-2">
                <Syringe className="w-4 h-4 text-dpi-cobalt" />
                <span>Administered Birth Vaccines</span>
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                2 Doses Completed
              </span>
            </div>

            {/* Vaccine 1: Hep B */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-clinical-ink">Hepatitis B Birth Dose</span>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-medium">
                  Completed (T0)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-clinical-steel">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">WHO PreQual Code</span>
                  <span className="font-mono text-slate-800 font-semibold">vp-hepb-peds-monovalent</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">Lot # / Batch</span>
                  <span className="font-mono text-slate-800">TH-4821</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-1.5">
                Site: Left anterolateral thigh &bull; Dose: 0.5 mL &bull; Route: IM
              </div>
            </div>

            {/* Vaccine 2: BCG */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-clinical-ink">BCG Vaccine (Freeze-Dried)</span>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-medium">
                  Completed (T0)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-clinical-steel">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">WHO PreQual Code</span>
                  <span className="font-mono text-slate-800 font-semibold">vp-bcg-freeze-dried</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">Lot # / Batch</span>
                  <span className="font-mono text-slate-800">TH-9012</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-1.5">
                Site: Right upper arm &bull; Dose: 0.05 mL &bull; Route: ID
              </div>
            </div>

            {/* Policy Note */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Technical Implementation Rule:</strong>
                <p className="text-[11px] mt-0.5 text-amber-800 leading-relaxed">
                  WHO PreQual product codes are stored in the digital certificate as issued. Thailand does not translate codes into Lao PDR national schedule codes prior to departure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Printable Paper DVC Cards Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-clinical-divider p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-clinical-ink flex items-center gap-2">
                  <Printer className="w-4 h-4 text-dpi-cobalt" />
                  <span>Printable Paper DVC Wallet Cards</span>
                </h3>
                <p className="text-xs text-clinical-steel">
                  Physical laser/thermal cards carried by family returning to Lao PDR
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Format: WHO DVC v16
              </span>
            </div>

            {/* Side-by-side DVC Paper Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Hep B Card */}
              <div className="border-2 border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Digital Vaccine Certificate
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Card 1 of 2
                    </span>
                  </div>

                  <div className="space-y-1 mb-3 text-xs">
                    <div className="font-bold text-clinical-ink">{PATIENT_DATA.infantName}</div>
                    <div className="text-[11px] text-clinical-steel">Guardian: {PATIENT_DATA.motherName}</div>
                    <div className="text-[11px] font-medium text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                      Vaccine: Hep B Birth Dose
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex justify-center mb-3">
                    <QrCodeView
                      value={hepbQrPayload}
                      size={140}
                      badge="Signed by XXR"
                      badgeVariant="info"
                      caption="Key ID: 916ffa567c0f44a2"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 font-mono text-center">
                  Single Vaccine Embedded &bull; ES256
                </div>
              </div>

              {/* Card 2: BCG Card */}
              <div className="border-2 border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Digital Vaccine Certificate
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Card 2 of 2
                    </span>
                  </div>

                  <div className="space-y-1 mb-3 text-xs">
                    <div className="font-bold text-clinical-ink">{PATIENT_DATA.infantName}</div>
                    <div className="text-[11px] text-clinical-steel">Guardian: {PATIENT_DATA.motherName}</div>
                    <div className="text-[11px] font-medium text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                      Vaccine: BCG Freeze-Dried
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex justify-center mb-3">
                    <QrCodeView
                      value={bcgQrPayload}
                      size={140}
                      badge="Signed by XXR"
                      badgeVariant="info"
                      caption="Key ID: 916ffa567c0f44a2"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 font-mono text-center">
                  Single Vaccine Embedded &bull; ES256
                </div>
              </div>

            </div>

            {/* Raw Payload Collapsible */}
            {showRawPayload && (
              <div className="mt-4 p-4 bg-slate-950 rounded-lg text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 mb-2">
                  <span>DVCMinPreQual Logical CBOR Header & Payload</span>
                  <span className="text-[11px] text-amber-400">ES256 (alg: -7)</span>
                </div>
                <pre>{`{
  "header": { "alg": -7, "kid": "916ffa567c0f44a2", "iss": "XXR" },
  "hcert": {
    "v": [
      {
        "tg": "840534001",
        "vp": "vp-hepb-peds-monovalent",
        "lot": "TH-4821",
        "dt": "${PATIENT_DATA.infantDob}",
        "co": "THA"
      }
    ],
    "nam": { "fn": "Sengmany", "gn": "Somsak" },
    "dob": "${PATIENT_DATA.infantDob}"
  }
}`}</pre>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Footer / Action Bar */}
      <div className="bg-white border-t border-clinical-divider px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setShowRawPayload(!showRawPayload)}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition font-mono"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{showRawPayload ? 'Hide CBOR Payload' : 'Inspect Raw DVCMinPreQual & CBOR'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition shadow-sm ${
              printed
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>{printed ? '2 Cards Printed (Simulated)' : 'Print 2 DVC Cards (Hep B & BCG)'}</span>
          </button>

          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-dpi-cobalt hover:bg-dpi-cobalt-dark text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <span>Proceed to J2a (Return to Lao PDR)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
