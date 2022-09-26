import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import {
  pipe,
  identity,
} from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as Str from 'fp-ts/string';
import {
  h,
  text,
  Dispatchable,
  Effect,
} from 'hyperapp';

import MainComponentState from '@/MainComponentState';
import makeRootComponent from '@/makeRootComponent';

const fontSize = 5;

export default makeRootComponent<MainComponentState>(
  (tag) => (state) => h(tag, {}, [
    h('input', {
      type: 'file',
      onchange: (s, e: Event) => pipe(
        e.currentTarget,
        O.fromPredicate(
          (x): x is HTMLInputElement => x instanceof HTMLInputElement,
        ),
        O.chainNullableK((x) => x.files?.item(0)),
        O.map((x) => () => createImageBitmap(x)),
        O.sequence(T.ApplicativeSeq),
        TO.bindTo('uploadedImage'),
        TO.apS('characters', pipe(
          // eslint-disable-next-line max-len
          '　。、；」「＝ー＋＿１２３４５６７８９０！＠＃＄％＾＆＊（）｜～あ亜哀挨愛曖悪握圧扱宛嵐安案暗い以衣位囲医依委威為畏胃尉異移萎偉椅彙意違維慰遺緯域育一壱逸茨芋引印因咽姻員院淫陰飲隠韻う右宇羽雨唄鬱畝浦運雲え永泳英映栄営詠影鋭衛易疫益液駅悦越謁閲円延沿炎怨宴媛援園煙猿遠鉛塩演縁艶お汚王凹央応往押旺欧殴桜翁奥横岡屋億憶臆虞乙俺卸音恩温穏か下化火加可仮何花佳価果河苛科架夏家荷華菓貨渦過嫁暇禍靴寡歌箇稼課蚊牙瓦我画芽賀雅餓介回灰会快戒改怪拐悔海界皆械絵開階塊楷解潰壊懐諧貝外劾害崖涯街慨蓋該概骸垣柿各角拡革格核殻郭覚較隔閣確獲嚇穫学岳楽額顎掛潟括活喝渇割葛滑褐轄且株釜鎌刈干刊甘汗缶完肝官冠巻看陥乾勘患貫寒喚堪換敢棺款間閑勧寛幹感漢慣',
          (x) => [...x],
          TO.of,
        )),
        TO.bind('characterImageData', (ctx) => pipe(
          ctx.characters,
          RA.map((char) => pipe(
            document.createElement('canvas'),
            IO.of,
            IO.chainFirst((x) => () => {
              // eslint-disable-next-line no-param-reassign
              x.width = fontSize;
              // eslint-disable-next-line no-param-reassign
              x.height = fontSize;
            }),
            IO.map((x) => x.getContext('2d')),
            IO.map(O.fromNullable),
            IOO.chainFirstIOK((x) => () => {
              // eslint-disable-next-line no-param-reassign
              x.fillStyle = '#ffffff';
              x.fillRect(0, 0, x.canvas.width, x.canvas.height);
              // eslint-disable-next-line no-param-reassign
              x.textAlign = 'left';
              // eslint-disable-next-line no-param-reassign
              x.textBaseline = 'ideographic';
              // eslint-disable-next-line no-param-reassign
              x.font = `${fontSize}px sans-serif`;
              // eslint-disable-next-line no-param-reassign
              x.fillStyle = '#000000';
              // eslint-disable-next-line no-param-reassign
              x.filter = `blur(${fontSize / 10}px)`;
              // eslint-disable-next-line no-param-reassign
              x.filter = '';
              x.fillText(char, 0, fontSize);
            }),
            IOO.map((x) => x.getImageData(0, 0, fontSize, fontSize)),
            T.fromIO,
          )),
          TO.sequenceArray,
        )),
        TO.bind('displayContext', ({
          uploadedImage: image,
        }) => pipe(
          document.createElement('canvas'),
          IO.of,
          IO.chainFirst((x) => () => {
            // eslint-disable-next-line no-param-reassign
            x.width = 600;
            // eslint-disable-next-line no-param-reassign
            x.height = 600 * image.height / image.width;
          }),
          IO.map((x) => x.getContext('2d')),
          IO.map(O.fromNullable),
          IOO.chainFirstIOK((x) => () => x.drawImage(
            image,
            0,
            0,
            x.canvas.width,
            x.canvas.height,
          )),
          T.fromIO,
        )),
        TO.let(
          'closestText',
          (ctx) => pipe(
            ctx.displayContext.getImageData(
              0,
              0,
              ctx.displayContext.canvas.width,
              ctx.displayContext.canvas.height,
            ).data,
            (data) => pipe(
              RNEA.range(0, (ctx.displayContext.canvas.height / fontSize) - 1),
              RNEA.map(() => RNEA.range(
                0,
                (ctx.displayContext.canvas.width / fontSize) - 1,
              )),
              RNEA.mapWithIndex((row, rowArray) => pipe(
                rowArray,
                RNEA.map(
                  (col) => pipe(
                    RNEA.range(0, ctx.characterImageData.length - 1),
                    RNEA.map(() => RNEA.range(0, (fontSize * fontSize) - 1)),
                    RNEA.mapWithIndex((charIndex, a) => pipe(
                      a,
                      RNEA.map((x) => (0.299 * (
                        ctx.characterImageData[charIndex].data[x * 4] - data[
                          ((ctx.displayContext.canvas.width
                            * ((row * fontSize) + Math.floor(x / fontSize)))
                          + ((col * fontSize) + (x % fontSize))) * 4
                        ]
                      )) + (0.587 * (
                        ctx.characterImageData[charIndex].data[(x * 4) + 1]
                         - data[
                           (((ctx.displayContext.canvas.width
                            * ((row * fontSize) + Math.floor(x / fontSize)))
                          + ((col * fontSize) + (x % fontSize))) * 4) + 1
                         ]
                      )) + (0.114 * (
                        ctx.characterImageData[charIndex].data[(x * 4) + 2]
                         - data[
                           (((ctx.displayContext.canvas.width
                            * ((row * fontSize) + Math.floor(x / fontSize)))
                          + ((col * fontSize) + (x % fontSize))) * 4) + 2
                         ]
                      ))),
                      RNEA.foldMap(N.SemigroupSum)(identity),
                      Math.abs,
                    ) + pipe(
                      a,
                      RNEA.map((x) => Math.abs(0.299 * (
                        ctx.characterImageData[charIndex].data[x * 4] - data[
                          ((ctx.displayContext.canvas.width
                            * ((row * fontSize) + Math.floor(x / fontSize)))
                          + ((col * fontSize) + (x % fontSize))) * 4
                        ]
                      )) + Math.abs(0.587 * (
                        ctx.characterImageData[charIndex].data[(x * 4) + 1]
                         - data[
                           (((ctx.displayContext.canvas.width
                            * ((row * fontSize) + Math.floor(x / fontSize)))
                          + ((col * fontSize) + (x % fontSize))) * 4) + 1
                         ]
                      )) + Math.abs(0.114 * (
                        ctx.characterImageData[charIndex].data[(x * 4) + 2]
                         - data[
                           (((ctx.displayContext.canvas.width
                            * ((row * fontSize) + Math.floor(x / fontSize)))
                          + ((col * fontSize) + (x % fontSize))) * 4) + 2
                         ]
                      ))),
                      RNEA.foldMap(N.SemigroupSum)(identity),
                      (x) => x * 0.3,
                    )),
                    RNEA.zip(RNEA.range(0, ctx.characterImageData.length - 1)),
                    RNEA.min(Ord.tuple(N.Ord, N.Ord)),
                    ([, x]) => ctx.characters[x],
                  ),
                ),
              )),
              RNEA.map(RNEA.foldMap(Str.Semigroup)(identity)),
              RNEA.intercalate(Str.Semigroup)('\n'),
            ),
          ),
        ),
        (newState): Effect<MainComponentState> => (dispatch) => pipe(
          newState,
          T.chainIOK((x) => () => dispatch(x)),
        )(),
        (x): Dispatchable<MainComponentState> => [
          s,
          x,
        ],
      ),
    }),
    h('img', {
      src: pipe(
        state,
        O.map((x) => x.displayContext),
        O.map((x) => x.canvas.toDataURL()),
        O.getOrElse(() => ''),
      ),
      style: {
        width: '300px',
      },
    }),
    h('div', {
      style: {
        width: '300px',
        font: `${fontSize}px sans-serif`,
        lineHeight: `${fontSize}px`,
        whiteSpace: 'pre',
      },
    }, pipe(
      state,
      O.map((x) => x.closestText),
      O.getOrElse(() => ''),
      text,
    )),
  ]),
)('div');
