import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';
import * as S from 'fp-ts/string';
import m from 'mithril';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import UserConfigGetter from '@/UserConfigGetter';
import getChatFontSize from '@/getChatFontSize';
import textShadow from '@/textShadow';

const textStyle: Partial<CSSStyleDeclaration> = {
  fontFamily: 'inherit',
};

const parseMessage = (
  message: Element,
  getConfig: UserConfigGetter,
): {
  vnodes: m.Vnode[],
  length: number,
} => {
  const eleWin = message.ownerDocument.defaultView ?? window;
  const maxChatLength = getConfig.maxChatLength();
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
    : (!getConfig.textOnly() && node instanceof eleWin.HTMLImageElement) ? {
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
      S.slice(0, maxChatLength),
      (x) => (node instanceof eleWin.HTMLAnchorElement ? {
        vnodes: [
          ...vnodes,
          m('span', {
            style: {
              fontSize: '0.84em',
              textDecoration: 'underline',
              ...textStyle,
            },
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
    getConfig,
  } = mainState;

  const data = chat.getData(getConfig);
  return m('span', {
    style: {
      fontSize: `${getChatFontSize(mainState)}px`,
      visibility: getConfig.displayChats() ? 'visible' : 'hidden',
      color: data.authorType === 'owner' ? getConfig.ownerColor()
      : data.authorType === 'moderator' ? getConfig.moderatorColor()
      : data.authorType === 'member' ? getConfig.memberColor()
      : getConfig.color(),
      fontWeight: getConfig.fontWeight().toString(),
      fontFamily: getConfig.font(),
      opacity: getConfig.chatOpacity().toString(),
      textShadow: textShadow(getConfig.shadowColor())(
        getConfig.shadowFontWeight(),
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
          },
        }, `${x.content}: `)),
      ),
      pipe(
        data.messageElement,
        O.map((x) => parseMessage(
          x,
          getConfig,
        )),
        O.map((x) => m('span', {
          style: {
            color: O.toUndefined(data.textColor),
            ...textStyle,
          },
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
          },
        }, m('strong', {
          style: textStyle,
        }, x.content))),
      ),
    ],
    RA.compact,
    RA.toArray,
  ));
};
