---
"@userscript/ui": major
---

Restructure `Editable`'s draft state: `edit` now holds an object
`{ text, error }` instead of a positional tuple, and "invalid without a
detail message" is encoded structurally instead of by an empty-string
sentinel — `error` is `O.Option<O.Option<string>>` (outer: invalid?,
inner: detail message), the `error` accessor returns that nested shape,
and the new `setTextInvalid` constructor replaces `setTextError(text)('')`;
`setTextError` is reserved for real messages.
