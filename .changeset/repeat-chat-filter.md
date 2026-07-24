---
'flow-youtube-chat': minor
---

New optional noRepeatedContent setting (default off): a chat whose message content — text and emojis, compared by channel-scoped emoji id — matches a currently flowing chat's does not flow, so the same content never flows twice at once. Distinct from isDuplicateChat, which drops re-renders of one message; a paid chat is never dropped as a repeat, and blank messages never match. Applied at both flow-decision sites (insert-time gate and settle recheck), and turning the option on immediately sweeps the chats already flowing, keeping the earliest of each repeated content.
