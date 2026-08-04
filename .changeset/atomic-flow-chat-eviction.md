---
'flow-youtube-chat': patch
---

Chats no longer vanish early around the max-chat-amount cap: the
recycle/evict step now picks and removes its target atomically (a
concurrent write could previously cancel the wrong chat, or crash into a
re-initialization that cleared every chat on screen), and trimming after
a max-chat-amount change keeps the remaining chats in order and cancels
the removed chats' animations.
