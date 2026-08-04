---
'flow-youtube-chat': patch
---

Re-placing chats after a resize or setting change can no longer
overwrite the wrong chat when the list shifts mid-update (a lost-update
race), and a chat evicted during its own re-placement no longer leaves a
stray animation behind.
