import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/Predicate';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
  identity,
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
import fonts from '@/fonts';
import getLang from '@/getLang';
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

const stepTiming = (stepCount: number) => `steps(${stepCount}, jump-end)`;

type StateKey<T> = TypeKey<SettingState, T>
| TypeKey<typeof computed, (s: SettingState) => T>;

type SettingDispatchable = [s: SettingState, ...e: Effect<SettingState>[]];

export default (
  command: AppCommander,
): (
  s: SettingState
  ) => VNode<SettingState> => {
  const {
    setConfig,
    act,
  } = command;

  const configFx = <T extends keyof UserConfig>(
    k: T,
    v: UserConfig[T]['val'],
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ): Effect<SettingState> => [() => setConfig[k](v as never), undefined];

  const setRange = (
    keyA: TypeKey<SettingState, number> & keyof UserConfig,
  ) => (
    keyB: TypeKey<SettingState, number> & keyof UserConfig,
  ) => (
    bFn: (vA: number) => (vB: number) => number,
  ) => (s: SettingState, vA: number): SettingDispatchable => pipe(
    bFn(vA)(s[keyB]),
    (newB) => [
      {
        ...s,
        [keyA]: vA,
        [keyB]: newB,
      },
      configFx(keyA, vA),
      configFx(keyB, newB),
    ],
  );

  const setState: Partial<{
    [K in keyof SettingState]: (
      s: SettingState,
      v: SettingState[K]
    ) => SettingDispatchable
  }> = {
    flowY1: setRange('flowY1')('flowY2')((a) => (b) => Math.max(b, a + 0.05)),
    flowY2: setRange('flowY2')('flowY1')((a) => (b) => Math.min(b, a - 0.05)),
    flowX1: setRange('flowX1')('flowX2')((a) => (b) => Math.max(b, a + 0.05)),
    flowX2: setRange('flowX2')('flowX1')((a) => (b) => Math.min(b, a - 0.05)),
    timingStepCount: (s, v) => pipe(
      stepTiming(v),
      (timingFunction) => [
        {
          ...s,
          timingStepCount: v,
          timingFunction,
        },
        configFx('timingFunction', timingFunction),
      ],
    ),
    bannedWordRegexs: (s, v) => pipe(
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
          ...s,
          bannedWordRegexs: v,
          bannedWordRegexsError: x.error,
          bannedWordRegexsValid: x.valid,
        },
        ...x.valid ? [configFx('bannedWordRegexs', v)]
        : [],
      ],
    ),
  };

  const setComputed: {
    [K in keyof typeof computed]: (
      s: SettingState,
      v: ReturnType<(typeof computed)[K]>
    ) => SettingDispatchable
  } = {
    useStepTiming: (s, v) => {
      const timingFunction = v ? stepTiming(s.timingStepCount)
        : 'linear';

      return [
        {
          ...s,
          timingFunction,
        },
        configFx('timingFunction', timingFunction),
      ];
    },
  };

  const doAct = {
    copy: async (s: SettingState) => {
      GM.setClipboard(s.eventLog.join('\n'));
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clearFlowChats: async (s: SettingState) => {
      act.clearFlowChats();
    },
  };

  const getTrueState = <T>(k: StateKey<T>, s: SettingState) => (
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k in computed ? computed[
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      k as TypeKey<typeof computed, (s: SettingState) => T>
    ](s) as unknown as T
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    : s[k as TypeKey<SettingState, T>]
  );

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const getState = <T>(k: StateKey<T>, s: SettingState) => (
    s.editingInput.id === k ? s.editingInput.committedState
    : getTrueState(k, s)
  ) as T;

  const updateAt = <T>(
    k: StateKey<T>,
    v: T,
    s: SettingState,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ): SettingDispatchable => (k in setComputed ? (setComputed[
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as keyof typeof setComputed
  ] as (s: SettingState, v: unknown) => [
      s: SettingState,
      ...e: Effect<SettingState>[],
  ])(s, v)
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  : k in setState ? (setState[
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    k as keyof typeof setState
  ] as (s: SettingState, v: unknown) => [
          s: SettingState, ...e: Effect<SettingState>[],
  ])(s, v) : [
    {
      ...s,
      [k]: v,
    },
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ...(k in setConfig) ? [configFx(k as keyof UserConfigSetter, v as never)]
    : [],
  ]);

  const updateString = (
    key: StateKey<string>,
  ) => (s: SettingState, e: Event) => pipe(
    getValue(e),
    (x) => updateAt(key, x, s),
  );

  const updateNumber = (
    key: StateKey<number>,
  ) => (s: SettingState, e: Event) => pipe(
    getValue(e),
    parseFloat,
    (x) => updateAt(key, x, s),
  );

  const updateInt = (
    key: StateKey<number>,
  ) => (s: SettingState, e: Event) => pipe(
    getValue(e),
    (x) => parseInt(x, 10),
    (x) => updateAt(key, x, s),
  );

  const updateBool = (
    key: StateKey<boolean>,
  ) => (s: SettingState, e: Event) => pipe(
    getChecked(e),
    (x) => updateAt(key, x, s),
  );

  const updateStrings = (
    key: StateKey<readonly string[]>,
  ) => (s: SettingState, e: Event) => pipe(
    getValue(e),
    flow(
      S.split(/\r\n|\n/),
      RA.filter(P.not(S.isEmpty)),
    ),
    (x) => updateAt(key, x, s),
  );

  const editAction = <T>(
    key: StateKey<T>,
    onchange: (k: StateKey<T>) => (s: SettingState, e: Event) => [
      s: SettingState,
      ...e: Effect<SettingState>[],
    ],
  ) => ({
    onfocus: (s: SettingState, e: Event) => updateAt<typeof s.editingInput>(
      'editingInput',
      {
        id: key,
        committedState: getTrueState(key, s),
        value: getValue(e),
      },
      s,
    ),
    onblur: (s: SettingState) => updateAt<typeof s.editingInput>(
      'editingInput',
      {
        id: '',
        committedState: '',
        value: '',
      },
      s,
    ),
    oninput: (s: SettingState, e: Event) => updateAt<typeof s.editingInput>(
      'editingInput',
      {
        id: key,
        committedState: s.editingInput.committedState,
        value: getValue(e),
      },
      s,
    ),
    onchange: (
      s: SettingState,
      e: Event,
    ): SettingDispatchable => {
      const [s1, ...es1] = onchange(key)(s, e);
      const x: typeof s1.editingInput = s1.editingInput.id === key ? {
        id: key,
        committedState: getTrueState(key, s1),
        value: getValue(e),
      } : s1.editingInput;

      const [s2, ...es2] = updateAt('editingInput', x, s1);
      return [s2, ...es1, ...es2];
    },
  });

  const getEditValue = <T>(
    s: SettingState,
    k: StateKey<T>,
    t: (x: T) => string,
  ) => (
    (s.editingInput.id === k) ? s.editingInput.value
    : t(getState(k, s))
  );

  return (
    state: SettingState,
  ): VNode<SettingState> => {
    const getText = getLang(state.lang);
    const checkboxNode = (
      label: keyof TextByLang
      & StateKey<boolean>,
    ) => checkboxRow(
      getText(label),
      getState(label, state),
      updateBool(label),
    );

    const textColorNode = (
      label: keyof TextByLang
      & StateKey<string>,
    ) => settingRow(getText(label), [
      textColorRow<SettingState>(pipe(
        editAction(label, updateString),
        (x) => [
          colorPicker(x),
          colorInput(x),
          colorTextOutput(exampleTextStyle(state)),
        ],
      ))(getEditValue<string>(state, label, identity)),
    ]);

    const colorNode = (
      label: keyof TextByLang
      & StateKey<string>,
    ) => settingRow(getText(label), [
      textColorRow<SettingState>(pipe(
        [
          colorPicker,
          colorInput,
        ],
        RA.map((f) => f(editAction(label, updateString))),
      ))(getEditValue<string>(state, label, identity)),
    ]);

    const intNode = (
      label: keyof TextByLang
      & StateKey<number>,
      min: number,
      max: number,
      step: number,
    ): VNode<SettingState> => settingRow(getText(label), [
      rangeRow(
        min,
        max,
        step,
        getEditValue<number>(state, label, N.Show.show),
        state.editingInput.id === label,
        editAction(label, updateInt),
      ),
    ]);

    const numberNode = (
      label: keyof TextByLang
      & StateKey<number>,
      min: number,
      max: number,
      step: number,
    ): VNode<SettingState> => settingRow(getText(label), [
      rangeRow(
        min,
        max,
        step,
        getEditValue<number>(state, label, N.Show.show),
        state.editingInput.id === label,
        editAction(label, updateNumber),
      ),
    ]);

    const buttonNode = (
      label: keyof TextByLang
      & TypeKey<typeof doAct, (s: SettingState) => Promise<void>>,
    ): VNode<SettingState> => h('button', {
      type: 'button',
      onclick: (s) => [
        s,
        [() => doAct[label](s), undefined],
      ],
    }, text(getText(label)));

    const textAreaNode = (
      label: keyof TextByLang
      & StateKey<readonly string[]>,
      rows: number,
    ) => settingRow(getText(label), [
      textAreaRow(
        rows,
        getEditValue<readonly string[]>(state, label, (x) => x.join('\n')),
        editAction(label, updateStrings),
      ),
    ]);

    const currentFonts = fonts(state.font);
    const logPageLength = Math.trunc((
      getState<readonly string[]>('eventLog', state).length
    ) / 100) + 1;

    const flowChatPanel = (): VNode<SettingState>[] => [
      h('div', {
        style: panelBoxStyle(212),
      }, [
        settingRow(getText('font'), [
          h('select', {
            style: textRowStyle,
            onchange: updateString('font'),
          }, pipe(
            currentFonts,
            RA.findIndex((x) => x[0] === state.font),
            O.getOrElse(() => 0),
            (index) => pipe(
              currentFonts,
              RA.mapWithIndex((i, x) => option(
                x[0],
                state.lang === 'FYC_JA' ? x[2] : x[1],
                i === index,
              )),
            ),
          )),
        ]),
        h('input', {
          style: textRowStyle,
          maxlength: 20,
          value: state.font,
          oninput: updateString('font'),
        }),
        textColorNode('color'),
        textColorNode('ownerColor'),
        textColorNode('moderatorColor'),
        textColorNode('memberColor'),
        colorNode('shadowColor'),
      ]),
      h('div', {
        style: panelBoxStyle(212),
      }, [
        numberNode('chatOpacity', 0, 1, 0.05),
        numberNode('fontSize', 0.3, 2, 0.05),
        numberNode('fontWeight', 10, 1e3, 10),
        numberNode('shadowFontWeight', 0, 3, 0.1),
        numberNode('flowSpeed', 1, 50, 1),
        intNode('maxChatCount', 5, 200, 5),
        intNode('maxChatLength', 5, 200, 5),
        intNode('laneCount', 1, 25, 1),
      ]),
      h('div', {
        style: panelBoxStyle(212),
      }, [
        numberNode('flowY1', 0, 0.95, 0.01),
        numberNode('flowY2', 0.05, 1, 0.01),
        numberNode('flowX1', 0, 0.95, 0.01),
        numberNode('flowX2', 0.05, 1, 0.01),
        numberNode('minSpacing', 0, 2.5, 0.1),
        checkboxNode('useStepTiming'),
        h('div', {
          style: {
            ...(getState<boolean>('useStepTiming', state) ? {}
            : {
              opacity: '0.5',
            }),
          },
        }, intNode('timingStepCount', 1, 400, 1)),
        checkboxNode('createChats'),
        checkboxNode('displayModName'),
        checkboxNode('displaySuperChatAuthor'),
        checkboxNode('textOnly'),
        text(getText('flowNewChatIf')),
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
      ]),
    ];

    const filterPanel = (): VNode<SettingState>[] => [
      h('div', {
        style: panelBoxStyle(212),
      }, textAreaNode('bannedWords', 18)),
      h('div', {
        style: panelBoxStyle(212),
      }, settingRow(getText('bannedWordRegexs'), [
        h('span', {}, text(state.bannedWordRegexsValid ? ''
        : `${getText('error')}: ${
          state.bannedWordRegexsError
        }`)),
        textAreaRow(
          18,
          getEditValue<readonly string[]>(
            state,
            'bannedWordRegexs',
            (x) => x.join('\n'),
          ),
          editAction(
            'bannedWordRegexs',
            updateStrings,
          ),
        ),
      ])),
      h('div', {
        style: panelBoxStyle(212),
      }, textAreaNode('bannedUsers', 18)),
    ];

    const chatFieldPanel = (): VNode<SettingState>[] => [
      h('div', {
        style: panelBoxStyle(644),
      }, [
        numberNode('fieldScale', 0.7, 1.5, 0.05),
        checkboxNode('simplifyChatField'),
        checkboxNode('createBanButton'),
      ]),
    ];

    const feedbackPanel = (): VNode<SettingState>[] => [
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
        }, text(getText('giveFeedback')))),
        h('div', {}, [
          h('span', {}, text(getText('eventLog'))),
          buttonNode('copy'),
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
                  getState<readonly string[]>(
                    'eventLog',
                    state,
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
            getState('logTab', state),
            (s, n) => updateAt('logTab', n, s),
          ),
        ]),
      ]),
    ];

    return state.showPanel ? h('div', {
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
          float: 'right',
          margin: '3px 3px 0 0',
        },
      }, [
        text('🌐'),
        h('select', {
          onchange: updateString('lang'),
        }, pipe(
          languages,
          RA.map(([lang, label]) => option(lang, label, lang === state.lang)),
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
        [
          getText('flowChat'),
          getText('chatFilter'),
          getText('chatField'),
          getText('feedback'),
        ],
        [
          flowChatPanel,
          filterPanel,
          // () => filterPanel(state.filterExp),
          chatFieldPanel,
          feedbackPanel,
        ],
        getState('mainTab', state),
        (s, n) => updateAt('mainTab', n, s),
      ),
    ]) : h('div', {});
  };
};
