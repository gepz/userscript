import ConfigItem from '@/ConfigItem';

export default async <T1 extends GM.Value, T2>(
  key: string,
  defaultVal: T2,
  toItem: (x: T1) => T2,
  toGm: (x: T2) => GM.Value,
): Promise<ConfigItem<T2>> => {
  const val = await GM.getValue<T1>(key);
  return ({
    gmKey: key,
    val: val !== undefined ? toItem(val) : defaultVal,
    defaultVal,
    toGm,
  });
};
