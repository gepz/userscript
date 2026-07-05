# @userscript/eslint-config

Shared eslint 9 flat config: airbnb-extended + typescript-eslint +
@stylistic, assembled by the `packageConfig` factory that each package's
`eslint.config.mjs` calls. Rule values that look arbitrary are often pinned
to preserve the repo's established formatting — read the comments in
[`sharedRules`](sharedRules/index.mjs) before changing them.

Plain `.mjs`, no build step. See `docs/architecture.md` at the repo root for
the fragment layout.
