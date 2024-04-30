import {
  Effect as Z,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import settingsPanelSize from '@/settingsPanelSize';

export default (
  toggleSettingsElement: HTMLElement,
) => (
  nextSettingsRect: (r: DOMRectReadOnly) => Z.Effect<void>,
) => (
  last: DOMRectReadOnly,
): Z.Effect<void> => pipe(
  Z.succeed(toggleSettingsElement),
  Z.filterOrFail((x) => x.offsetParent !== null),
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
  || x.height !== last.height),
  Z.tap(nextSettingsRect),
  Z.ignore,
);
