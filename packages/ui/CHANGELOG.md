# @userscript/ui

## 1.2.0

### Minor Changes

- 9fcd983: `Editable<T>` is now a tagged record (`{ tag: 'Editable', value, edit }`)
  instead of a bare `[value, edit]` tuple, so runtime code can tell an
  Editable apart from plain user data with the new `isEditable` guard rather
  than guessing from array shape. A `setTextError` helper replaces the direct
  tuple surgery consumers previously needed to set a draft text with an
  error.

### Patch Changes

- 926333b: The plain and regex textarea nodes had their setters swapped: the Banned
  Words(Regex) box accepted and saved invalid regexes without complaint,
  while the plain Banned Words/Users boxes pointlessly validated entries as
  regexes. Invalid regexes are now rejected in the regex box with the error
  shown, and plain boxes accept any text.

## 1.1.7

### Patch Changes

- 78e6ea8: Validate colours in `setEditColor` with the browser's own parser
  (`CSS.supports('color', value)`) instead of the `validate-color` package,
  which is dropped as a dependency.

## 1.1.6

### Patch Changes

- 61f7336: Pin textarea font-size and line-height in textAreaRow so a rows count
  yields the same height in every browser; Firefox's larger default
  monospace font made the filter textareas overflow their panel.

## 1.1.5

### Patch Changes

- 4a417ed: Line-oriented textareas (banned words, regexes, banned users) no longer
  soft-wrap: each visual line is exactly one entry, and long entries scroll
  horizontally instead of folding into what looks like several entries.

## 1.1.4

### Patch Changes

- 89c7301: type-fest 5 (type-only; no output change).

## 1.1.3

### Patch Changes

- 5c48122: update dependencies

## 1.1.2

### Patch Changes

- 585837b: update dependencies
- refine chat detection

## 1.1.1

### Patch Changes

- update package configs

## 1.1.0

### Minor Changes

- Add some modules

## 1.0.1

### Patch Changes

- 8e2a4ab: initial
