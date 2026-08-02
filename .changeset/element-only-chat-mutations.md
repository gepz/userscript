---
'@userscript/flow-youtube-chat': patch
---

Non-element nodes (text, comments) in the chat list's mutation records no longer crash the pipeline. The added nodes were blindly cast to elements before the children check, so any such node threw a TypeError, dropping that chat batch and forcing a full reinitialize. The filter now keeps only element nodes, checked via nodeType because the chat nodes usually belong to the #chatframe iframe's realm.
