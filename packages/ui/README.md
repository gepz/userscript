# @userscript/ui

Shared [hyperapp](https://github.com/jorgebucaran/hyperapp) UI components and
state helpers for the userscripts' settings panels: labeled inputs (checkbox,
color, number, text area, regex), tab containers, updaters/setters, and the
supporting types.

Internal workspace package, consumed by `flow-youtube-chat` via
`workspace:` symlink into the committed [`lib/`](lib) output.

```sh
pnpm build-lib   # tsc + tsc-alias into lib/ — rebuild and commit after changes
pnpm build       # lib + umd bundle (dist/)
```
