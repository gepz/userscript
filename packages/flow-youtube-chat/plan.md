# flow-youtube-chat feature backlog

A wishlist, not commitments. Items date back to 2022; some may be partially
covered by current code (e.g. banned-word filtering and text shadow exist in
some form). Verify against `src/` before starting one.

## In flight: typed filter expressions

The largest work-in-progress: a typed, restricted expression system to power
user-defined chat filters and replace the deprecated `expression-eval`
dependency (unmaintained, has a security advisory, and evaluates
user-supplied input — the riskiest dependency in the repo). The WIP sources
are excluded from builds via `tsconfig.exclude.json`:
`src/restrictedExpression`, `src/typedExpression`, `src/settingUI/filterPanel`
(the old panel `filterPanelOld` still ships), `src/settingUI/EditableExpression`,
`src/settingUI/filter`, `src/filter/filterContextType`, `src/type`.
Design scratch notes live in `filter_logic.md`.

## Wishlist

- Account name filter
- Repeat chat filter
- Display matrix
- Emoji filter
- Auto block user
- Per site settings
- Auto reload
- Banned lane
- Sticker support
- Performance tab
- Reset default settings
- Shadow color v2
