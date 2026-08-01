import * as Ed from '@userscript/ui/Editable';
import settingRow from '@userscript/ui/node/settingRow';
import {
  Array as A,
  Number as N,
  Option as O,
  pipe,
} from 'effect';
import {
  h,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import getText from '@/getText';
import runLogged from '@/runLogged';
import SettingDispatchable from '@/settingUI/SettingDispatchable';
import updateAt from '@/settingUI/updateAt';

const laneAt = (s: SettingState) => (e: PointerEvent): number => pipe(
  e.currentTarget instanceof HTMLElement
    ? e.currentTarget.getBoundingClientRect()
    : new DOMRectReadOnly(0, 0, 1, 1),
  (rect) => N.clamp({
    minimum: 0,
    maximum: Ed.value(s.laneCount) - 1,
  })(Math.floor(
    ((e.clientX - rect.x) / rect.width) * Ed.value(s.laneCount),
  )),
);

// One painted cell: excluded set updated through the regular config
// path, plus the overlay flash that keeps the player preview up briefly
// after the pointer leaves (the only visibility a device without hover
// gets).
const paint = (c: AppCommander) => (
  s: SettingState,
  lane: number,
  target: boolean,
): SettingDispatchable => pipe(
  target
    ? pipe(
      A.append(s.excludedLanes, lane),
      A.sort(N.Order),
    )
    : A.filter(s.excludedLanes, (x) => x !== lane),
  (excludedLanes) => pipe(
    updateAt('excludedLanes')(excludedLanes)(c)({
      ...s,
      laneHover: O.some(lane),
      lanePaintTarget: O.some(target),
    }),
    ([updated, ...effects]): SettingDispatchable => [
      updated,
      ...effects,
      () => runLogged(c.laneOverlay.flash(excludedLanes, O.some(lane))),
    ],
  ),
);

const hoverAction = (c: AppCommander) => (
  s: SettingState,
  e: PointerEvent,
): SettingDispatchable => pipe(
  laneAt(s)(e),
  (lane): SettingDispatchable => (O.exists(s.laneHover, (x) => x === lane)
    ? [s]
    : [
      {
        ...s,
        laneHover: O.some(lane),
      },
      () => runLogged(c.laneOverlay.show(s.excludedLanes, O.some(lane))),
    ]),
);

const moveAction = (c: AppCommander) => (
  s: SettingState,
  e: PointerEvent,
): SettingDispatchable => pipe(
  laneAt(s)(e),
  (lane) => pipe(
    s.lanePaintTarget,
    O.filter((target) => A.contains(s.excludedLanes, lane) !== target),
    O.match({
      onNone: () => hoverAction(c)(s, e),
      onSome: (target) => paint(c)(s, lane, target),
    }),
  ),
);

const downAction = (c: AppCommander) => (
  s: SettingState,
  e: PointerEvent,
): SettingDispatchable => {
  // Capture so a paint drag keeps feeding this element pointermove (with
  // the lane clamped to the end cells) and the final pointerup even when
  // the pointer wanders off the strip.
  if (e.currentTarget instanceof HTMLElement) {
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  const lane = laneAt(s)(e);

  return paint(c)(s, lane, !A.contains(s.excludedLanes, lane));
};

const endPaint = (s: SettingState): SettingDispatchable => [
  O.isNone(s.lanePaintTarget)
    ? s
    : {
      ...s,
      lanePaintTarget: O.none(),
    },
];

const leaveAction = (c: AppCommander) => (
  s: SettingState,
): SettingDispatchable => (O.isSome(s.lanePaintTarget)
  // A captured paint drag keeps painting outside the strip; leaving the
  // boundary must not end the preview mid-drag.
  ? [s]
  : [
    {
      ...s,
      laneHover: O.none(),
    },
    () => runLogged(c.laneOverlay.leave),
  ]);

export default (c: AppCommander) => (
  s: SettingState,
): VNode<SettingState> => settingRow(
  getText('excludedLanes')(s),
  '',
  [
    h('div', {
      style: {
        display: 'flex',
        height: '14px',
        margin: '4px 0',
        border: '1px solid #666',
        cursor: 'pointer',
        touchAction: 'none',
        userSelect: 'none',
      },
      onpointerenter: hoverAction(c),
      onpointermove: moveAction(c),
      onpointerdown: downAction(c),
      onpointerup: endPaint,
      onpointercancel: endPaint,
      onlostpointercapture: endPaint,
      onpointerleave: leaveAction(c),
    }, A.makeBy(Ed.value(s.laneCount), (lane) => h('span', {
      style: {
        flex: '1 1 0',
        background: A.contains(s.excludedLanes, lane)
          ? 'rgba(229,57,53,0.8)'
          : '#333',
        borderLeft: lane === 0 ? null : '1px solid #666',
        boxShadow: O.exists(s.laneHover, (x) => x === lane)
          ? 'inset 0 0 0 2px #fff'
          : null,
      },
    }, []))),
  ],
);
