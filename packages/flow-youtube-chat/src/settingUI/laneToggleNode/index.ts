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

// The excluded set goes through the regular config path, plus the
// overlay flash — see laneOverlay's own doc.
const paint = (c: AppCommander) => (
  s: SettingState,
  lanes: readonly number[],
  pointerLane: number,
  target: boolean,
): SettingDispatchable => pipe(
  target
    ? pipe(
      A.union(s.excludedLanes, lanes),
      A.sort(N.Order),
    )
    : A.filter(s.excludedLanes, (x) => !A.contains(lanes, x)),
  (excludedLanes) => pipe(
    updateAt('excludedLanes')(excludedLanes)(c)({
      ...s,
      laneHover: O.some(pointerLane),
      lanePaintTarget: O.some(target),
    }),
    ([updated, ...effects]): SettingDispatchable => [
      updated,
      ...effects,
      () => runLogged(c.laneOverlay.flash(excludedLanes, O.some(pointerLane))),
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
    // A fast drag can jump several cells between pointermove events, so
    // a stroke covers the whole run since the last seen lane.
    O.map((target) => ({
      target,
      lanes: pipe(
        O.getOrElse(s.laneHover, () => lane),
        (from) => A.range(Math.min(from, lane), Math.max(from, lane)),
      ),
    })),
    O.filter(({
      lanes, target,
    }) => A.some(lanes, (x) => A.contains(s.excludedLanes, x) !== target)),
    O.match({
      onNone: () => hoverAction(c)(s, e),
      onSome: ({
        lanes, target,
      }) => paint(c)(s, lanes, lane, target),
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

  return paint(c)(s, [lane], lane, !A.contains(s.excludedLanes, lane));
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
      // Through moveAction, not hoverAction: re-entering mid-drag must
      // not reset the stroke anchor (laneHover) without painting up to
      // the entry cell first.
      onpointerenter: moveAction(c),
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
