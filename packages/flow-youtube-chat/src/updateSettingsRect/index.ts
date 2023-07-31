import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as Z from 'effect/Effect';

import settingsPanelSize from '@/settingsPanelSize';

export default (
  toggleSettingsElement: HTMLElement,
) => (
  nextSettingsRect: (r: DOMRectReadOnly) => Z.Effect<never, never, void>,
) => (
  last: DOMRectReadOnly,
): Z.Effect<never, never, void> => pipe(
  Z.succeed(toggleSettingsElement),
  Z.filterOrFail((x) => x.offsetParent !== null, O.none),
  Z.map((x) => x.getBoundingClientRect()),
  Z.map((x) => new DOMRectReadOnly(
    Math.max(0, x.right + window.scrollX - settingsPanelSize.width),
    Math.max(0, x.y + window.scrollY - settingsPanelSize.height),
    settingsPanelSize.width,
    Math.min(x.y + window.scrollY, settingsPanelSize.height),
  )),
  Z.orElseSucceed(() => new DOMRectReadOnly(
    -settingsPanelSize.width,
    -settingsPanelSize.height,
    settingsPanelSize.width,
    settingsPanelSize.height,
  )),
  Z.filterOrFail((x) => x.x !== last.x
  || x.y !== last.y
  || x.width !== last.width
  || x.height !== last.height, O.none),
  Z.tap(nextSettingsRect),
  Z.ignore,
);
