---
'@userscript/ui': minor
---

`Editable<T>` is now a tagged record (`{ tag: 'Editable', value, edit }`)
instead of a bare `[value, edit]` tuple, so runtime code can tell an
Editable apart from plain user data with the new `isEditable` guard rather
than guessing from array shape. A `setTextError` helper replaces the direct
tuple surgery consumers previously needed to set a draft text with an
error.
