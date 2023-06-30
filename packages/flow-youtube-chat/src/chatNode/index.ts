import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Str from '@effect/data/String';
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
    RA.reduce(initResult, ({
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
  mainState.config,
  (config) => ({
    data: chat.getData(config),
    config,
  }),
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
        O.filter((x) => x.visible),
        O.map((x) => html`<span style=${styleMap({
          color: O.getOrUndefined(data.textColor),
          fontSize: '0.84em',
          ...textStyle,
        } satisfies Partial<CSSStyleDeclaration>)}>${x.content}</span>`),
      ),
      pipe(
        data.messageElement,
        O.map((x) => parseMessage(
          x,
          config,
        )),
        O.map((x) => html`<span style=${styleMap({
          color: O.getOrUndefined(data.textColor),
          ...textStyle,
        } satisfies Partial<CSSStyleDeclaration>)}>${x.vnodes}</span>`),
      ),
      pipe(
        data.paymentInfo,
        O.filter((x) => x.visible),
        O.map((x) => html`<span style=${styleMap({
          color: O.getOrUndefined(data.paidColor),
          fontSize: '0.84em',
          ...textStyle,
        } satisfies Partial<CSSStyleDeclaration>)}><strong style=${
          styleMap(textStyle)
        }></strong>${x.content}</span>`),
      ),
    ],
    RA.compact,
  )}</span>`,
);
