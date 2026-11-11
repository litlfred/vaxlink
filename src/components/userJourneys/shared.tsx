import React from 'react';
import { Frown, Meh, Smile, Laugh, Baby, ExternalLink } from 'lucide-react';
import { Emotion, Persona, PERSONAS, RECORD_TRUST_LADDER } from '../../data/journeyData';

const EMOTION_META: Record<Emotion, { label: string; Icon: typeof Smile; className: string }> = {
  [-2]: { label: 'Distressed', Icon: Frown, className: 'text-rose-600 bg-rose-50 border-rose-200' },
  [-1]: { label: 'Worried', Icon: Frown, className: 'text-amber-700 bg-amber-50 border-amber-200' },
  [0]: { label: 'Neutral', Icon: Meh, className: 'text-slate-600 bg-slate-50 border-slate-200' },
  [1]: { label: 'Reassured', Icon: Smile, className: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  [2]: { label: 'Delighted', Icon: Laugh, className: 'text-emerald-800 bg-emerald-100 border-emerald-300' },
};

export const emotionLabel = (e: Emotion) => EMOTION_META[e].label;

export const EmotionBadge: React.FC<{ emotion: Emotion; compact?: boolean }> = ({ emotion, compact }) => {
  const { label, Icon, className } = EMOTION_META[emotion];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${className}`}
      title={label}
    >
      <Icon className="w-3 h-3" />
      {!compact && <span>{label}</span>}
    </span>
  );
};

export const PersonaAvatar: React.FC<{ persona: Persona; size?: 'sm' | 'md' | 'lg' }> = ({ persona, size = 'md' }) => {
  const dims = size === 'sm' ? 'w-6 h-6 text-[9px]' : size === 'lg' ? 'w-12 h-12 text-sm' : 'w-8 h-8 text-[11px]';
  return (
    <span
      className={`${dims} ${persona.color.dot} rounded-full text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}
      aria-hidden
      title={persona.name}
    >
      {persona.id === 'somsak' ? <Baby className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} /> : persona.initials}
    </span>
  );
};

// Colored circles always mean a person. The record's trust ladder is one
// neutral ramp (light to dark as trust grows), so it never reads as a persona.
const TRUST_COLORS = ['bg-slate-300', 'bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-900'];

export const trustColor = (level: number) => TRUST_COLORS[Math.min(level, TRUST_COLORS.length - 1)];

/** Horizontal ladder showing how far Somsak's record has progressed. */
export const TrustMeter: React.FC<{ level: number; showLabels?: boolean }> = ({ level, showLabels = true }) => (
  <div className="space-y-1.5">
    <div className="flex gap-1">
      {RECORD_TRUST_LADDER.map((rung, i) => (
        <div
          key={rung.label}
          className={`h-2 flex-1 rounded-full transition-colors ${i <= level ? trustColor(i) : 'bg-slate-200'}`}
          title={`${rung.label}: ${rung.hint}`}
        />
      ))}
    </div>
    {showLabels && (
      <div className="flex gap-1">
        {RECORD_TRUST_LADDER.map((rung, i) => (
          <div
            key={rung.label}
            className={`flex-1 text-[9px] leading-tight ${i === level ? 'font-bold text-slate-900' : 'text-slate-400'}`}
          >
            {rung.label}
          </div>
        ))}
      </div>
    )}
  </div>
);

export const countryChip = (country: string) =>
  country === 'Thailand'
    ? 'bg-amber-100 text-amber-900'
    : country === 'Lao PDR'
    ? 'bg-sky-100 text-sky-900'
    : 'bg-indigo-100 text-indigo-900';

/** A light "read more" link that opens in a new tab. */
export const ExtLink: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ href, children, className = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-0.5 text-sky-700 hover:underline ${className}`}
  >
    {children}
    <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden />
  </a>
);

// Longest names first, so "Dr. Anan" wins over a shorter match.
const NAME_PATTERNS = PERSONAS.map((p) => ({ p, name: p.name }))
  .sort((a, b) => b.name.length - a.name.length);
const NAME_RE = new RegExp(`(${NAME_PATTERNS.map((n) => n.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

/**
 * Narrative text with each person's tag beside their name, so the avatars
 * (KS, BS, DS, the baby …) read the same in the story as in the cast.
 */
export const PersonaText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(NAME_RE);
  return (
    <>
      {parts.map((part, i) => {
        const hit = NAME_PATTERNS.find((n) => n.name === part);
        if (!hit) return <React.Fragment key={i}>{part}</React.Fragment>;
        return (
          <span key={i} className="whitespace-nowrap">
            {part}
            <span className="inline-flex align-middle ml-1 -mt-0.5">
              <PersonaAvatar persona={hit.p} size="sm" />
            </span>
          </span>
        );
      })}
    </>
  );
};
