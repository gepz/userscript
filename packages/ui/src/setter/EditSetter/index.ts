import Setter from '@/setter/Setter';

type EditSetter<T> = (editing: boolean) => Setter<string, T>;

export default EditSetter;
