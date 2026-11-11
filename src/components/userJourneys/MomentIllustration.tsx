import React from 'react';
import {
  Baby,
  Hospital,
  QrCode,
  House,
  Smartphone,
  WifiOff,
  ShieldCheck,
  Tablet,
  CalendarCheck,
  Stethoscope,
  ArrowLeftRight,
  Link,
  ArrowRight,
} from 'lucide-react';

type Icon = typeof Baby;

/**
 * One small picture per chapter ("four moments that matter"), drawn from the
 * same icons everywhere: the overview cards, the walkthrough and the journey
 * map show the same scene for the same moment.
 */
const SCENES: Record<string, { tint: string; ink: string; parts: { Icon: Icon; label: string }[] }> = {
  'born-abroad': {
    tint: 'from-amber-50 to-orange-50 border-amber-200',
    ink: 'text-amber-700',
    parts: [
      { Icon: Hospital, label: 'Thai hospital' },
      { Icon: Baby, label: 'Somsak is born' },
      { Icon: QrCode, label: 'Two signed paper QR cards' },
    ],
  },
  'found-at-home': {
    tint: 'from-sky-50 to-teal-50 border-sky-200',
    ink: 'text-teal-700',
    parts: [
      { Icon: House, label: 'Home visit, Village 04' },
      { Icon: WifiOff, label: 'No signal' },
      { Icon: Smartphone, label: 'CHW phone: registered, reported' },
    ],
  },
  'made-official': {
    tint: 'from-sky-50 to-indigo-50 border-sky-200',
    ink: 'text-sky-700',
    parts: [
      { Icon: Tablet, label: 'Clinic tablet' },
      { Icon: ShieldCheck, label: 'Signature verified' },
      { Icon: CalendarCheck, label: 'On the Lao schedule' },
    ],
  },
  'crossing-back': {
    tint: 'from-indigo-50 to-amber-50 border-indigo-200',
    ink: 'text-indigo-700',
    parts: [
      { Icon: Link, label: 'Passcode link on Dad’s phone' },
      { Icon: ArrowLeftRight, label: 'Lao PDR ⇄ Thailand' },
      { Icon: Stethoscope, label: 'Thai doctor sees it all' },
    ],
  },
};

export const MomentIllustration: React.FC<{ chapterId: string; size?: 'sm' | 'md' }> = ({ chapterId, size = 'md' }) => {
  const scene = SCENES[chapterId];
  if (!scene) return null;
  const icon = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';
  const pad = size === 'sm' ? 'p-2 gap-1.5' : 'p-3 gap-2';
  return (
    <figure
      className={`rounded-xl border bg-gradient-to-br ${scene.tint} ${pad} flex items-center justify-center`}
      aria-label={scene.parts.map((p) => p.label).join(', then ')}
    >
      {scene.parts.map(({ Icon, label }, i) => (
        <React.Fragment key={label}>
          {i > 0 && <ArrowRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" aria-hidden />}
          <span className="flex flex-col items-center text-center min-w-0" title={label}>
            <span className={`rounded-lg bg-white/80 shadow-sm ${size === 'sm' ? 'p-1' : 'p-1.5'}`}>
              <Icon className={`${icon} ${scene.ink}`} aria-hidden />
            </span>
            {size === 'md' && <span className="text-[9px] leading-tight text-slate-600 mt-1 max-w-[5.5rem]">{label}</span>}
          </span>
        </React.Fragment>
      ))}
    </figure>
  );
};
