import { Option as O } from 'effect';
export type DraftError = O.Option<string>;
interface Editable<T> {
    readonly tag: 'Editable';
    readonly value: T;
    readonly edit: O.Option<{
        readonly text: string;
        readonly error: O.Option<DraftError>;
    }>;
}
export default Editable;
export declare const isEditable: (x: unknown) => x is Editable<unknown>;
export declare const of: <T>(value: T) => Editable<T>;
export declare const fromValueText: <T>(v: T) => (t: string) => Editable<T>;
export declare const value: <T>(x: Editable<T>) => T;
export declare const text: <T>(x: Editable<T>) => O.Option<string>;
export declare const error: <T>(x: Editable<T>) => O.Option<DraftError>;
export declare const map: <A, B>(f: (a: A) => B) => (e: Editable<A>) => Editable<B>;
export declare const setValue: <T>(v: T) => (e: Editable<T>) => Editable<T>;
export declare const setText: (t: string) => <T>(e: Editable<T>) => Editable<T>;
export declare const setTextError: (t: string) => (err: string) => <T>(e: Editable<T>) => Editable<T>;
export declare const setTextInvalid: (t: string) => <T>(e: Editable<T>) => Editable<T>;
export declare const hasError: <T>(x: Editable<T>) => boolean;
//# sourceMappingURL=index.d.ts.map