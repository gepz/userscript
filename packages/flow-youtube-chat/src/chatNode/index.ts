import {
  Option as O,
  Array as A,
  String as Str,
} from 'effect';
import {
  pipe,
} from 'effect/Function';
import {
  html,
  HTMLTemplateResult,
} from 'lit-html';
// eslint-disable-next-line import-newlines/enforce
import {
  styleMap,
  // eslint-disable-next-line import/extensions
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
  vnodes: HTMLTemplateResult[],
  length: number,
} => {
  const eleWin = message.ownerDocument.defaultView ?? window;
  const {
    maxChatLength,
  } = config;

  const initResult: {
    vnodes: HTMLTemplateResult[],
    length: number,
  } = {
    vnodes: [],
    length: 0,
  };

  return pipe(
    Array.from(message.childNodes),
    A.reduce(initResult, ({
      vnodes,
      length,
    }, node) => (length >= maxChatLength ? {
      vnodes,
      length,
    }
    : (!config.textOnly && node instanceof eleWin.HTMLImageElement) ? {
      vnodes: [
        ...vnodes,
        html`<img style=${styleMap({
          height: '1em',
          width: '1em',
          verticalAlign: 'text-top',
        } satisfies Partial<CSSStyleDeclaration>)} src=${
          node.src.replace(/=w\d+-h\d+-c-k-nd$/, '')
        } alt=${node.alt}>`,
      ],
      length: length + 1,
    }
    : pipe(
      node.textContent ?? '',
      Str.slice(0, maxChatLength),
      (x) => (node instanceof eleWin.HTMLAnchorElement ? {
        vnodes: [
          ...vnodes,
          html`<span style=${styleMap({
            fontSize: '0.84em',
            textDecoration: 'underline',
            ...textStyle,
          } satisfies Partial<CSSStyleDeclaration>)}>${x}</span>`,
        ],
        length: length + x.length,
      }
      : {
        vnodes: [...vnodes, html`${x}`],
        length: length + x.length,
      }),
    ))),
  );
};

export default (
  chat: FlowChat,
  mainState: MainState,
): HTMLTemplateResult => pipe(
  {
    data: chat.data,
    config: mainState.config.value,
  },
  ({
    data,
    config,
  }) => html`<span style=${styleMap({
    fontSize: `${getChatFontSize(mainState)}px`,
    visibility: config.displayChats ? 'visible' : 'hidden',
    color: data.authorType === 'owner' ? config.ownerColor
    : data.authorType === 'moderator' ? config.moderatorColor
    : data.authorType === 'member' ? config.memberColor
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
  )}</span>`,
);
