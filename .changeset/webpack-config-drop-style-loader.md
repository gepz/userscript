---
'@userscript/webpack-config': major
---

Remove the `styleLoaderConfig` fragment. No package imports a `.css` file, so
its `test: /\.css$/` rule matched no module.
