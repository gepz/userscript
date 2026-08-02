---
'@userscript/ui': patch
'@userscript/flow-youtube-chat': patch
---

The plain and regex textarea nodes had their setters swapped: the Banned
Words(Regex) box accepted and saved invalid regexes without complaint,
while the plain Banned Words/Users boxes pointlessly validated entries as
regexes. Invalid regexes are now rejected in the regex box with the error
shown, and plain boxes accept any text.
