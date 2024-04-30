import { Option as O } from 'effect';
type Editable<T> = readonly [
    T,
    O.Option<readonly [string, O.Option<string>]>
];
export default Editable;
export declare const of: <T>(x: T) => Editable<T>;
export declare const fromValueText: <T>(v: T) => (t: string) => Editable<T>;
export declare const value: <T>(x: Editable<T>) => T;
export declare const text: <T>(x: Editable<T>) => O.Option<string>;
export declare const error: <T>(x: Editable<T>) => O.Option<string>;
export declare const setValue: <T>(v: T) => (e: Editable<T>) => Editable<T>;
export declare const setText: <T>(x: string) => (e: Editable<T>) => Editable<T>;
export declare const hasError: <T>(x: Editable<T>) => boolean;
//# sourceMappingURL=index.d.ts.map