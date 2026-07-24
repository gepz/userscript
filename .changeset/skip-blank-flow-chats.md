---
'flow-youtube-chat': patch
---

Chats that would render as a blank span — typically emoji-only messages under textOnly, but also whitespace-only or fully empty renderers — no longer flow; previously they flowed invisibly while still taking a lane and a maxChatCount slot. The rendersNothing predicate mirrors chatNode's render decisions and gates both flow paths.
