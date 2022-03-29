// import * as blas from '@stdlib/blas';
// import {
//   ComponentType,
//   defineQuery,
//   ISchema,
//   hasComponent,
//   IWorld,
// } from 'bitecs';
// import * as IO from 'fp-ts/IO';
// import {
//   IORef,
// } from 'fp-ts/IORef';
// import * as O from 'fp-ts/Option';
// import * as R from 'fp-ts/Reader';
// import * as RA from 'fp-ts/ReadonlyArray';
// import {
//   flow,
//   pipe,
// } from 'fp-ts/function';

// import GameState from '@/GameState';
// import addComponents from '@/addComponents';
// import float from '@/float';
// import globalPosition from '@/globalPosition';
// import reference from '@/reference';
// import removeComponents from '@/removeComponents';
// import setComponents from '@/setComponents';
// import vector3 from '@/vector3';

// export default ({
//   hasHoverText,
//   isCharacter,
//   removing,
//   displayParent,
//   position,
//   radius,
// }: {
//   hasHoverText: ComponentType<ISchema>,
//   isCharacter: ComponentType<ISchema>,
//   removing: ComponentType<ISchema>,
//   displayParent: ComponentType<typeof reference>,
//   position: ComponentType<typeof vector3>,
//   radius: ComponentType<typeof float>,
// }) => (
//   state: IORef<GameState>,
// ) => (
//   addHoverTextFn: IO.IO<number>,
// ): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
//   () => ({
//     hoverableQuery: defineQuery([hasHoverText, position, radius]),
//     characterQuery: defineQuery([isCharacter, position, radius]),
//   }),
//   IO.map((q) => flow(
//     IO.of,
//     IO.chainFirst((w) => pipe(
//       {
//         hoverables: q.hoverableQuery(w),
//         characters: q.characterQuery(w),
//         state: state.read(),
//       },
//       (c) => () => c.characters.forEach((characterId) => pipe(
//         c.hoverables,
//         RA.findFirst((hoverableId) => hoverableId !== characterId
//         && pipe(
//           globalPosition(w)(position)(displayParent),
//           (x) => ({
//             hPos: x(hoverableId),
//             cPos: x(characterId),
//           }),
//           (x) => [
//             x.hPos.x - x.cPos.x,
//             x.hPos.y - x.cPos.y,
//           ],
//           (x) => blas.base.gnrm2(x.length, x, 1),
//         ) < Math.max(radius.v[characterId], radius.v[hoverableId])),
//         hasComponent(w, activeHoverText, characterId) ? O.match(
//           () => pipe(
//             addComponents(w)(activeHoverText.v[characterId])([removing]),
//             IO.apSecond(removeComponents(w)(characterId)([activeHoverText])),
//           ),
//           () => () => {},
//         ) : O.match(
//           () => () => {},
//           (hoveredId) => pipe(
//             addHoverTextFn,
//             IO.chainFirst((t) => state.modify((s): GameState => ({
//               ...s,
//               stringMap: pipe(
//                 s.stringMap.get(hoveredId),
//                 O.fromNullable,
//                 O.match(
//                   () => s.stringMap,
//                   (x) => s.stringMap.set(t, x),
//                 ),
//               ),
//             }))),
//             IO.apFirst(addComponents(w)(characterId)([activeHoverText])),
//             IO.chainFirst((x) => setComponents(x)(
//               [
//                 [position.x, position.x[characterId]],
//                 [position.y, position.y[characterId]],
//               ],
//             )),
//             IO.chainFirst((x) => setComponents(characterId)(
//               [[activeHoverText.v, x]],
//             )),
//           ),
//         ),
//       )()),
//     )),
//   )),
// );
