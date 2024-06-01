import { Effect as Z } from 'effect';
import RootComponent from '@/RootComponent';
import WrappedApp from '@/WrappedApp';
declare const _default: <T>(comp: RootComponent<T>, init: T) => Z.Effect<WrappedApp<T>>;
export default _default;
