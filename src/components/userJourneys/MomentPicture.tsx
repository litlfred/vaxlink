import React from 'react';

/** The illustration of each of the four moments: who is there, and what passes between them. */
const PICTURES: Record<string, { file: string; alt: string }> = {
  'born-abroad': {
    file: 'moment-j1-born-abroad',
    alt: 'At Chiang Rai Hospital, Dr Anan holds up two signed QR cards for Khamla and Bounmy, who hold newborn Somsak',
  },
  'found-at-home': {
    file: 'moment-j2-found-at-home',
    alt: 'In a Lao village with no signal, Vilay, the community health worker, scans the paper cards with her phone while Khamla holds Somsak and Bounmy looks on',
  },
  'made-official': {
    file: 'moment-j3-made-official',
    alt: 'At the district health centre, Nurse Chanthason checks the cards on a tablet: signature verified, on the Lao schedule; Khamla and Bounmy hold Somsak',
  },
  'crossing-back': {
    file: 'moment-j4-crossing-back',
    alt: 'Back in Thailand, Bounmy shares a vaccine-record link from his phone and Dr Anan sees Somsak’s vaccine history; Khamla and toddler Somsak are beside them',
  },
};

export const MomentPicture: React.FC<{ chapterId: string; className?: string }> = ({ chapterId, className = '' }) => {
  const p = PICTURES[chapterId];
  if (!p) return null;
  return (
    <img
      src={`${import.meta.env.BASE_URL}moments/${p.file}.jpg`}
      alt={p.alt}
      title={p.alt}
      loading="lazy"
      className={`w-full aspect-[818/299] object-cover rounded-xl border border-slate-200 ${className}`}
    />
  );
};
