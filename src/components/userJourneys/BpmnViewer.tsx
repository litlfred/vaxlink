import React, { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { bpmnSvg } from '../../data/links';

/** Each BPMN drawing's width at 100% (its SVG viewBox), so a zoom level is a real size. */
const NATURAL_WIDTH: Record<string, number> = {
  'j1-birth-dose-dvc': 1580,
  'j2-chw-discovery-referral': 1580,
  'j3-clinic-verification-schedule': 1755,
  'j4-0-family-vhl-issuance': 1755,
  'j4-1-vhl-point-of-care': 1930,
};

type Zoom = 'fit' | 1 | 1.5 | 2;
const ZOOMS: { z: Zoom; label: string }[] = [
  { z: 'fit', label: 'Fit' },
  { z: 1, label: '100%' },
  { z: 1.5, label: '150%' },
  { z: 2, label: '200%' },
];

const ZoomBar: React.FC<{ zoom: Zoom; setZoom: (z: Zoom) => void; children?: React.ReactNode }> = ({ zoom, setZoom, children }) => (
  <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Diagram size">
    {ZOOMS.map(({ z, label }) => (
      <button
        key={label}
        type="button"
        aria-pressed={zoom === z}
        onClick={() => setZoom(z)}
        className={`text-xs font-semibold px-3 py-1.5 min-h-[36px] min-w-[52px] rounded-lg border ${
          zoom === z ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
        }`}
      >
        {label}
      </button>
    ))}
    {children}
  </div>
);

const Drawing: React.FC<{ file: string; title: string; zoom: Zoom }> = ({ file, title, zoom }) => {
  const w = NATURAL_WIDTH[file] ?? 1600;
  return (
    <img
      src={bpmnSvg(file)}
      alt={`BPMN diagram: ${title}`}
      loading="lazy"
      className="max-w-none h-auto block"
      style={zoom === 'fit' ? { width: '100%' } : { width: `${w * zoom}px` }}
    />
  );
};

/**
 * A BPMN drawing a room can read: at actual size by default, scrolling inside
 * its frame, with tap-sized zoom buttons and a full-screen view.
 */
export const BpmnViewer: React.FC<{ file: string; title: string }> = ({ file, title }) => {
  const [zoom, setZoom] = useState<Zoom>(1);
  const [full, setFull] = useState(false);
  return (
    <div className="space-y-2">
      <ZoomBar zoom={zoom} setZoom={setZoom}>
        <FullScreenButton onClick={() => setFull(true)} />
      </ZoomBar>
      <div className="overflow-auto max-h-[80vh] rounded-lg bg-white border border-slate-100">
        <Drawing file={file} title={title} zoom={zoom} />
      </div>
      {full && <BpmnFullScreen file={file} title={title} onClose={() => setFull(false)} />}
    </div>
  );
};

export const FullScreenButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 min-h-[36px] rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
  >
    <Maximize2 className="w-3.5 h-3.5" /> Full screen
  </button>
);

/** The drawing over the whole page; Esc or the close button returns. */
export const BpmnFullScreen: React.FC<{ file: string; title: string; onClose: () => void }> = ({ file, title, onClose }) => {
  const [zoom, setZoom] = useState<Zoom>('fit');
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={`BPMN diagram: ${title}`} className="fixed inset-0 z-[1000] bg-white flex flex-col">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-200">
        <span className="text-sm font-bold text-slate-900 flex-1 min-w-0">{title}</span>
        <ZoomBar zoom={zoom} setZoom={setZoom} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 min-h-[40px] rounded-lg bg-slate-900 text-white"
        >
          <X className="w-4 h-4" /> Close
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Drawing file={file} title={title} zoom={zoom} />
      </div>
    </div>
  );
};
