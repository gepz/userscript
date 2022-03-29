import * as blas from '@stdlib/blas';
import {
  createWorld,
  defineComponent,
  ISchema,
} from 'bitecs';
import * as E from 'fp-ts/Either';
import * as IO from 'fp-ts/IO';
import * as IOE from 'fp-ts/IOEither';
import {
  newIORef,
} from 'fp-ts/IORef';
import {
  equals,
} from 'fp-ts/Ord';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import {
  apply,
  flow,
  pipe,
} from 'fp-ts/function';
import * as Str from 'fp-ts/string';
import * as Struct from 'fp-ts/struct';
import * as PIXI from 'pixi.js';
import * as Rx from 'rxjs';

import GameState from '@/GameState';
import addBullet from '@/addBullet';
import addEnemy from '@/addEnemy';
import addHoverText from '@/addHoverText';
import addLevelPortal from '@/addLevelPortal';
import addPlayer from '@/addPlayer';
import addWeapon from '@/addWeapon';
import autoInputSystem from '@/autoInputSystem';
import bulletSystem from '@/bulletSystem';
import defaultGameState from '@/defaultGameState\'';
import float from '@/float';
import hoverTextSystem from '@/hoverTextSystem';
import initPlayer from '@/initPlayer';
import interactInputSystem from '@/interactInputSystem';
import level from '@/level';
import levelPortalSystem from '@/levelPortalSystem';
import lifeTimeSystem from '@/lifeTimeSystem';
import movementInputSystem from '@/movementInputSystem';
import movementSystem from '@/movementSystem';
import playerInteractInputSystem from '@/playerInteractInputSystem';
import playerMovementInputSystem from '@/playerMovementInputSystem';
import playerShootInputSystem from '@/playerShootInputSystem';
import reference from '@/reference';
import removeEntitySystem from '@/removeEntitySystem';
import renderCircleSystem from '@/renderCircleSystem';
import renderContainerSystem from '@/renderContainerSystem';
import renderTextSystem from '@/renderTextSystem';
import resetEnemyPositionSystem from '@/resetEnemyPositionSystem';
import resetLevelPortalPositionSystem from '@/resetLevelPortalPositionSystem';
import resetPlayerPositionSystem from '@/resetPlayerPositionSystem';
import shootInputSystem from '@/shootInputSystem';
import vector2 from '@/vector2';
import vector3 from '@/vector3';

export default (
  app: PIXI.Application,
): T.Task<Rx.Subscription> => pipe(
  (resolve: R.Reader<Rx.Subscription, void>) => pipe(
    createWorld,
    IO.bindTo('world'),
    IO.apS('state', newIORef<GameState>(defaultGameState())),
    IO.apS('c', pipe(
      IO.Do,
      flow(
        IO.apS('displayParent', () => defineComponent(reference)),
        IO.apS('activeHoverText', () => defineComponent(reference)),
        IO.apS('position', () => defineComponent(vector3)),
        IO.apS('radius', () => defineComponent(float)),
      ),
      flow(
        IO.apS('velocity', () => defineComponent(vector3)),
        IO.apS('acceleration', () => defineComponent(vector3)),
        IO.apS('maxSpeed', () => defineComponent(float)),
        IO.apS('movingAcceleration', () => defineComponent(float)),
        IO.apS('friction', () => defineComponent(float)),
      ),
      flow(
        IO.apS('movementInput', () => defineComponent(vector2)),
        IO.apS('bulletInterval', () => defineComponent(float)),
        IO.apS('lastShoot', () => defineComponent(float)),
        IO.apS('lifeTime', () => defineComponent(float)),
        IO.apS('portalTarget', () => defineComponent(float)),
      ),
      flow(
        IO.apS('isCollider', defineComponent<ISchema>),
        IO.apS('isBullet', defineComponent<ISchema>),
        IO.apS('isEnemy', defineComponent<ISchema>),
        IO.apS('isAuto', defineComponent<ISchema>),
        IO.apS('isPlayer', defineComponent<ISchema>),
        IO.apS('isCharacter', defineComponent<ISchema>),
        IO.apS('shootInput', defineComponent<ISchema>),
        IO.apS('interactInput', defineComponent<ISchema>),
        IO.apS('resettingPosition', defineComponent<ISchema>),
      ),
      flow(
        IO.apS('interactable', defineComponent<ISchema>),
        IO.apS('hasHoverText', defineComponent<ISchema>),
        IO.apS('isText', defineComponent<ISchema>),
        IO.apS('isVisible', defineComponent<ISchema>),
      ),
      flow(
        IO.apS('removing', defineComponent<ISchema>),
      ),
    )),
    flow(
      IO.apS('containers', () => new Map<number, PIXI.Container>()),
      IO.bind('playerMovementInputSystem', (c) => playerMovementInputSystem(
        () => pipe(
          c.state.read(),
          (x) => ({
            x: x.inputX,
            y: x.inputY,
          }),
        ),
      )(c.c)),
      IO.bind('playerShootInputSystem', (c) => playerShootInputSystem(
        () => c.state.read().shootDown,
      )(c.c)),
      IO.bind('playerInteractInputSystem', (c) => playerInteractInputSystem(
        () => c.state.read().interactDown,
      )(c.c)),
      IO.bind('autoInputSystem', (x) => autoInputSystem(x.c)),
      IO.bind('movementInputSystem', (x) => movementInputSystem(x.c)),
      IO.bind('shootInputSystem', (x) => shootInputSystem(x.c)(
        () => x.state.read().now,
      )(addBullet(x.world)(x.c))),
      IO.bind('interactInputSystem', (x) => interactInputSystem(x.c)(
        () => x.state.read().now,
      )(addBullet(x.world)(x.c))),
    ),
    flow(
      IO.bind('movementSystem', (x) => movementSystem(x.c)(
        () => x.state.read().dt,
      )),
      IO.bind('renderCircleSystem', (x) => renderCircleSystem(
        app,
      )(x.containers)(x.c)),
      IO.bind('renderTextSystem', (x) => renderTextSystem(
        app,
      )(x.containers)(x.c)(() => x.state.read().stringMap)),
      IO.bind('renderContainerSystem', (x) => renderContainerSystem(
        x.containers,
      )(x.c)),
      IO.bind('bulletSystem', (x) => bulletSystem(x.c)),
      IO.bind('lifeTimeSystem', (x) => lifeTimeSystem(x.c)(
        () => x.state.read().dt,
      )),
    ),
    flow(
      IO.bind('removeEntitySystem', (x) => removeEntitySystem(x.c)(x.state)),
      IO.bind('resetEnemyPositionSystem', (x) => resetEnemyPositionSystem(x.c)),
      IO.bind('resetPlayerPositionSystem', (x) => resetPlayerPositionSystem(
        x.c,
      )),
      IO.bind(
        'resetLevelPortalPositionSystem',
        (x) => resetLevelPortalPositionSystem(x.c),
      ),
      IO.bind('levelPortalSystem', (x) => levelPortalSystem(x.c)),
      IO.bind('hoverTextSystem', (x) => hoverTextSystem(x.c)(
        x.state,
      )(addHoverText(x.world)(x.c))),
    ),
    IO.chainFirst((x) => initPlayer(x.world)(x.c)(addPlayer(x.world)(x.c))(
      addWeapon(x.world)(x.c),
    )(x.state)),
    IO.chainFirst((x) => level(addEnemy(x.world)(x.c))(
      addLevelPortal(x.world)(x.c)(x.state),
    )),
    IO.bind('sub', (c) => () => pipe(
      (key: string) => (changes: Partial<GameState>) => flow(
        Rx.filter(equals(Str.Ord)(key)),
        Rx.mapTo((x: GameState): GameState => ({
          ...x,
          ...changes,
        })),
      ),
      (f) => [
        pipe(
          Rx.fromEvent<KeyboardEvent>(
            document.body,
            'keydown',
          ),
          Rx.filter((x) => !x.repeat),
          Rx.pluck('key'),
          pipe(
            [
              f('s')({
                shootDown: true,
              }),
              f('Escape')({
                endGame: true,
              }),
              f('ArrowRight')({
                rightDown: true,
              }),
              f('ArrowLeft')({
                leftDown: true,
              }),
              f('ArrowUp')({
                upDown: true,
              }),
              f('ArrowDown')({
                downDown: true,
              }),
              f('e')({
                interactDown: true,
              }),
            ],
            R.sequenceArray,
          ),
          (x) => Rx.merge(...x),
          Rx.map(c.state.modify),
          Rx.tap((x) => x()),
        ),
        pipe(
          Rx.fromEvent<KeyboardEvent>(
            document.body,
            'keyup',
          ),
          Rx.filter((x) => !x.repeat),
          Rx.pluck('key'),
          pipe(
            [
              f('s')({
                shootDown: false,
              }),
              f('ArrowRight')({
                rightDown: false,
              }),
              f('ArrowLeft')({
                leftDown: false,
              }),
              f('ArrowUp')({
                upDown: false,
              }),
              f('ArrowDown')({
                downDown: false,
              }),
              f('e')({
                interactDown: false,
              }),
            ],
            R.sequenceArray,
          ),
          (x) => Rx.merge(...x),
          Rx.map(c.state.modify),
          Rx.tap((x) => x()),
        ),
      ],
      (x) => Rx.merge(...x),
      (x) => x.subscribe(),
    )),
    IO.apS('debugText', () => new PIXI.Text('', {
      fill: 'white',
    })),
    IO.chainFirst((x) => () => app.stage.addChild(x.debugText)),
    IO.chain((c) => pipe(
      [
        (dt: number) => pipe(
          (x: GameState): GameState => ({
            ...x,
            dt,
            now: x.now + dt,
          }),
          c.state.modify,
        )(),
        pipe(
          (x: boolean) => (x ? 1 : 0),
          (toN) => (s: GameState): GameState => pipe(
            {
              inputX: -toN(s.leftDown) + toN(s.rightDown),
              inputY: -toN(s.upDown) + toN(s.downDown),
            },
            (ns) => pipe(
              [ns.inputX, ns.inputY],
              (x) => blas.base.gnrm2(x.length, x, 1),
              (x) => Math.min(1, 1 / x),
              (scale) => (x: number) => x * scale,
              (f) => pipe(
                ns,
                Struct.evolve({
                  inputX: f,
                  inputY: f,
                }),
              ),
            ),
            (ns) => ({
              ...s,
              ...ns,
            }),
          ),
          c.state.modify,
        ),
        pipe(
          [
            c.resetLevelPortalPositionSystem,
            c.resetPlayerPositionSystem,
            c.resetEnemyPositionSystem,
            c.autoInputSystem,
            c.playerMovementInputSystem,
            c.playerShootInputSystem,
            c.playerInteractInputSystem,
            c.movementInputSystem,
            c.hoverTextSystem,
            c.shootInputSystem,
            c.interactInputSystem,
            c.movementSystem,
            c.bulletSystem,
            c.lifeTimeSystem,
            c.levelPortalSystem,
            c.removeEntitySystem,
            c.renderCircleSystem,
            c.renderTextSystem,
            c.renderContainerSystem,
          ],
          RNEA.concatAll({
            concat: (x, y) => flow(
              x,
              IO.chain(y),
            ),
          }),
          apply(c.world),
        ),
        pipe(
          c.state.read,
          IO.map(E.fromPredicate(
            (x) => !x.endGame,
            () => () => resolve(c.sub),
          )),
          IOE.map((x) => () => {
          // eslint-disable-next-line no-param-reassign
            c.debugText.text = x.difficulty.toString();
          }),
          IOE.toUnion,
          IO.flatten,
        ),
      ],
      RA.map((x) => () => app.ticker.add(x)),
      IO.sequenceArray,
    )),
  )(),
  (x) => () => new Promise<Rx.Subscription>(x),
);
