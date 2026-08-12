---
"@userscript/ui": minor
---

Name `Editable`'s draft-error slot: new exported `DraftError` alias
(`Option<string>` — optional detail beyond the field's generic error
text); `error` now returns `O.Option<DraftError>`. Structurally
identical to the previous `O.Option<O.Option<string>>`.
