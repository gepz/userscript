import InputUpdater from '@/InputUpdater';
import StateDispatchable from '@/StateDispatchable';
import EditSetter from '@/setter/EditSetter';

export default interface EditAction<
  State,
  Props,
  AppCommander,
> {
  <K extends keyof Props>(
    key: K,
    setter: EditSetter<Props[K]>,
  ): (c: AppCommander) => {
    oninput: (s: State, e: Event) => StateDispatchable<State>,
    onchange: (s: State, e: Event) => StateDispatchable<State>,
  }
}

export const make = <State, Props, AppCommander>(
  updateInput: InputUpdater<State, Props, AppCommander>,
): EditAction<State, Props, AppCommander> => (
  key,
  setter,
) => (c: AppCommander) => ({
  oninput: updateInput(key)(setter(true))(c),
  onchange: updateInput(key)(setter(false))(c),
});

