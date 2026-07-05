# userscript

A pnpm monorepo of TypeScript userscripts and the shared infrastructure they
build on. Licensed AGPL-3.0-or-later.

## Packages

| Package | What it is |
| --- | --- |
| [`flow-youtube-chat`](packages/flow-youtube-chat) | Userscript: flows YouTube live chat over the video, danmaku-style |
| [`custom-sort`](packages/custom-sort) | Userscript: customizable sorting of teaser listings on iwara.tv |
| [`ui`](packages/ui) | Shared hyperapp UI components for the settings panels |
| [`webpack-config`](packages/webpack-config) | Shared webpack config fragments |
| [`eslint-config`](packages/eslint-config) | Shared eslint flat config |
| [`forward-to`](packages/forward-to) | Utility: curried rxjs observer forwarding |
| [`tap-non-null`](packages/tap-non-null) | Utility: assert-non-null passthrough |
| [`cdn-from-dependency`](packages/cdn-from-dependency) | Build helper: turns package.json versions into pinned CDN `@require` URLs |

## Requirements

- Node >= 24 (via nvm: `nvm use`)
- pnpm >= 11 (via corepack; npm and yarn are blocked)

## Quickstart

```sh
pnpm install
cd packages/flow-youtube-chat
pnpm build        # userscript at dist/main/index.user.js
pnpm dev          # dev server
```

Every dev/prod build type-checks the whole program via fork-ts-checker.
Sibling packages are consumed through `workspace:` symlinks pointing at
committed `lib/` output — after changing a lib package, rebuild its `lib/`
and commit it.

## More documentation

- [`AGENTS.md`](AGENTS.md) — working conventions (humans and coding agents)
- [`docs/architecture.md`](docs/architecture.md) — how the pieces fit
- [`docs/decisions.md`](docs/decisions.md) — why non-obvious things are so
- [`docs/backlog.md`](docs/backlog.md) — known pending work
