---
"flow-youtube-chat": patch
---

Banning a user now also works by their unique @handle, closing the gap
where superchats and paid stickers (which no longer carry an author photo,
and hence no author id) slipped past the ban. A Banned Users row may be a
legacy avatar token (existing rows keep working unchanged), an @handle, or
both separated by a space; the ban button now records handle and token
together, so a ban survives the user changing their avatar. Legacy
token-only rows additionally hide an id-less superchat once that token has
been seen alongside its handle in the current stream — and never when the
same name was seen with several ids.
