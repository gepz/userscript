// Runs onSettled once the element's DOM mutations have been quiet for
// quietMs, or deadlineMs after the call at the latest. YouTube inserts
// some renderers as pre-hydration skeletons and stamps content in
// afterwards (see src/parseChat/fixtures/README.md), so "the element as
// inserted" and "the element as settled" can differ; this is the
// read-again primitive the product recheck and the capture tooling share.
export default (
  element: HTMLElement,
  quietMs: number,
  deadlineMs: number,
  onSettled: () => void,
): void => {
  const started = Date.now();
  let lastMutation = started;
  const mutations = new MutationObserver(() => {
    lastMutation = Date.now();
  });

  mutations.observe(element, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });

  let poll: ReturnType<typeof setInterval> | undefined;

  const tick = (): void => {
    const now = Date.now();

    if (now - lastMutation >= quietMs || now - started >= deadlineMs) {
      mutations.disconnect();
      clearInterval(poll);
      onSettled();
    }
  };

  poll = setInterval(tick, 250);
};
