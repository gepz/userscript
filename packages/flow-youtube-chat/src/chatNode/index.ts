import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import * as Str from 'fp-ts/string';
import m from 'mithril';

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
  vnodes: m.Vnode[],
  length: number,
} => {
  const eleWin = message.ownerDocument.defaultView ?? window;
  const {
    maxChatLength,
  } = config;

  const initResult: {
    vnodes: m.Vnode[],
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
        m('img', {
          style: {
            height: '1em',
            width: '1em',
            verticalAlign: 'text-top',
          },
          src: node.src,
          alt: node.alt,
        }),
      ],
      length: length + 1,
    }
    : pipe(
      node.textContent ?? '',
      Str.slice(0, maxChatLength),
      (x) => (node instanceof eleWin.HTMLAnchorElement ? {
        vnodes: [
          ...vnodes,
          m('span', {
            style: {
              fontSize: '0.84em',
              textDecoration: 'underline',
              ...textStyle,
            } satisfies Partial<CSSStyleDeclaration>,
          }, x),
        ],
        length: length + x.length,
      }
      : {
        vnodes: [...vnodes, m.fragment({}, x)],
        length: length + x.length,
      }),
    ))),
  );
};

export default (
  chat: FlowChat,
  mainState: MainState,
): m.Vnode => {
  const {
    config,
  } = mainState;

  const data = chat.getData(config);
  return m('span', {
    style: {
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
    },
  }, pipe(
    [
      pipe(
        data.authorName,
        O.filter((x) => x.visible),
        O.map((x) => m('span', {
          style: {
            color: O.toUndefined(data.textColor),
            fontSize: '0.84em',
            ...textStyle,
          } satisfies Partial<CSSStyleDeclaration>,
        }, `${x.content}: `)),
      ),
      pipe(
        data.messageElement,
        O.map((x) => parseMessage(
          x,
          config,
        )),
        O.map((x) => m('span', {
          style: {
            color: O.toUndefined(data.textColor),
            ...textStyle,
          } satisfies Partial<CSSStyleDeclaration>,
        }, x.vnodes)),
      ),
      pipe(
        data.paymentInfo,
        O.filter((x) => x.visible),
        O.map((x) => m('span', {
          style: {
            color: O.toUndefined(data.paidColor),
            fontSize: '0.84em',
            ...textStyle,
          } satisfies Partial<CSSStyleDeclaration>,
        }, m('strong', {
          style: textStyle,
        }, x.content))),
      ),
    ],
    RA.compact,
    RA.toArray,
  ));
};
