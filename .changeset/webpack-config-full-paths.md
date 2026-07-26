---
'@userscript/webpack-config': patch
---

Emit fully resolved relative specifiers in `lib` (`../baseConfig/index.js`
rather than `../baseConfig`), so Node's own ESM resolver can load the
package without a bundler or ts-node in front of it.
