---
"flow-youtube-chat": patch
---

Validate external inputs with schemas: importing a malformed event log now
fails cleanly (leaving the current log untouched) instead of silently
corrupting it, and stored settings that fail validation fall back to their
defaults instead of producing broken behavior.
