import StateDispatchable from '../StateDispatchable';
import { Setter } from '../setter';
export default interface InputUpdater<State, Props, AppCommander> {
    <K extends keyof Props>(key: K): (setter: Setter<string, Props[K]>) => (c: AppCommander) => (s: State, e: Event) => StateDispatchable<State>;
}
export declare const make: <State, Props, AppCommander>(getState: <K extends keyof Props>(k: K) => (s: State) => Props[K], updateAt: <K extends keyof Props>(k: K) => (v: Props[K]) => (c: AppCommander) => (s: State) => StateDispatchable<State>) => InputUpdater<State, Props, AppCommander>;
//# sourceMappingURL=index.d.ts.map