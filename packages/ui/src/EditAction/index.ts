import AppPropertyKeys from '@/AppPropertyKeys';
import AppPropertyValues from '@/AppPropertyValues';
import ComputedProperties from '@/ComputedProperties';
import InputUpdater from '@/InputUpdater';
import StateDispatchable from '@/StateDispatchable';
import EditSetter from '@/setter/EditSetter';

export default interface EditAction<
  State,
  C extends ComputedProperties<State>,
  AppCommander,
> {
  <K extends AppPropertyKeys<State, C, unknown>>(
    key: K,
    setter: EditSetter<AppPropertyValues<State, C, K>>,
  ): (c: AppCommander) => {
    oninput: (s: State, e: Event) => StateDispatchable<State>,
    onchange: (s: State, e: Event) => StateDispatchable<State>,
  }
}

export const make = <State, C extends ComputedProperties<State>, AppCommander>(
  updateInput: InputUpdater<State, C, AppCommander>,
): EditAction<State, C, AppCommander> => (
  key,
  setter,
) => (c: AppCommander) => ({
  oninput: updateInput(key)(setter(true))(c),
  onchange: updateInput(key)(setter(false))(c),
});
