import React, { useState } from 'react';
import { Network } from 'lucide-react';
import { ARCHIMATE, DPI_H_RA } from '../../data/links';
import { ExtLink } from './shared';

/**
 * The demonstrator's ArchiMate views, an overlay on the DPI-H RA's own model:
 * the systems on the Integrated View, the journeys (use cases), and one view per
 * journey. Drawn from the model by cat-harness in smart-trust-demo; every box
 * links to its element page there.
 */
export const ArchiMateViews: React.FC = () => {
  const [file, setFile] = useState(ARCHIMATE.views[0].file);
  const view = ARCHIMATE.views.find((v) => v.file === file)!;
  return (
    <section className="bg-white rounded-2xl border border-clinical-divider shadow-sm p-4 md:p-5 space-y-3">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-clinical-ink flex items-center gap-2">
          <Network className="w-4 h-4 text-slate-600" /> ArchiMate views on the DPI-H RA
        </h3>
        <p className="text-xs text-clinical-steel max-w-4xl">
          The same journeys and systems as an ArchiMate overlay on the <ExtLink href={DPI_H_RA}>DPI-H RA</ExtLink>’s own
          model: each Thai and Lao system is a specialization of the RA building block it instantiates, each journey a
          business process served by those systems and realizing RA capabilities. Click any box for its element page;{' '}
          <ExtLink href={ARCHIMATE.page}>about these views</ExtLink>.
        </p>
      </div>
      <div role="tablist" aria-label="ArchiMate view" className="flex flex-wrap gap-1.5">
        {ARCHIMATE.views.map((v) => (
          <button
            key={v.file}
            role="tab"
            aria-selected={v.file === file}
            onClick={() => setFile(v.file)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border min-h-[32px] ${
              v.file === file ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <figure className="rounded-xl border border-slate-200 p-2 space-y-2">
        <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs px-1">
          <span className="font-semibold text-slate-900">{view.title}</span>
          <ExtLink href={ARCHIMATE.viewPage(view)}>View page</ExtLink>
          <ExtLink href={ARCHIMATE.model}>All views and elements</ExtLink>
        </figcaption>
        <div className="overflow-x-auto">
          {/* <object>, not <img>, so the boxes' links work */}
          <object key={view.file} data={ARCHIMATE.svg(view)} type="image/svg+xml" aria-label={`ArchiMate view: ${view.title}`} className="max-w-none">
            <img src={ARCHIMATE.svg(view)} alt={`ArchiMate view: ${view.title}`} />
          </object>
        </div>
      </figure>
    </section>
  );
};
