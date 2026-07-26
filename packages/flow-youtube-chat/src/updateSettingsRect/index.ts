import {
  Effect as Z,
  pipe,
} from 'effect';

import {
  SettingsPanelSize,
} from '@/settingsPanelSize';

export default (
  panelSize: SettingsPanelSize,
) => (
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
    Math.max(0, x.right + window.scrollX - panelSize.width),
    Math.max(0, x.y + window.scrollY - panelSize.height),
    panelSize.width,
    Math.min(x.y + window.scrollY, panelSize.height),
  )),
  Z.orElseSucceed(() => new DOMRectReadOnly(
    -panelSize.width,
    -panelSize.height,
    panelSize.width,
    panelSize.height,
  )),
  Z.filterOrFail((x) => x.x !== last.x
    || x.y !== last.y
    || x.width !== last.width
    || x.height !== last.height),
  Z.tap(nextSettingsRect),
  Z.ignore,
);
