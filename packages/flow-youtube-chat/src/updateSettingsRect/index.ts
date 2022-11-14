import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import settingsPanelSize from '@/settingsPanelSize';

export default (
  toggleSettingsElement: HTMLElement,
) => (
  nextSettingsRect: R.Reader<DOMRectReadOnly, IO.IO<void>>,
) => (last: DOMRectReadOnly) => pipe(
  () => toggleSettingsElement,
  IO.map(O.fromPredicate((x) => x.offsetParent !== null)),
  IOO.map((x) => x.getBoundingClientRect()),
  IOO.map((x) => new DOMRectReadOnly(
    Math.max(0, x.right + window.scrollX - settingsPanelSize.width),
    Math.max(0, x.y + window.scrollY - settingsPanelSize.height),
    settingsPanelSize.width,
    Math.min(x.y + window.scrollY, settingsPanelSize.height),
  )),
  IOO.alt(() => IOO.of(new DOMRectReadOnly(
    -settingsPanelSize.width,
    -settingsPanelSize.height,
    settingsPanelSize.width,
    settingsPanelSize.height,
  ))),
  IOO.filter((x) => x.x !== last.x
  || x.y !== last.y
  || x.width !== last.width
  || x.height !== last.height),
  IOO.chainFirstIOK(nextSettingsRect),
  IO.apSecond(() => {}),
);
