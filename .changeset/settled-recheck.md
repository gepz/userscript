---
"@userscript/flow-youtube-chat": patch
---

Chats whose content loads a moment after insertion (gift announcements,
some membership items, superchat avatars and styling) are now re-checked
once they finish loading, and every decision is re-made from the
completed data: bans hide them (including withdrawing an already-flowing
chat), the ban button appears on them, member coloring and superchat
styling apply correctly, and a chat wrongly skipped at insertion flows
once its identity is complete.
