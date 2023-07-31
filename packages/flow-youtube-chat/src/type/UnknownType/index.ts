import {
  pipe,
} from 'effect/Function';

import AssignGenericFunction from '@/type/AssignGenericFunction';
import type Type from '@/type/Type';

type UnknownType = {
  tag: 'unknown',
};

export default UnknownType;

export const unknown: UnknownType = {
  tag: 'unknown',
};

export const assignGeneric = (
  f: AssignGenericFunction<Type>,
): AssignGenericFunction<UnknownType> => (
  typeMap,
) => (
  expected,
) => (
  synthed,
) => pipe();
