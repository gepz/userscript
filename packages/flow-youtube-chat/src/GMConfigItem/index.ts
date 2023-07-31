import * as Z from 'effect/Effect';

export default interface GMConfigItem<T1> {
  gmKey: string,
  getValue: Z.Effect<never, never, T1>,
  defaultValue: T1,
  toGm: (x: T1) => GM.Value,
}
