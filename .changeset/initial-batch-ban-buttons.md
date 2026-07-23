---
'flow-youtube-chat': patch
---

Chats already in the list when the mutation observer attaches — the batch a stream page renders on entry — fire no mutation records and never met the insert pipeline, so they lacked ban buttons until the toggle was flipped. The list is now swept right after the observer attaches.
