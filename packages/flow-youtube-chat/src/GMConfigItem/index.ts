import * as T from 'fp-ts/Task';

export default interface GMConfigItem<T1> {
  gmKey: string,
  getValue: T.Task<T1>,
  defaultValue: T1,
  toGm: (x: T1) => GM.Value,
}
