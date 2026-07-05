# @userscript/cdn-from-dependency

Build-time helper that turns a `package.json` dependency entry into the data
for a pinned CDN URL (exact version extracted from the declared range), used
to generate userscript `@require` headers with subresource-integrity hashes
instead of bundling large runtime dependencies.

Internal workspace package; rebuild and commit [`lib/`](lib) after changes
(`pnpm build-lib`).
