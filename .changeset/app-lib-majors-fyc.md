---
'@userscript/flow-youtube-chat': patch
---

Dependency majors: hash-it 7 (CDN require path moved to its UMD build),
micro-memoize 5 (now bundled instead of CDN-required — its v5 UMD depends on
globals that its dependencies' own UMD builds don't register), type-fest 5.
