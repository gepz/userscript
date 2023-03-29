import chainFilterMapElse from '@/chainFilterMapElse';

export default <T1>(tag: keyof T1) => <T2 extends T1, R>(
  f: (x: T2) => R,
) => <E, T3 extends T1>(
  t: T2[keyof T1],
) => chainFilterMapElse<T2 | T3, T2>((x): x is T2 => x[tag] === t)<R, E>(f);
