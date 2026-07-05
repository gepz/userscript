# @userscript/forward-to

One curried helper: `forwardTo(observer)(value)` pushes a value into an rxjs
`Observer`. Exists so event callbacks can be point-free.

Internal workspace package; rebuild and commit [`lib/`](lib) after changes
(`pnpm build-lib`).
