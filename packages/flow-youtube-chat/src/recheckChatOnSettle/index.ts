import {
  Array as A,
  Effect as Z,
  Option as O,
  SynchronizedRef,
  pipe,
} from 'effect';

import {
  isBannedByName,
  recordAuthor,
} from '@/AuthorNameIndex';
import {
  banEntryFor,
  isBannedAuthor,
} from '@/BanEntry';
import ChatData from '@/ChatData';
import MainState from '@/MainState';
import appendChatMessage from '@/appendChatMessage';
import banButton from '@/banButton';
import checkBannedWords from '@/checkBannedWords';
import isDuplicateChat from '@/isDuplicateChat';
import onElementSettled from '@/onElementSettled';
import parseChat from '@/parseChat';
import renderChat from '@/renderChat';
import strictOptionEquivalence from '@/strictOptionEquivalence';

// Snappier than the capture tool's window: the point is correcting a chat
// that is still on screen, and post-insert stamping lands within a frame
// or two — the deadline only bounds a pathologically restless element.
const quietMs = 500;
const deadlineMs = 2000;

// The parse-time fields that bans, filters and flow rendering consume.
// message innerHTML is deliberately not compared: emoji images swap src
// when they lazy-load, and the flow reads the live element anyway.
export const parseRelevantChanged = (
  a: ChatData,
  b: ChatData,
): boolean => a.authorType !== b.authorType
  || !strictOptionEquivalence(a.authorID, b.authorID)
  || !strictOptionEquivalence(a.authorName, b.authorName)
  || !strictOptionEquivalence(a.messageText, b.messageText)
  || !strictOptionEquivalence(a.timestamp, b.timestamp)
  || !strictOptionEquivalence(a.paymentInfo, b.paymentInfo);

const dropFlowChat = (
  data: ChatData,
  mainState: MainState,
): Z.Effect<void> => SynchronizedRef.updateEffect(
  mainState.flowChats,
  (chats) => pipe(
    A.findFirstIndex(chats, (x) => isDuplicateChat(data, x.data)),
    O.match({
      onNone: () => Z.succeed(chats),
      onSome: (index) => Z.gen(function* () {
        const chat = A.unsafeGet(chats, index);

        yield * chat.animationState.pipe(
          Z.tap((animation) => Z.sync(() => animation.cancel())),
          Z.ignore,
        );

        yield * Z.sync(() => chat.element.remove());

        return A.remove(chats, index);
      }),
    }),
  ),
);

const rerenderFlowChat = (
  data: ChatData,
  mainState: MainState,
): Z.Effect<void> => pipe(
  SynchronizedRef.get(mainState.flowChats),
  Z.map(A.findFirst((x) => isDuplicateChat(data, x.data))),
  Z.flatMap(O.match({
    onNone: () => Z.void,
    onSome: (chat) => pipe(
      // Replaced in place: the entry keeps its element, lane and
      // animation; only the parsed fields refresh before re-rendering.
      Z.sync(() => {
        chat.data = data;
      }),
      Z.zipRight(renderChat(chat)(mainState)),
    ),
  })),
);

const applySettled = (
  chat: HTMLElement,
  data: ChatData,
  mainState: MainState,
): Z.Effect<void> => Z.gen(function* () {
  yield * Z.logDebug('Chat changed after insert, rechecking');
  const authorNames = yield * SynchronizedRef.updateAndGet(
    mainState.authorNames,
    recordAuthor(data),
  );

  const config = mainState.config.value;

  if ((yield * checkBannedWords(data, config))
    || isBannedAuthor(config.bannedUsers)(data)
    || isBannedByName(config.bannedUsers)(authorNames)(data)) {
    chat.style.display = 'none';
    yield * dropFlowChat(data, mainState);

    return;
  }

  yield * rerenderFlowChat(data, mainState);

  yield * banEntryFor(data).pipe(
    O.filter(() => mainState.config.value.createBanButton
      && chat.querySelector('.fyc_button') === null
      && !chat.children.namedItem('card')),
    Z.flatMap((entry: string) => appendChatMessage(
      banButton(entry)(mainState.config.getConfig)(
        mainState.config.setConfig,
      )(chat),
    )(chat)),
    Z.ignore,
  );
});

/**
 * One settled-state recheck for a chat that already went through
 * onChatFieldMutate: wait for the element's post-insert mutations to go
 * quiet, re-parse, and — only if a parse-relevant field changed — redo the
 * steps that consumed it: author-index recording, the ban checks (hiding
 * the element and withdrawing its flowing copy), the flowing chat's data
 * and rendering, and late ban-button attachment. Never creates a flow
 * chat, and never un-hides a chat the insert-time pass hid.
 */
export default (
  chat: HTMLElement,
  initial: ChatData,
  mainState: MainState,
): Z.Effect<void> => pipe(
  Z.async<void>((resume) => {
    onElementSettled(chat, quietMs, deadlineMs, () => {
      resume(Z.void);
    });
  }),
  Z.zipRight(Z.suspend(() => {
    const data = parseChat(chat);

    return parseRelevantChanged(initial, data)
      ? applySettled(chat, data, mainState)
      : Z.void;
  })),
);
