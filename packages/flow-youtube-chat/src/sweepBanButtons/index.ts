import {
  Effect as Z,
  Option as O,
} from 'effect';

import {
  banEntryFor,
} from '@/BanEntry';
import MainState from '@/MainState';
import appendChatMessage from '@/appendChatMessage';
import banButton from '@/banButton';
import parseChat from '@/parseChat';

// Retroactive half of the "Show ban button" toggle: renderers already in
// the chat list gain or lose their button when the setting flips; future
// inserts are handled by onChatFieldMutate and recheckChatOnSettle. One
// shot per toggle, so the sweep re-parses instead of tracking list
// elements — the DOM itself is the state, and the .fyc_button presence
// guard makes both directions idempotent.
export default (
  field: HTMLElement,
  mainState: MainState,
) => (createBanButton: boolean): Z.Effect<void> => (createBanButton
  ? Z.forEach(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    Array.from(field.children) as HTMLElement[],
    (chat) => banEntryFor(parseChat(chat)).pipe(
      O.filter(() => chat.querySelector('.fyc_button') === null),
      Z.flatMap((entry: string) => appendChatMessage(
        banButton(entry)(mainState.config.getConfig)(
          mainState.config.setConfig,
        )(chat),
      )(chat)),
      Z.ignore,
    ),
    {
      discard: true,
    },
  )
  : Z.sync(() => {
    field.querySelectorAll('.fyc_button').forEach((button) => {
      button.remove();
    });
  }));
