import React, { useState } from 'react';
import { PATIENT_DATA, INITIAL_IMMUNIZATIONS, SUBSEQUENT_LAO_IMMUNIZATIONS } from '../../data/storylineData';
import { 
  Users, 
  Smartphone, 
  ShieldCheck, 
  QrCode, 
  Pill, 
  CheckCircle2, 
  Calendar, 
  Globe2, 
  ExternalLink,
  ArrowRight,
  Baby,
  User
} from 'lucide-react';

interface S6Props {
  onNext: () => void;
  onOpenFhirInspector?: () => void;
}

export const S6_FamilyWallet: React.FC<S6Props> = ({ onNext }) => {
  const [selectedMember, setSelectedMember] = useState<'somsak' | 'bounmy' | 'khamla'>('somsak');

  return (
    <div className="flex flex-col h-full bg-clinical-alabaster font-sans">
      {/* 1. App Bar */}
      <div className="bg-white border-b border-clinical-divider px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-clinical-ink tracking-tight">
              Lao PDR Family Health Wallet
            </h2>
            <div className="text-[10px] text-clinical-steel">
              Sengmany Family &bull; 3 Members &bull; FHIR Group
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>National Portal Connected</span>
          </div>
        </div>
      </div>

      {/* 2. Hero: Household Member Switcher */}
      <div className="p-3">
        <div className="bg-white rounded-xl border border-clinical-divider p-2 shadow-sm">
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {/* Baby Somsak */}
            <button
              onClick={() => setSelectedMember('somsak')}
              className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
                selectedMember === 'somsak'
                  ? 'bg-sky-50 border border-sky-300 text-sky-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-800">
                <Baby className="w-4 h-4" />
              </div>
              <span className="text-[11px] truncate">Somsak</span>
              <span className="text-[9px] font-mono text-slate-400">Child (12m)</span>
            </button>

            {/* Father Bounmy */}
            <button
              onClick={() => setSelectedMember('bounmy')}
              className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
                selectedMember === 'bounmy'
                  ? 'bg-sky-50 border border-sky-300 text-sky-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[11px] truncate">Bounmy</span>
              <span className="text-[9px] font-mono text-slate-400">Father (Head)</span>
            </button>

            {/* Mother Khamla */}
            <button
              onClick={() => setSelectedMember('khamla')}
              className={`p-2 rounded-lg flex flex-col items-center gap-1 transition ${
                selectedMember === 'khamla'
                  ? 'bg-sky-50 border border-sky-300 text-sky-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[11px] truncate">Khamla</span>
              <span className="text-[9px] font-mono text-slate-400">Mother</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Content Area: Member Record */}
      <div className="flex-1 px-3 pb-3 space-y-3 overflow-y-auto">
        {selectedMember === 'somsak' ? (
          /* Somsak's IPS Immunization Summary */
          <div className="space-y-2.5">
            <div className="bg-white rounded-xl border border-clinical-divider p-3.5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-clinical-ink">
                    Longitudinal Immunization Summary (IPS)
                  </h3>
                  <p className="text-[10px] text-clinical-steel">
                    FHIR Bundle [IPS] &bull; Somsak Sengmany (12 Months)
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  6 Doses Verified
                </span>
              </div>

              {/* Cross-border Provenance Highlight */}
              <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Cross-Border Provenance: Thailand (T0)</span>
                  </span>
                  <span className="text-[9px] font-mono bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">
                    GDHCN Verified
                  </span>
                </div>
                <div className="text-[10px] text-amber-900 space-y-1">
                  <div className="bg-white/80 p-1.5 rounded border border-amber-100 flex items-center justify-between">
                    <span>Hepatitis B Birth Dose</span>
                    <span className="font-mono text-[9px] text-slate-600">TH-4821 &bull; Lao HepB-BD</span>
                  </div>
                  <div className="bg-white/80 p-1.5 rounded border border-amber-100 flex items-center justify-between">
                    <span>BCG Birth Dose</span>
                    <span className="font-mono text-[9px] text-slate-600">TH-9012 &bull; Lao BCG-BD</span>
                  </div>
                </div>
              </div>

              {/* Domestic Lao PDR Routine Doses */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Domestic Lao PDR EPI Routine Doses
                </span>

                {SUBSEQUENT_LAO_IMMUNIZATIONS.map((imm) => (
                  <div
                    key={imm.id}
                    className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-[11px]">{imm.vaccineName}</div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        Date: {imm.dateAdministered} &bull; Lot: {imm.lotNumber}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      primarySource: true
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedMember === 'bounmy' ? (
          /* Bounmy Father's IPS Profile */
          <div className="bg-white rounded-xl border border-clinical-divider p-3.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-clinical-ink">
                  Father's International Patient Summary (IPS)
                </h3>
                <p className="text-[10px] text-clinical-steel">Bounmy Sengmany (29y)</p>
              </div>
              <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded">
                Phone Holder
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Pill className="w-3.5 h-3.5 text-indigo-600" />
                <span>Active MedicationStatement (Hypertension)</span>
              </div>
              <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
                Amlodipine 5mg oral daily &bull; Prescribed Lao National Hospital
              </div>
              <p className="text-[10px] text-slate-500">
                This record will be bundled into Bounmy's cross-border VHL travel link.
              </p>
            </div>
          </div>
        ) : (
          /* Khamla Mother's IPS Profile */
          <div className="bg-white rounded-xl border border-clinical-divider p-3.5 shadow-sm space-y-3">
            <div>
              <h3 className="font-bold text-xs text-clinical-ink">
                Mother's International Patient Summary (IPS)
              </h3>
              <p className="text-[10px] text-clinical-steel">Khamla Sengmany (26y)</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
              Maternal Health Records & Tetanus-Diphtheria (Td) Adult Boosters verified.
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Action Bar */}
      <div className="bg-white border-t border-clinical-divider p-3 shadow-lg">
        <button
          onClick={onNext}
          className="w-full py-3 px-4 bg-dpi-cobalt hover:bg-dpi-cobalt-dark text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          <span>Request Verifiable Health Links (VHL) for All 3</span>
        </button>
        <p className="text-[10px] text-center text-clinical-steel mt-1.5 font-mono">
          Hosted in Lao PDR &bull; Records stay in home country custody
        </p>
      </div>
    </div>
  );
};
