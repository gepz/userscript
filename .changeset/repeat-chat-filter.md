---
'flow-youtube-chat': minor
---

New optional noRepeatedText setting (default off): a chat whose message text matches a currently flowing chat's does not flow, so the same content never flows twice at once. Text-based and distinct from isDuplicateChat, which drops re-renders of one message; a paid chat is never dropped as a repeat, and blank/emoji-only texts never match. Applied at both flow-decision sites (insert-time gate and settle recheck).
