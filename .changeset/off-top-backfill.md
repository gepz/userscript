---
"@userscript/flow-youtube-chat": patch
---

Seeking in a stream no longer floods the screen. A seek rebuilds the
chat list by re-inserting around a hundred messages at once — dozens of
superchats included — most of them above the visible window. Now only
the visible tail of the rebuilt list flows, exactly the messages you see
in the chat panel; everything re-inserted further up stays put. Live
messages, including ones arriving below the visible window while you are
scrolled up, flow as before.
