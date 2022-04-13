import assert from '@userscript/assert';
import {
  tapIs,
  tapNonNull,
} from '@userscript/tap';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';
import * as log from 'loglevel';
import m from 'mithril';
import {
  timer,
  fromEvent,
  zip,
  Observable,
  merge,
  EMPTY,
  of,
  from,
  mergeMap,
  take,
  auditTime,
  map,
  startWith,
  withLatestFrom,
  filter,
  tap,
  pluck,
  catchError,
  scan,
  bufferCount,
} from 'rxjs';
import Swal from 'sweetalert2';

import {
  PageContainer,
} from '@/PageContainer';
import PageLoadedMessage from '@/PageLoadedMessage';
import SortComponent from '@/SortComponent';
import changeAnchorUrlParam from '@/changeAnchorUrlParam';
import conditionPresets from '@/conditionPresets';
import createPageContainer from '@/createPageContainer';
import getPageParam from '@/getPageParam';
import getTeaserContainers from '@/getTeaserContainers';
import reloadImage from '@/reloadImage';
import removeEmbeddedPage from '@/removeEmbeddedPage';
import scriptIdentifier from '@/scriptIdentifier';
import sortTeaser from '@/sortTeaser';

const changeAnchorPageParam = (
  anchor: HTMLAnchorElement,
  value: number,
) => changeAnchorUrlParam(anchor, 'page', value.toString());

const groupPageItems = (
  pageItems: HTMLElement[],
) => {
  const group = document.createElement('li');
  pageItems[0].before(group);
  // eslint-disable-next-line no-param-reassign
  pageItems[0].style.marginLeft = '0';
  pageItems.forEach((item) => {
    item.classList.replace('pager-item', 'pager-current');
  });

  const groupList = m('ul', {
    style: {
      display: 'inline',
      backgroundColor: 'hsla(0, 0%, 75%, 50%)',
    },
    oncreate(vnode) {
      vnode.dom.append(...pageItems);
    },
  });

  m.render(
    group,
    groupList,
  );
};

const adjustPager = ({
  container,
  pageCount,
}: {
  container: Element,
  pageCount: number
}) => {
  const currentPage = getPageParam(new URL(window.location.href));
  const nextPage = currentPage + pageCount;
  [
    ...[
      () => {
        const previousPageAnchor = tapNonNull(
          container.querySelector<HTMLAnchorElement>(
            '.pager-previous a',
          ),
        );

        return [
          previousPageAnchor,
          Math.max(0, currentPage - pageCount),
        ] as const;
      },
    ].filter(() => currentPage > 0),
    ...(() => {
      const nextPageAnchor = container.querySelector<HTMLAnchorElement>(
        '.pager-next a',
      );

      const lastPageAnchor = container.querySelector<HTMLAnchorElement>(
        '.pager-last a',
      );

      if (lastPageAnchor) {
        const reachedLastPage = getPageParam(
          new URL(lastPageAnchor.href, window.location.href),
        ) < nextPage;

        const display = reachedLastPage ? 'none' : '';
        lastPageAnchor.style.display = display;
        assert(nextPageAnchor);
        nextPageAnchor.style.display = display;
        if (!reachedLastPage) {
          return [() => [nextPageAnchor, nextPage] as const];
        }
      } else if (nextPageAnchor) {
        return [() => [nextPageAnchor, nextPage] as const];
      }

      return [];
    })(),
  ].forEach(
    (getArgs) => changeAnchorPageParam(...getArgs()),
  );

  pipe(
    Array.from(
      container.querySelectorAll<HTMLAnchorElement>('.pager-item a'),
    ),
    A.filter((anchor) => {
      const page = getPageParam(new URL(anchor.href, window.location.href));
      return page >= currentPage && page < nextPage;
    }),
    O.fromPredicate((currentPageAnchors) => currentPageAnchors.length > 0),
    O.map((anchors) => [
      ...Array.from(container.querySelectorAll<HTMLElement>('.pager-current')),
      ...anchors.map(
        (anchor) => tapNonNull(anchor.parentElement),
      ),
    ]),
    O.map(groupPageItems),
  );
};

const getBrokenImages = () => getTeaserContainers(document).flatMap(
  (container) => Array.from(
    container.querySelectorAll('img'),
  ),
).filter((img) => img.complete && img.naturalWidth === 0);

const createPreloadPage = (
  createContainer: () => PageContainer,
  parentPageId: string,
  url: URL,
) => {
  const container = createContainer();
  container.src = url.toString();
  container.style.display = 'none';
  container.classList.add(parentPageId);
  return container;
};

const createPreloadUrl = (
  startURL: URL,
) => (
  page: number,
) => {
  const preloadURL = new URL('', startURL);
  preloadURL.searchParams.set('page', (page).toString());
  return preloadURL;
};

const preloadUrlStream = (
  startURL: URL,
) => (
  pageCount$: Observable<number>,
) => pageCount$.pipe(
  scan((max, value) => Math.max(max, value), 1),
  startWith(1),
  bufferCount(2, 1),
  mergeMap(([last, current]) => from(
    [...Array(current - last).keys()].map(
      (i) => getPageParam(startURL) + last + i,
    ),
  )),
  map(createPreloadUrl(startURL)),
);

const trySortTeasers = (condition$: Observable<string>) => condition$.pipe(
  map((condition) => [getTeaserContainers(document), condition] as const),
  mergeMap((x) => of(x).pipe(
    tap(([containers, condition]) => containers.forEach(
      (container) => sortTeaser(container, condition),
    )),
    catchError((error) => {
      Swal.fire(
        'Sorting Failed',
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `An error accured while sorting: ${error}`,
      );

      log.error(error);
      return EMPTY;
    }),
  )),
  map(([containers]) => ({
    containersCount: containers.length,
  })),
);

export default async (): Promise<void> => {
  if (getTeaserContainers(document).length === 0) {
    return;
  }

  const initialCondition = tapNonNull(
    await GM.getValue('sortValue', conditionPresets['Default Condition']),
  );

  const pageCount = tapNonNull(await GM.getValue('pageCount', 1));
  const haveMorePages = Boolean(document.querySelector('.pager')
    && !document.querySelector('#comments'));

  const sortComponent = new SortComponent(
    initialCondition,
    pageCount,
  );

  const preloadUrl$ = (haveMorePages ? sortComponent.pageCount$ : of(1)).pipe(
    preloadUrlStream(new URL(window.location.href)),
  );

  const channel = new BroadcastChannel(scriptIdentifier);

  const parentPageId = `t-${performance.now().toString()}`;

  const pageLoad$ = fromEvent<PageLoadedMessage>(
    channel,
    'message',
  ).pipe(
    filter((data) => data.parentPageId === parentPageId),
  );

  const teaserPageLoad$ = pageLoad$.pipe(
    filter((message) => message.hasTeasers),
  );

  const pageFromUrl = new Map<string, PageContainer>();

  const unsortedTeasers$ = teaserPageLoad$.pipe(
    map(() => undefined),
    startWith(undefined),
  );

  const clonedClass = `${scriptIdentifier}-cloned`;

  const allStreams = {
    adjustPager$: sortComponent.pageCount$.pipe(
      mergeMap((count) => from(
        document.querySelectorAll<HTMLElement>(`.pager:not(.${clonedClass})`),
      ).pipe(
        tap((pager) => {
          // eslint-disable-next-line no-param-reassign
          pager.style.display = 'none';
        }),
        map((pager) => {
          const clonedPager = tapIs(HTMLElement)(pager.cloneNode(true));
          clonedPager.style.display = '';
          return [pager, clonedPager];
        }),
        tap(([pager, clonedPager]) => {
          const sibling = pager.previousElementSibling;
          if (sibling && sibling.matches(`.${clonedClass}`)) {
            sibling.replaceWith(clonedPager);
          } else {
            pager.before(clonedPager);
          }
        }),
        tap(([, clonedPager]) => {
          clonedPager.classList.add(clonedClass);
        }),
        map(([, clonedPager]) => ({
          container: clonedPager,
          pageCount: count,
        })),
      )),
      tap(adjustPager),
    ),

    logPageLoad$: pageLoad$.pipe(
      tap(log.info),
    ),

    reloadBrokenImages$: unsortedTeasers$.pipe(
      mergeMap(() => timer(0, 8000).pipe(take(2))),
      auditTime(6000),
      map(getBrokenImages),
      tap((images) => images.forEach(reloadImage)),
      map((images) => `Reload ${images.length} broken image(s)`),
      tap(log.info),
    ),

    sortTeasers$: merge(
      unsortedTeasers$.pipe(
        withLatestFrom(sortComponent.condition$),
        map(([, condition]) => condition),
        tap(() => sortComponent.addLoadedPageCount()),
      ),
      sortComponent.sort$,
    ).pipe(
      trySortTeasers,
      map((result) => `${result.containersCount} containers sorted`),
      tap(log.info),
    ),

    removeLoadedPage$: pageLoad$.pipe(
      map(({
        url,
      }) => ({
        url,
        container: pageFromUrl.get(url),
      })),
      tap(({
        url,
      }) => pageFromUrl.delete(url)),
      pluck('container'),
      map(tapNonNull),
      tap(removeEmbeddedPage),
    ),

    addHiddenPreload$: zip(
      preloadUrl$,
      teaserPageLoad$.pipe(
        scan((countDown) => (countDown > 0 ? countDown - 1 : countDown), 5),
        map((countDown) => (countDown > 0 ? 2 : 1)),
        startWith(2),
        mergeMap((createPageCount) => (
          of(...Array.from(
            {
              length: createPageCount,
            },
            () => undefined,
          ))
        )),
      ),
    ).pipe(
      map(([url]) => [
        url,
        () => createPageContainer(window.navigator.userAgent),
      ] as const),
      map(([url, createContainer]) => [
        url.toString(),
        createPreloadPage(createContainer, parentPageId, url),
      ] as const),
      tap((entry) => pageFromUrl.set(...entry)),
      tap(([, container]) => document.body.append(container)),
    ),
  };

  const all$ = merge(...Object.values(allStreams));
  all$.subscribe();
  const sortComponentContainer = document.createElement('div');
  const parent = tapNonNull(document.querySelector('#user-links'));
  parent.after(sortComponentContainer);
  m.mount(sortComponentContainer, sortComponent);

  log.debug(await GM.listValues());
};
