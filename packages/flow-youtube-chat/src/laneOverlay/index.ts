import {
  Effect as Z,
  Option as O,
  pipe,
} from 'effect';

import UserConfig from '@/UserConfig';

export interface LaneOverlay {
  show: (
    excludedLanes: readonly number[],
    hover: O.Option<number>,
  ) => Z.Effect<void>
  flash: (
    excludedLanes: readonly number[],
    hover: O.Option<number>,
  ) => Z.Effect<void>
  leave: Z.Effect<void>
}

const flashMillis = 700;

/**
 * Half-transparent lane stripes over the player, previewing the
 * excluded-lanes toggle strip in the settings panel: excluded lanes as
 * filled stripes, the lane under the pointer highlighted. `show` holds it
 * visible while the pointer is over the strip; `flash` (a toggle) holds
 * it for a short linger and then fades, so devices without hover still
 * get the preview.
 *
 * `config` is the live shared config object, so lane geometry (laneCount,
 * flowY1/flowY2) is read at render time. The excluded set is a parameter
 * instead because a toggle renders before its config write settles.
 */
export default (
  host: HTMLElement,
  config: UserConfig,
): LaneOverlay => {
  const element = document.createElement('div');
  Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
    element.style,
    {
      position: 'absolute',
      inset: '0',
      // Above the flow chats, which append after this element and carry
      // no z-index of their own.
      zIndex: '10',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.4s',
    },
  );

  host.append(element);

  const state: {
    pointerOver: boolean
    flashTimer: ReturnType<typeof setTimeout> | null
  } = {
    pointerOver: false,
    flashTimer: null,
  };

  const stripe = (
    look: Partial<CSSStyleDeclaration>,
  ) => (lane: number): HTMLElement => {
    const bandHeight = config.flowY2 - config.flowY1;
    const row = document.createElement('div');

    Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
      row.style,
      {
        position: 'absolute',
        left: '0',
        right: '0',
        top: `${(config.flowY1
          + ((lane / config.laneCount) * bandHeight)) * 100}%`,
        height: `${(bandHeight / config.laneCount) * 100}%`,
        ...look,
      },
    );

    return row;
  };

  // Two-tone looks so a stripe stays visible over any video: each pairs a
  // light and a dark component, and one of the two always contrasts with
  // the backdrop.
  const excludedLook: Partial<CSSStyleDeclaration> = {
    background: 'repeating-linear-gradient(45deg,'
      + ' rgba(255,255,255,0.5) 0 6px, rgba(160,20,16,0.55) 6px 12px)',
  };

  const hoverLook: Partial<CSSStyleDeclaration> = {
    background: 'rgba(255,255,255,0.35)',
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.6)',
  };

  const render = (
    excludedLanes: readonly number[],
    hover: O.Option<number>,
  ): void => {
    element.replaceChildren(
      ...excludedLanes.filter((x) => x < config.laneCount)
        .map(stripe(excludedLook)),
      ...pipe(
        hover,
        O.filter((x) => x < config.laneCount),
        O.map(stripe(hoverLook)),
        O.toArray,
      ),
    );
  };

  const setVisible = (visible: boolean): void => {
    element.style.opacity = visible ? '1' : '0';
  };

  return {
    show: (excludedLanes, hover) => Z.sync(() => {
      state.pointerOver = true;
      render(excludedLanes, hover);
      setVisible(true);
    }),
    flash: (excludedLanes, hover) => Z.sync(() => {
      render(excludedLanes, hover);
      setVisible(true);

      if (state.flashTimer !== null) {
        clearTimeout(state.flashTimer);
      }

      state.flashTimer = setTimeout(() => {
        state.flashTimer = null;

        if (!state.pointerOver) {
          setVisible(false);
        }
      }, flashMillis);
    }),
    leave: Z.sync(() => {
      state.pointerOver = false;

      // A pending flash keeps the overlay up; its timer fades it out.
      if (state.flashTimer === null) {
        setVisible(false);
      }
    }),
  };
};
