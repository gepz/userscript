---
"flow-youtube-chat": patch
---

Duplicate detection now uses YouTube's own per-message id, so two distinct
messages that merely look alike (same text and displayed minute, neither
with an author photo) are no longer dropped as duplicates.
