import forwardTo from '@userscript/forward-to';
import {
  tapIs,
} from '@userscript/tap';
import m from 'mithril';
import {
  merge,
  Subject,
  map,
  filter,
  startWith,
  tap,
} from 'rxjs';

import classAttr from '@/classAttr';
import conditionPresets from '@/conditionPresets';
import getInputValue from '@/getInputValue';

export default class implements m.Component {
  [_: number]: never;

  private state: {
    condition: string,
    pageCount: number,
    loadedPageCount: number,
  };

  private readonly conditionInputInput$ = new Subject<InputEvent>();

  private readonly conditionInputChange$ = new Subject<Event>();

  private readonly conditionInputKeydown$ = new Subject<KeyboardEvent>();

  private readonly sortButtonClick$ = new Subject<MouseEvent>();

  private readonly presetSelectChange$ = new Subject<Event>();

  private readonly pageCountInputInput$ = new Subject<InputEvent>();

  private readonly pageCountInputChange$ = new Subject<Event>();

  private readonly conditionInputEnterDown$ = this.conditionInputKeydown$.pipe(
    filter((e) => e.key === 'Enter'),
  );

  private conditionChange$ = merge(
    this.conditionInputEnterDown$,
    this.presetSelectChange$,
    this.conditionInputChange$,
  );

  readonly sort$ = merge(
    this.sortButtonClick$,
    this.conditionInputEnterDown$,
    this.presetSelectChange$,
  ).pipe(
    map(() => this.state.condition),
  );

  readonly condition$ = this.conditionChange$.pipe(
    startWith(undefined),
    map(() => this.state.condition),
  );

  readonly pageCount$ = this.pageCountInputChange$.pipe(
    startWith(undefined),
    map(() => this.state.pageCount),
  );

  constructor(
    initialCondition: string,
    initialPageCount: number,
  ) {
    this.state = {
      condition: initialCondition,
      pageCount: initialPageCount,
      loadedPageCount: 0,
    };

    merge(
      this.conditionInputInput$.pipe(
        getInputValue,
        tap((value) => {
          this.state.condition = value;
        }),
      ),
      merge(
        this.conditionChange$,
        this.presetSelectChange$.pipe(
          tap((e) => {
            this.state.condition = tapIs(HTMLSelectElement)(
              e.currentTarget,
            ).value;
          }),
        ),
      ).pipe(
        map(() => this.state.condition),
        tap((value) => GM.setValue('sortValue', value)),
      ),
      this.pageCountInputInput$.pipe(
        getInputValue,
        map((value) => Number.parseInt(value, 10)),
        tap((pageCount) => {
          this.state.pageCount = pageCount;
        }),
      ),
      this.pageCountInputChange$.pipe(
        tap(() => GM.setValue(
          'pageCount',
          this.state.pageCount,
        )),
      ),
    ).subscribe();
  }

  view(): m.Vnode {
    const commonStyle = {
      margin: '5px 2px',
    };

    const conditionDataListId = 'iwara-custom-sort-conditions';

    const presetOptions = Object.entries(conditionPresets).map(
      ([name, value]) => m('option', {
        value,
      }, name),
    );

    const uiChildren = {
      conditionInput: m(`input${classAttr([
        'form-control',
        'input-sm',
      ])}`, {
        size: 60,
        value: this.state.condition,
        style: commonStyle,
        list: conditionDataListId,
        oninput: forwardTo(this.conditionInputInput$),
        onchange: forwardTo(this.conditionInputChange$),
        onkeydown: forwardTo(this.conditionInputKeydown$),
      }),

      conditionDatalist: m('datalist', {
        id: conditionDataListId,
      }, presetOptions),

      presetSelect: m(`select${classAttr([
        'btn',
        'btn-sm',
        'btn-info',
      ])}`, {
        onupdate: (vnode) => {
          tapIs(HTMLSelectElement)(vnode.dom).selectedIndex = 0;
        },
        style: {
          width: '95px',
          ...commonStyle,
        },
        onchange: forwardTo(this.presetSelectChange$),
      }, [
        m('option', {
          hidden: true,
        }, 'Presets'),
        ...presetOptions,
      ]),

      sortButton: m(`button${classAttr([
        'btn',
        'btn-sm',
        'btn-primary',
      ])}`, {
        style: commonStyle,
        onclick: forwardTo(this.sortButtonClick$),
      }, 'Sort'),

      label1: m(`label${classAttr(['text-primary'])}`, {
        style: commonStyle,
      }, 'load'),

      pageCountInput: m(`input${classAttr([
        'form-control',
        'input-sm',
      ])}`, {
        type: 'number',
        value: this.state.pageCount,
        min: 1,
        max: 500,
        step: 1,
        style: {
          width: '7rem',
          ...commonStyle,
        },
        oninput: forwardTo(this.pageCountInputInput$),
        onchange: forwardTo(this.pageCountInputChange$),
      }),

      label2: m(`label${classAttr(['text-primary'])}`, {
        style: commonStyle,
      }, 'pages. '),

      statusLabel: m(`label${classAttr(['text-primary'])}`, {
        style: commonStyle,
      }, this.state.loadedPageCount < this.state.pageCount ? `${
        this.state.loadedPageCount
      } of ${
        this.state.pageCount
      } pages done` : 'All pages done'),
    };

    const ui = m(`div${classAttr([
      'form-inline',
      'container',
    ])}`, {
      style: {
        display: 'inline-block',
      },
    }, Object.values(uiChildren));

    return ui;
  }

  addLoadedPageCount(): void {
    this.state.loadedPageCount += 1;
    m.redraw();
  }
}
