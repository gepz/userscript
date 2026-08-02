import tapNonNull from '@userscript/tap-non-null';
import {
  Array as A,
} from 'effect';
import {
  Either as E,
} from 'effect';
import {
  Option as O,
} from 'effect';
import {
  SortedMap as SM,
} from 'effect';
import {
  String as Str,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import TaggedValue, {
  makeType,
} from '@/TaggedValue';
import AssignGenericFunction from '@/type/AssignGenericFunction';
import GenericMap, {
  resolveGeneric,
} from '@/type/GenericMap';
import type GenericType from '@/type/GenericType';
import RestType from '@/type/RestType';
import * as restType from '@/type/RestType';
import TargetLowerBoundFunc from '@/type/TargetLowerBoundFunc';
import type Type from '@/type/Type';

type TupleType = TaggedValue<'tuple', readonly (Type | RestType)[]>;

export default TupleType;

export const of = makeType<TupleType>('tuple');

export const list = (x: Type) => of([restType.of(x)]);

// Structural lifting only: pairs elements positionally (rest with rest) and
// delegates the actual generic assignment to f.
export const assignGeneric = (
  f: AssignGenericFunction<Type>,
): AssignGenericFunction<TupleType> => (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => (expected.value.length === synthed.value.length ? pipe(
  A.zip(expected.value, synthed.value),
  A.map(([expectedElement, synthedElement]): O.Option<Type | RestType> => (
    expectedElement.tag === 'rest' && synthedElement.tag === 'rest' ? pipe(
      f(typeMap)(expectedElement.value)(synthedElement.value),
      O.map(restType.of),
    )
    : expectedElement.tag !== 'rest' && synthedElement.tag !== 'rest'
      ? f(typeMap)(expectedElement)(synthedElement)
      : O.none()
  )),
  O.all,
  O.map(of),
) : O.none());

// A candidate alignment of target elements against a prefix of the source
// tuple: the next source index to consume, and the generic lower bounds
// accumulated on the way there.
type MatchState = {
  index: number,
  lowerBound: GenericMap,
};

const emptyLowerBound: GenericMap = SM.empty<
`${number}`,
Exclude<Type, GenericType>
>(Str.Order);

// Right-biased union; combining conflicting bounds for the same generic
// through a type-level semigroup is still open design for the whole checker
// (see the filter-editor WIP entry in docs/backlog.md).
const unionLowerBounds = (a: GenericMap) => (b: GenericMap): GenericMap => pipe(
  A.fromIterable(b),
  A.reduce(a, (acc, [generic, type]) => SM.set(acc, generic, type)),
);

export const targetLowerBound = (
  f: TargetLowerBoundFunc<Type>,
): TargetLowerBoundFunc<TupleType> => (
  target,
) => (
  source,
) => {
  const {
    type: sourceType,
    map: sourceMap,
  } = resolveGeneric(source);
  if (sourceType.tag !== 'tuple') {
    return E.left(
      `Type ${sourceType.tag} is not assignable to type ${target.type.tag}`,
    );
  }
  const sourceElements = sourceType.value;
  const advance = (
    state: MatchState,
  ) => (
    bound: GenericMap,
  ): MatchState => ({
    index: state.index + 1,
    lowerBound: unionLowerBounds(state.lowerBound)(bound),
  });
  const matchNonRest = (
    targetElement: Type,
  ) => (
    state: MatchState,
  ): E.Either<MatchState, string> => pipe(
    A.get(sourceElements, state.index),
    E.fromOption(() => 'Source has too few elements'),
    E.filterOrLeft(
      (x): x is Type => x.tag !== 'rest',
      () => 'Rest element type is not assignable to non-rest type',
    ),
    E.flatMap((sourceElement) => f({
      map: target.map,
      type: targetElement,
    })({
      map: sourceMap,
      type: sourceElement,
    })),
    E.map(advance(state)),
  );
  // A rest target element may consume any number of source elements, so every
  // prefix it accepts yields a candidate state (including the empty prefix).
  // The scan stops at the first element it rejects; that rejection is kept as
  // a recorded failure.
  const matchRest = (
    elementType: Type,
  ) => (
    state: MatchState,
  ): readonly E.Either<MatchState, string>[] => pipe(
    A.unfold(
      O.some(state),
      (current: O.Option<MatchState>) => O.map(current, (currentState) => pipe(
        A.get(sourceElements, currentState.index),
        E.fromOption(() => 'Source has too few elements'),
        E.flatMap((sourceElement) => f({
          map: target.map,
          type: elementType,
        })({
          map: sourceMap,
          type: sourceElement.tag === 'rest'
            ? sourceElement.value
            : sourceElement,
        })),
        E.map(advance(currentState)),
        (element) => [element, O.getRight(element)] as const,
      )),
    ),
    A.prepend(E.right(state)),
  );
  const initial: readonly [readonly string[], readonly MatchState[]] = [
    [],
    [{
      index: 0,
      lowerBound: emptyLowerBound,
    }],
  ];
  return pipe(
    target.type.value,
    A.reduce(initial, ([failures, states], targetElement) => (
      A.isEmptyReadonlyArray(states) ? [failures, states] as const : pipe(
        states,
        A.flatMap(targetElement.tag === 'rest'
          ? matchRest(targetElement.value)
          : (state) => [matchNonRest(targetElement)(state)]),
        A.separate,
        ([stepFailures, nextStates]) => [
          A.appendAll(failures, stepFailures),
          // Candidate states meeting at the same source index collapse to the
          // first; alternative lower bounds at that index are dropped.
          A.dedupeWith(nextStates, (x, y) => x.index === y.index),
        ] as const,
      )
    )),
    ([failures, states]) => pipe(
      states,
      A.findFirst((state) => state.index >= sourceElements.length),
      O.map((state) => E.right(state.lowerBound)),
      O.getOrElse(() => E.left(A.isNonEmptyReadonlyArray(states)
        ? 'Source has too many elements'
        : tapNonNull(
          failures[0],
          'Defect: no failure recorded for a failed match',
        ))),
    ),
  );
};
