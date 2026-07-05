# Backlog

Repo-level work worth doing, roughly ordered. Feature wishlists live with
their packages (e.g. `packages/flow-youtube-chat/plan.md`). Remove items when
done; re-verify versions before starting, this list ages.

## Security / correctness

- **Replace `expression-eval` in flow-youtube-chat.** Deprecated,
  unmaintained, has a security advisory, and evaluates user-supplied filter
  expressions. The intended replacement (typed restricted expressions) is
  already in progress — see the "In flight" section of
  `packages/flow-youtube-chat/plan.md`.
- **Replace `deep-diff` in flow-youtube-chat.** Deprecated/abandoned; needs a
  maintained substitute or vendoring.
- **hyperapp is dormant upstream** (2.0.22 final, typings papered over by
  `hyperappDomCompat.d.ts`). Long-term: migrate off or vendor.

## Dependency majors (deferred deliberately)

- Node-toolchain majors: `@types/node` 22 -> 26 (align with Node 26 runtime),
  `cross-env` 10, `webpack-cli` 7, `webpack-dev-server` 6,
  `webpack-bundle-analyzer` 5 (ships no typings — see `docs/decisions.md`).
- App-library majors: `zod` 4 (custom-sort), `type-fest` 5, `delay` 7,
  `hash-it` 7, `micro-memoize` 5.
- TypeScript 6.x once typescript-eslint supports it.
- eslint 10: blocked on plugin ecosystem (`eslint-config-airbnb-extended`,
  `eslint-plugin-canonical`, the compat-shimmed
  `eslint-plugin-consistent-default-export-name`,
  `eslint-plugin-import-newlines` v2 for eslint 10 support).

## Housekeeping

- `run-s` occasionally fails with EACCES spawning corepack's `pnpm.cjs`
  (seen in ui's `build`); root-cause or replace `npm-run-all`.
