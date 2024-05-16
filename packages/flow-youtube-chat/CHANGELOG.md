# @userscript/flow-youtube-chat

## 1.19.1

### Patch Changes

- Fix filter bug

## 1.19.0

### Minor Changes

- add support for Simplified Chinese display language

### Patch Changes

- 5c48122: update dependencies
- Updated dependencies [5c48122]
  - @userscript/forward-to@1.0.4
  - @userscript/tap-non-null@1.0.4
  - @userscript/ui@1.1.3

## 1.18.1

### Patch Changes

- Fix a bug where the flow speed of a chat would reset when chat animation changed, typically when users adjust settings or when player size changes.

## 1.18.0

### Minor Changes

- d9b30b9: Make UI insertion more reliable: Make chat toggle button insertion more reliable. If the usual place to insert the UI settings panel toggle cannot be found, it will be added next to the chat toggle button if possible.

## 1.17.5

### Patch Changes

- 9050eb1: Fix a bug where a chat would not be removed properly when the lane interval became too small during animation, typically when user adjusted settings.

## 1.17.4

### Patch Changes

- 0ecd233: Fix the color of superchats

## 1.17.3

### Patch Changes

- 8a6d5aa: Add back ssri to comply with Greasyfork policies

## 1.17.2

### Patch Changes

- 979598b: Fix ssri bug

## 1.17.1

### Patch Changes

- d15e2f6: Fix the user ID filter.

## 1.17.0

### Minor Changes

- refine chat detection

### Patch Changes

- 4a8d46d: fix a logging bug
- 585837b: update dependencies
- 3885849: change monocle-ts to @fp-ts/optic
- Updated dependencies [585837b]
- Updated dependencies
  - @userscript/tap-non-null@1.0.3
  - @userscript/forward-to@1.0.3
  - @userscript/ui@1.1.2
