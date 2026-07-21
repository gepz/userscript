import {
  Option as O,
  Array as A,
  Effect as Z,
  String as Str,
  pipe,
} from 'effect';
import {
  html,
  HTMLTemplateResult,
} from 'lit-html';
import {
  styleMap,
} from 'lit-html/directives/style-map.js';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import UserConfig from '@/UserConfig';
import getChatFontSize from '@/getChatFontSize';
import textShadow from '@/textShadow';

const textStyle = {
  fontFamily: 'inherit',
} satisfies Partial<CSSStyleDeclaration>;

const parseMessage = (
  message: Element,
  config: UserConfig,
): {
  vnodes: HTMLTemplateResult[]
  length: number
} => {
  const eleWin = message.ownerDocument.defaultView ?? window;
  const {
    maxChatLength,
  } = config;

  return pipe(
    Array.from(message.childNodes),
    A.mapAccum(0, (
      length,
      node,
    ): [number, O.Option<HTMLTemplateResult>] => (length >= maxChatLength
      ? [length, O.none()]
      : (!config.textOnly && node instanceof eleWin.HTMLImageElement)
        ? [
          length + 1,
          O.some(html`<img style=${styleMap({
            height: '1em',
            width: '1em',
            verticalAlign: 'text-top',
          } satisfies Partial<CSSStyleDeclaration>)} src=${
            node.src.replace(/=w\d+-h\d+-c-k-nd$/, '')
          } alt=${node.alt}>`),
        ]
        : pipe(
          node.textContent ?? '',
          Str.slice(0, maxChatLength),
          (x): [number, O.Option<HTMLTemplateResult>] => [
            length + x.length,
            O.some(node instanceof eleWin.HTMLAnchorElement
              ? html`<span style=${styleMap({
                fontSize: '0.84em',
                textDecoration: 'underline',
                ...textStyle,
              } satisfies Partial<CSSStyleDeclaration>)}>${x}</span>`
              : html`${x}`),
          ],
        ))),
    ([length, vnodes]) => ({
      vnodes: A.getSomes(vnodes),
      length,
    }),
  );
};

export default Z.fnUntraced(function* (
  chat: FlowChat,
  mainState: MainState,
) {
  const {
    data,
  } = chat;

  const config = mainState.config.value;
  const fontSize = yield * getChatFontSize(mainState);

  return html`<span style=${styleMap({
    fontSize: `${fontSize}px`,
    visibility: config.displayChats ? 'visible' : 'hidden',
    color: data.authorType === 'owner'
      ? config.ownerColor
      : data.authorType === 'moderator'
        ? config.moderatorColor
        : data.authorType === 'member'
          ? config.memberColor
          : config.color,
    fontWeight: config.fontWeight.toString(),
    fontFamily: config.font,
    opacity: config.chatOpacity.toString(),
    textShadow: textShadow(config.shadowColor)(
      config.shadowFontWeight,
    ),
  } satisfies Partial<CSSStyleDeclaration>)}>${pipe(
    [
      pipe(
        data.authorName,
        O.filter(() => (
          data.authorType === 'moderator' && config.displayModName
        ) || (
          O.isSome(data.paymentInfo) && config.displaySuperChatAuthor
        )),
        O.map((text) => html`<span style=${styleMap({
          ...O.match(data.textColor, {
            onNone: () => {},
            onSome: (x) => ({
              color: x,
            }),
          }),
          fontSize: '0.84em',
          ...textStyle,
        } satisfies Partial<CSSStyleDeclaration>)}>${text}: </span>`),
      ),
      pipe(
        data.messageElement,
        O.map((x) => parseMessage(
          x,
          config,
        )),
        O.map((text) => html`<span style=${styleMap({
          ...O.match(data.textColor, {
            onNone: () => {},
            onSome: (x) => ({
              color: x,
            }),
          }),
          ...textStyle,
        } satisfies Partial<CSSStyleDeclaration>)}>${text.vnodes}</span>`),
      ),
      pipe(
        data.paymentInfo,
        O.map((text) => html`<span style=${styleMap({
          ...O.match(data.paidColor, {
            onNone: () => {},
            onSome: (x) => ({
              color: x,
            }),
          }),
          fontSize: '0.84em',
          ...textStyle,
        } satisfies Partial<CSSStyleDeclaration>)}><strong style=${
          styleMap(textStyle)
        }></strong> ${text.trim()}</span>`),
      ),
    ],
    A.getSomes,
  )}</span>`;
});
