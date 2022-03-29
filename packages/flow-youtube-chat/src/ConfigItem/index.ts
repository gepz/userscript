export default interface ConfigItem<T> {
  gmKey: string,
  val: T,
  defaultVal: T,
  toGm: (x: T) => GM.Value,
}
