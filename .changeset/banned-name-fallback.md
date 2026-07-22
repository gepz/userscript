---
"flow-youtube-chat": patch
---

Superchats and paid stickers no longer carry an author identity in
YouTube's markup, so banning a user could not hide them. They are now
matched by author name as a fallback — only when the message itself has no
author id, and only while that name has been seen with exactly one author
id in the current stream, so a name shared by several chatters never hides
the wrong person.
