import ExactTypeKey from '../ExactTypeKey';
import StateDispatchable from '../StateDispatchable';
export default interface BoolUpdater<State, Props, AppCommander> {
    (key: ExactTypeKey<Props, boolean>): (c: AppCommander) => (s: State, e: Event) => StateDispatchable<State>;
}
export declare const make: <State, Props, AppCommander>(updateAt: <K extends keyof Props>(k: K) => (v: Props[K]) => (c: AppCommander) => (s: State) => StateDispatchable<State>) => BoolUpdater<State, Props, AppCommander>;
//# sourceMappingURL=index.d.ts.map