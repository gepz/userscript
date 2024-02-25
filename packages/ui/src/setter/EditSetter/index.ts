import Setter from '@/setter/Setter';

export default interface EditSetter<T> {
  (editing: boolean): Setter<string, T>
}

