/**
 * Shareable addresses for every view, in the URL hash so they work on any
 * static host (GitHub Pages) without server rewrites:
 *
 *   #/overview  #/walkthrough/J2b  #/map  #/personas/khamla
 *   #/how/gdhcn  #/discuss  #/sheets  #/demo/S4
 */
import { JourneyView } from './components/userJourneys/UserJourneys';
import { ScreenId } from './types';

export type Route =
  | { tab: 'journeys'; view: JourneyView; arg?: string }
  | { tab: 'screens'; screen: ScreenId };

const VIEWS: JourneyView[] = ['overview', 'walkthrough', 'map', 'personas', 'how', 'discuss', 'sheets'];
const SCREENS: ScreenId[] = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

export const parseHash = (hash: string): Route | null => {
  const [head, arg] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (head === 'demo') return { tab: 'screens', screen: SCREENS.includes(arg as ScreenId) ? (arg as ScreenId) : 'S1' };
  if (VIEWS.includes(head as JourneyView)) return { tab: 'journeys', view: head as JourneyView, arg: arg || undefined };
  return null;
};

export const viewHref = (view: JourneyView, arg?: string) => `#/${view}${arg ? `/${encodeURIComponent(arg)}` : ''}`;
export const stepHref = (stageCode: string) => viewHref('walkthrough', stageCode);
export const screenHref = (screen: ScreenId) => `#/demo/${screen}`;
