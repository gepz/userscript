# @userscript/tap-non-null

One helper: `tapNonNull(x, message?)` asserts `x` is neither `null` nor
`undefined` (via `typed-assert`) and returns it narrowed. A runtime-checked
alternative to the `!` non-null assertion.

Internal workspace package; rebuild and commit [`lib/`](lib) after changes
(`pnpm build-lib`).
