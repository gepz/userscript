import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/Predicate';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
  identity,
  apply,
} from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as S from 'fp-ts/string';
import {
  h,
  text,
  VNode,
  StyleProp,
  Effect,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import TextByLang from '@/TextByLang';
import {
  TypeKey,
} from '@/TypeKey';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
// import filterPanel from '@/filterPanel';
import flip from '@/flip';
import fonts from '@/fonts';
import getText from '@/getText';
import languageLabels from '@/languageLabels';
import languages from '@/languages';
import textShadow from '@/textShadow';
import checkboxRow from '@/ui/checkboxRow';
import colorInput from '@/ui/colorInput';
import colorPicker from '@/ui/colorPicker';
import colorTextOutput from '@/ui/colorTextOutput';
import getChecked from '@/ui/getChecked';
import getValue from '@/ui/getValue';
import option from '@/ui/option';
import panelBoxStyle from '@/ui/panelBoxStyle';
import rangeRow from '@/ui/rangeRow';
import settingRow from '@/ui/settingRow';
import tabContainer from '@/ui/tabContainer';
import textAreaRow from '@/ui/textAreaRow';
import textColorRow from '@/ui/textColorRow';

const textRowStyle: StyleProp = {
  width: '70%',
  boxSizing: 'border-box',
};

const exampleTextStyle = (s: SettingState): StyleProp => ({
  fontFamily: s.font,
  fontWeight: s.fontWeight.toString(),
  textShadow: textShadow(s.shadowColor)(s.shadowFontWeight),
});

const computed = {
  useStepTiming: (s: SettingState) => Boolean(
    s.timingFunction.match(/^steps\(.+/),
  ),
};

const stepTiming: R.Reader<number, string> = (
  stepCount,
) => `steps(${stepCount}, jump-end)`;

type StateKey<T> = TypeKey<SettingState, T>
| TypeKey<typeof computed, (s: SettingState) => T>;

type SettingDispatchable = [s: SettingState, ...e: Effect<SettingState>[]];

const configEffect = <T extends keyof UserConfig>(
  k: T,
  v: UserConfig[T]['val'],
): R.Reader<UserConfigSetter, Effect<SettingState>> => (
  setConfig,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
) => [() => setConfig[k](v as never), undefined];

type Config = {
  command: AppCommander,
  state: SettingState,
};

const setRange = (
  keyA: TypeKey<SettingState, number> & keyof UserConfig,
) => (
  keyB: TypeKey<SettingState, number> & keyof UserConfig,
) => (
  bFn: (vA: number) => (vB: number) => number,
) => (
  vA: number,
): R.Reader<Config, SettingDispatchable> => (c) => pipe(
  bFn(vA)(c.state[keyB]),
  (newB) => pipe(
    [
      configEffect(keyA, vA),
      configEffect(keyB, newB),
    ],
    R.sequenceArray,
    R.map((effects): SettingDispatchable => [
      {
        ...c.state,
        [keyA]: vA,
        [keyB]: newB,
      },
      ...effects,
    ]),
  )(c.command.setConfig),
);

const setState: Partial<{
  [K in keyof SettingState]: (
    v: SettingState[K]
  ) => R.Reader<Config, SettingDispatchable>
}> = {
  flowY1: setRange('flowY1')('flowY2')((a) => (b) => Math.max(b, a + 0.05)),
  flowY2: setRange('flowY2')('flowY1')((a) => (b) => Math.min(b, a - 0.05)),
  flowX1: setRange('flowX1')('flowX2')((a) => (b) => Math.max(b, a + 0.05)),
  flowX2: setRange('flowX2')('flowX1')((a) => (b) => Math.min(b, a - 0.05)),
  timingStepCount: (v) => (c) => pipe(
    stepTiming(v),
    (timingFunction) => [
      {
        ...c.state,
        timingStepCount: v,
        timingFunction,
      },
      configEffect('timingFunction', timingFunction)(c.command.setConfig),
    ],
  ),
  bannedWordRegexs: (v) => (c) => pipe(
    v,
    RA.reduce({
      valid: true,
      error: '',
    }, (acc, cur) => {
      try {
        RegExp(cur, 'u');
        return acc;
      } catch (e) {
        return {
          valid: false,
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          error: `${acc.error}${e} in ${cur};`,
        };
      }
    }),
    (x) => [
      {
        ...c.state,
        bannedWordRegexs: v,
        bannedWordRegexsError: x.error,
        bannedWordRegexsValid: x.valid,
      },
      ...x.valid ? [configEffect('bannedWordRegexs', v)(c.command.setConfig)]
      : [],
    ],
  ),
};

const setComputed: {
  [K in keyof typeof computed]: (
    v: ReturnType<(typeof computed)[K]>
  ) => R.Reader<Config, SettingDispatchable>
} = {
  useStepTiming: (v) => (c) => pipe(
    v ? stepTiming(c.state.timingStepCount)
    : 'linear',
    (timingFunction) => [
      {
        ...c.state,
        timingFunction,
      },
      configEffect('timingFunction', timingFunction)(c.command.setConfig),
    ],
  ),
};

const doAct = ({
  copy: async (c: Config) => {
    GM.setClipboard(c.state.eventLog.join('\n'));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearFlowChats: async (c: Config) => {
    c.command.act.clearFlowChats();
  },
});

const getTrueState = <T>(k: StateKey<T>, s: SettingState): T => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  k in computed ? computed[
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as TypeKey<typeof computed, (s: SettingState) => T>
  ](s) as unknown as T
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : s[k as TypeKey<SettingState, T>] as unknown as T
);

const getState = <T>(k: StateKey<T>): R.Reader<SettingState, T> => (s) => (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  s.editingInput.id === k ? (s.editingInput.committedState as T)
  : getTrueState(k, s)
);

const updateAt = <T>(
  k: StateKey<T>,
  v: T,
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
): R.Reader<Config, SettingDispatchable> => (k in setComputed ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  setComputed[k as keyof typeof setComputed] as (
    v: unknown
  ) => R.Reader<Config, SettingDispatchable>
)(v)
: k in setState ? (
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  setState[k as keyof typeof setState] as (
    v: unknown
  ) => R.Reader<Config, SettingDispatchable>
)(v) : (c) => [
  {
    ...c.state,
    [k]: v,
  },
  ...(k in c.command.setConfig) ? [
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    configEffect(k as keyof UserConfigSetter, v as never)(
      c.command.setConfig,
    ),
  ]
  : [],
]);

const updateString = (
  key: StateKey<string>,
): R.Reader<Config, (s: SettingState, e: Event) => SettingDispatchable> => flip(
  (s, e) => pipe(
    getValue(e),
    (x) => updateAt(key, x),
  ),
);

const updateNumber = (
  key: StateKey<number>,
): R.Reader<Config, (s: SettingState, e: Event) => SettingDispatchable> => flip(
  (s, e) => pipe(
    getValue(e),
    parseFloat,
    (x) => updateAt(key, x),
  ),
);

const updateInt = (
  key: StateKey<number>,
): R.Reader<Config, (s: SettingState, e: Event) => SettingDispatchable> => flip(
  (s, e) => pipe(
    getValue(e),
    (x) => parseInt(x, 10),
    (x) => updateAt(key, x),
  ),
);

const updateBool = (
  key: StateKey<boolean>,
): R.Reader<Config, (s: SettingState, e: Event) => SettingDispatchable> => flip(
  (s, e) => pipe(
    getChecked(e),
    (x) => updateAt(key, x),
  ),
);

const updateStrings = (
  key: StateKey<readonly string[]>,
): R.Reader<Config, (s: SettingState, e: Event) => SettingDispatchable> => flip(
  (s, e) => pipe(
    getValue(e),
    flow(
      S.split(/\r\n|\n/),
      RA.filter(P.not(S.isEmpty)),
    ),
    (x) => updateAt(key, x),
  ),
);

const editAction = <T>(
  key: StateKey<T>,
  onchange: (k: StateKey<T>) => R.Reader<
  Config,
  (s: SettingState, e: Event) => SettingDispatchable
  >,
) => (c: Config) => ({
  onfocus: (s: SettingState, e: Event) => updateAt<typeof s.editingInput>(
    'editingInput',
    {
      id: key,
      committedState: getTrueState(key, s),
      value: getValue(e),
    },
  )(c),
  onblur: (s: SettingState) => updateAt<typeof s.editingInput>(
    'editingInput',
    {
      id: '',
      committedState: '',
      value: '',
    },
  )(c),
  oninput: (s: SettingState, e: Event) => updateAt<typeof s.editingInput>(
    'editingInput',
    {
      id: key,
      committedState: s.editingInput.committedState,
      value: getValue(e),
    },
  )(c),
  onchange: (
    s: SettingState,
    e: Event,
  ): SettingDispatchable => {
    const [s1, ...es1] = onchange(key)(c)(s, e);
    const x: typeof s1.editingInput = s1.editingInput.id === key ? {
      id: key,
      committedState: getTrueState(key, s1),
      value: getValue(e),
    } : s1.editingInput;

    const [s2, ...es2] = updateAt('editingInput', x)({
      ...c,
      state: s1,
    });

    return [s2, ...es1, ...es2];
  },
});

const getEditValue = <T>(
  k: StateKey<T>,
  t: (x: T) => string,
): R.Reader<SettingState, string> => (s) => (
  (s.editingInput.id === k) ? s.editingInput.value
  : t(getState(k)(s))
);

const checkboxNode = (
  label: keyof TextByLang
  & StateKey<boolean>,
): R.Reader<Config, VNode<SettingState>> => (c) => checkboxRow(
  getText(label)(c.state.lang),
  getState<boolean>(label)(c.state),
  updateBool(label)(c),
);

const textColorNode = (
  label: keyof TextByLang
  & StateKey<string>,
): R.Reader<Config, VNode<SettingState>> => (
  c,
) => settingRow(getText(label)(c.state.lang), [
  textColorRow<SettingState>(pipe(
    editAction(label, updateString)(c),
    (x) => [
      colorPicker(x),
      colorInput(x),
      colorTextOutput(exampleTextStyle(c.state)),
    ],
  ))(getEditValue<string>(label, identity)(c.state)),
]);

const colorNode = (
  label: keyof TextByLang
  & StateKey<string>,
): R.Reader<Config, VNode<SettingState>> => (
  c,
) => settingRow(getText(label)(c.state.lang), [
  textColorRow<SettingState>(pipe(
    [
      colorPicker,
      colorInput,
    ],
    RA.map((f) => f(editAction(label, updateString)(c))),
  ))(getEditValue<string>(label, identity)(c.state)),
]);

const intNode = (
  label: keyof TextByLang
  & StateKey<number>,
  min: number,
  max: number,
  step: number,
): R.Reader<Config, VNode<SettingState>> => (
  c,
) => settingRow(getText(label)(c.state.lang), [
  rangeRow(
    min,
    max,
    step,
    getEditValue<number>(label, N.Show.show)(c.state),
    c.state.editingInput.id === label,
    editAction(label, updateInt)(c),
  ),
]);

const numberNode = (
  label: keyof TextByLang
  & StateKey<number>,
  min: number,
  max: number,
  step: number,
): R.Reader<Config, VNode<SettingState>> => (
  c,
) => settingRow(getText(label)(c.state.lang), [
  rangeRow(
    min,
    max,
    step,
    getEditValue<number>(label, N.Show.show)(c.state),
    c.state.editingInput.id === label,
    editAction(label, updateNumber)(c),
  ),
]);

const buttonNode = (
  label: keyof TextByLang
  & TypeKey<typeof doAct, (c: Config) => Promise<void>>,
): R.Reader<Config, VNode<SettingState>> => (
  c,
) => h('button', {
  type: 'button',
  onclick: (s) => [
    s,
    [() => doAct[label](c), undefined],
  ],
}, text(getText(label)(c.state.lang)));

const textAreaNode = (
  label: keyof TextByLang
  & StateKey<readonly string[]>,
  rows: number,
): R.Reader<Config, VNode<SettingState>> => (
  c,
) => settingRow(getText(label)(c.state.lang), [
  textAreaRow(
    rows,
    getEditValue<readonly string[]>(label, (x) => x.join('\n'))(c.state),
    editAction(label, updateStrings)(c),
  ),
]);

const selectFontNode: R.Reader<Config, VNode<SettingState>> = (
  c,
) => settingRow(getText('font')(c.state.lang), [
  h('select', {
    style: textRowStyle,
    onchange: updateString('font')(c),
  }, pipe(
    fonts(c.state.font),
    RA.findIndex((x) => x[0] === c.state.font),
    O.getOrElse(() => 0),
    (index) => pipe(
      fonts(c.state.font),
      RA.mapWithIndex((i, font) => option(
        font[0],
        pipe(
          languages,
          RA.findIndex((x) => x === c.state.lang),
          O.map((x) => font[x + 1]),
          O.getOrElse(() => 'Error'),
        ),
        i === index,
      )),
    ),
  )),
  h('input', {
    style: textRowStyle,
    maxlength: 20,
    value: c.state.font,
    oninput: updateString('font')(c),
  }),
]);

const stepTimingNode: R.Reader<Config, VNode<SettingState>> = (
  c,
) => h('div', {}, [
  checkboxNode('useStepTiming')(c),
  h('div', {
    style: {
      ...(getState<boolean>('useStepTiming')(c.state) ? {}
      : {
        opacity: '0.5',
      }),
    },
  }, intNode('timingStepCount', 1, 400, 1)(c)),
]);

const flowChatPanel: R.Reader<Config, VNode<SettingState>[]> = (c) => [
  h('div', {
    style: panelBoxStyle(212),
  }, pipe(
    [
      selectFontNode,
      textColorNode('color'),
      textColorNode('ownerColor'),
      textColorNode('moderatorColor'),
      textColorNode('memberColor'),
      colorNode('shadowColor'),
    ],
    RA.map(apply(c)),
  )),
  h('div', {
    style: panelBoxStyle(212),
  }, pipe(
    [
      numberNode('chatOpacity', 0, 1, 0.05),
      numberNode('fontSize', 0.3, 2, 0.05),
      numberNode('fontWeight', 10, 1e3, 10),
      numberNode('shadowFontWeight', 0, 3, 0.1),
      numberNode('flowSpeed', 1, 50, 1),
      intNode('maxChatCount', 5, 200, 5),
      intNode('maxChatLength', 5, 200, 5),
      intNode('laneCount', 1, 25, 1),
    ],
    RA.map(apply(c)),
  )),
  h('div', {
    style: panelBoxStyle(212),
  }, pipe(
    [
      numberNode('flowY1', 0, 0.95, 0.01),
      numberNode('flowY2', 0.05, 1, 0.01),
      numberNode('flowX1', 0, 0.95, 0.01),
      numberNode('flowX2', 0.05, 1, 0.01),
      numberNode('minSpacing', 0, 2.5, 0.1),
      stepTimingNode,
      checkboxNode('createChats'),
      checkboxNode('displayModName'),
      checkboxNode('displaySuperChatAuthor'),
      checkboxNode('textOnly'),
      (x: Config) => text(getText('flowNewChatIf')(x.state.lang)),
      checkboxNode('noOverlap'),
      // ...pipe(
      //   state.displayMatrix,
      //   RA.map(RA.map((y) => h<SettingState>('span', {
      //     style: {
      //       background: y ? '#000' : '#333',
      //       color: y ? '#fff' : '#999',
      //     },
      //   }, text(y)))),
      //   RA.map((x) => h('div', {
      //     style: {
      //       display: 'grid',
      //       gridTemplateColumns: '1fr 1fr 1fr',
      //     },
      //   }, x)),
      // ),
      buttonNode('clearFlowChats'),
    ],
    RA.map(apply(c)),
  )),
];

const filterPanel: R.Reader<Config, VNode<SettingState>[]> = (c) => [
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode('bannedWords', 18)(c)),
  h('div', {
    style: panelBoxStyle(212),
  }, settingRow(getText('bannedWordRegexs')(c.state.lang), [
    h('span', {}, text(c.state.bannedWordRegexsValid ? ''
    : `${getText('error')(c.state.lang)}: ${
      c.state.bannedWordRegexsError
    }`)),
    textAreaRow(
      18,
      getEditValue<readonly string[]>(
        'bannedWordRegexs',
        (x) => x.join('\n'),
      )(c.state),
      editAction(
        'bannedWordRegexs',
        updateStrings,
      )(c),
    ),
  ])),
  h('div', {
    style: panelBoxStyle(212),
  }, textAreaNode('bannedUsers', 18)(c)),
];

const chatFieldPanel: R.Reader<Config, VNode<SettingState>[]> = (c) => [
  h('div', {
    style: panelBoxStyle(644),
  }, pipe(
    [
      numberNode('fieldScale', 0.7, 1.5, 0.05),
      checkboxNode('simplifyChatField'),
      checkboxNode('createBanButton'),
    ],
    RA.map(apply(c)),
  )),
];

const feedbackPanel: R.Reader<Config, VNode<SettingState>[]> = (c) => pipe(
  Math.trunc((
    getState<readonly string[]>('eventLog')(c.state).length
  ) / 100) + 1,
  (logPageLength) => [
    h('div', {
      style: panelBoxStyle(644),
    }, [
      h('div', {
        style: {
          float: 'right',
        },
      }, h('a', {
        style: {
          color: '#f0f',
        },
        // eslint-disable-next-line max-len
        href: 'https://greasyfork.org/en/scripts/411442-flow-youtube-chat/feedback',
        target: '_blank',
      }, text(getText('giveFeedback')(c.state.lang)))),
      h('div', {}, [
        h('span', {}, text(getText('eventLog')(c.state.lang))),
        buttonNode('copy')(c),
        tabContainer(
          {
            container: {
              height: '276px',
            },
            label: {
              padding: '4px',
              width: '2em',
              textAlign: 'center',
            },
            labelFocus: {
              background: '#666',
            },
            tab: {
              display: 'flex',
              flexDirection: 'column',
              padding: '6px',
            },
          },
          pipe(
            RA.makeBy(logPageLength, N.Show.show),
          ),
          pipe(
            RA.makeBy(
              logPageLength,
              (i) => () => pipe(
                getState<readonly string[]>('eventLog')(
                  c.state,
                ).slice(i * 100, (i + 1) * 100),
                RA.mapWithIndex((j, x) => h('div', {
                  style: {
                    display: 'flex',
                  },
                }, [
                  h('div', {
                    style: {
                      userSelect: 'none',
                      flex: '0 0 2em',
                    },
                  }, text((i * 100) + j)),
                  h('div', {
                    style: {
                      background: j % 2 === 0 ? '#fff'
                      : '#ddd',
                      color: '#000',
                      flex: 'auto',
                      wordBreak: 'break-all',
                      padding: '0 2px',
                    },
                  }, text(x)),
                ])),
              ),
            ),
          ),
          (s, n) => updateAt('logTab', n)(c),
          getState<number>('logTab')(c.state),
        ),
      ]),
    ]),
  ],
);

export default (
  command: AppCommander,
): R.Reader<SettingState, VNode<SettingState>> => flow(
  (state) => ({
    command,
    state,
  }),
  (c) => (c.state.showPanel ? h('div', {
    class: 'fyc_panel',
    style: {
      backgroundColor: 'rgba(30,30,30,0.9)',
      zIndex: '10000',
      position: 'absolute',
      bottom: '40px',
      right: '0px',
      color: '#fff',
      fontSize: '14px',
      width: '660px',
      border: 'solid 1px #666',
      fontFamily: 'MS PGothic',
      lineHeight: '1.2',
    },
  }, [
    h('div', {
      style: {
        position: 'absolute',
        inset: '3px 3px auto auto',
      },
    }, [
      text('🌐'),
      h('select', {
        onchange: updateString('lang')(c),
      }, pipe(
        languages,
        RA.mapWithIndex((i, lang) => option(
          lang,
          languageLabels[i],
          lang === c.state.lang,
        )),
      )),
    ]),
    tabContainer(
      {
        container: {
          height: '364px',
        },
        label: {
          padding: '6px',
        },
        labelFocus: {
          background: '#666',
        },
        tab: {
          display: 'flex',
          padding: '6px',
        },
      },
      pipe(
        [
          'flowChat',
          'chatFilter',
          'chatField',
          'feedback',
        ],
        RA.map(getText),
        RA.map(apply(c.state.lang)),
      ),
      pipe(
        [
          () => flowChatPanel,
          () => filterPanel,
          // () => filterPanel,
          () => chatFieldPanel,
          () => feedbackPanel,
        ] as const,
        RA.map(flip),
        RA.map(apply(c)),
      ),
      (s, n) => updateAt('mainTab', n)(c),
      getState<number>('mainTab')(c.state),
    ),
  ]) : h('div', {})),
);
