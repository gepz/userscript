# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Unreleased:

- Nothing

## [1.21.0] - 2026-07-23

### Added

- Membership gift purchase announcements now flow across the video,
  showing the gifter's name and how many memberships they gifted. Like
  any other chat they respect the Banned Users and banned-word filters.

### Fixed

- A gift purchase no longer floods the flow with its per-recipient
  "received a gift" messages: previously every recipient's redemption
  flowed as a separate identical line, so one large gift could spam
  dozens of them. Now only the single purchase announcement flows.


## [1.20.1] - 2026-07-23

### Added

- Banned Users now understands @handles. A row can be an @handle, a legacy
  ID token, or both separated by a space; the ban button records both at
  once, so a ban keeps working even after the user changes their avatar.

### Fixed

- Superchats and paid stickers from banned users are now hidden. YouTube's
  current chat markup no longer includes an author photo on paid messages,
  so bans matched by ID alone could not catch them.
- Two different messages that merely look alike (same text and same
  displayed time, both without an author photo) are no longer mistaken for
  duplicates — duplicate detection now uses YouTube's own message id.
- Importing a malformed event log now fails cleanly and leaves the current
  log untouched, and stored settings that fail validation fall back to
  their defaults instead of causing broken behavior.

### Changed

- The Banned Words, Banned Regexes and Banned Users boxes no longer wrap
  long lines: one line is always one entry, and long entries scroll
  horizontally.

## [1.20.0] - 2026-07-07

### Security

- Replaced the unmaintained `expression-eval` library (which has an open
  security advisory) with a restricted built-in interpreter for custom
  filter expressions.

### Changed

- Filter expressions are now evaluated more strictly: names that are not
  part of the filter scope raise an error instead of silently becoming
  `undefined`, and `this` and bitwise operators are rejected.
- Migrated the internal reactive engine from rxjs to Effect Stream. The
  script loads one fewer external library, recovers from more kinds of
  internal errors, and setting changes can no longer be missed while the
  script is re-initializing after a page change.

## [1.19.3] - 2026-07-06

### Changed

- Rebuilt on a modernized toolchain: dependency updates and refreshed
  pinned CDN library versions in the userscript header. No functional
  changes intended.

## [1.19.2] - 2023-08-06

### Fixed

- Fixed script failure caused by noncompliance with "TrustedHTML" assignment requirement.

### Changed

- Removed swal package usage due to noncompliance with "TrustedHTML" assignment requirement.
    - Minor regression in UI.

## [1.19.1] - 2023-05-16

### Fixed

- Fix a filter bug that caused the script to fail.

## [1.19.0] - 2023-05-15

### Changed

- Add support for Simplified Chinese display language.

## [1.18.1] - 2023-03-18

### Fixed

- Fix a bug where the flow speed of a chat would reset when chat animation changed, typically when users adjust settings or when player size changes.

## [1.18.0] - 2023-03-16

### Changed

- UI insertion is now more reliable.
    - Chat toggle button insertion is now more reliable.
    - If the usual place to insert the settings panel toggle cannot be found, it will be added next to the chat toggle button if possible.

## [1.17.5] - 2023-03-16

### Fixed

- Fix a bug where a chat would not be removed properly when the lane interval became too small during flowing, typically when user adjusted settings.

## [1.17.4] - 2023-03-15

### Fixed

- Fix the color of superchats.

## [1.17.3] - 2023-03-15

### Fixed

- Fix a SRI bug that prevent the script from running.

## [1.17.1]

### Fixed

- Fix the "Banned Users" filter.

## [1.17.0]

### Changed

- Existing flow chats will no longer be unnecessarily removed when there are changes to YouTube's UI.
- Repeated detections of the exact same chats will now be filtered out to prevent them from being added to the flow chat.

### Fixed

- Fix a logging bug.

## [1.16.2]

### Changed

- Reduce file size.

## [1.16.1]

### Changed

- Minor UI adjustments.

### Fixed

- Fix the ban button.

## [1.16.0]

### Fixed

- Fix logging import function

## [1.15.21]

### Changed

- Improving event logging functionality.
    - Add "Enable event logging" option.
    - Add "Import event log" button.
    - Older logs are now compressed to enhance memory efficiency.
    - More events are logged.

### Fixed

- Fix a bug that stop certain options from being applied when other options were unchecked.
- Fix a bug that causes errors when modifying chat filters.

## [1.15.20]

### Fixed

- Fix a bug that resulted in missing event logs.

## [1.15.19]

### Changed

- Internal changes only.

## [1.15.18]

### Changed

- The full-sized version of emoji images will now be used in flow chats to display them with higher quality.

## [1.15.17]

### Changed

- Minor UI adjustments.

### Fix

- Fix a bug that prevent some ban buttons from showing in chat field.

## [1.15.16]

### Fix

- Correct the Japanese text on the tooltip of the chat display toggle button.

## [1.15.15]

### Changed

- The settings panel will now fits into smaller browser page.
    It was common for part of the settings panel UI to be unreachable outside of screen for handheld device users.
- Make the Youtube UI detection log more detailed for easier debugging in the future.

## [1.15.14]

### Fixed

- Fix chat window scaling function.

## [1.15.13]

### Fixed

- Stop the settings panel from showing on pages where it shouldn't.

## [1.15.12]:

### Fixed

- Fix an event logging bug.

## [1.15.11]:

### Fixed

- Fix a UI bug caused by Youtube UI update.

## [1.15.10]:

### Fixed

- **(Failed)*- Fix a UI bug caused by Youtube UI update.

## [1.15.9]:

### Changed

- Decrease the step size of flow area sliders.

### Fixed

- Fix how the script retries when errored.
- Fix how things are logged to console.
- Fix a UI bug in the "Flow Chat" panel that occurres when the language is set in Japanese.

## [1.15.8]:

- Add "Flow area left/right edge" option.

## [1.15.7]:

- Added "Color(Shadow)" option.

## [1.15.6]:

- Bug fixes.

## [1.15.5]:

- Add "Flow area top/bottom edge" option.

## [1.15.0] \~ [1.15.4]:

- Bug fixes and adjustments.

## [1.14.19]:

- You can now specify custom font.

## [1.14.18]:

- Bug fixes.

## [1.14.17]:

- Super Chats' currency texts are also subject to chat filters.
- Safari bug fix.

## [1.14.14] \~ [1.14.16]:

- Bug fixes.

## [1.14.13]:

- Add "Chat Window / Scale" option.

## [1.14.12]:

- Bugs related to popout chat are fixed.

## [1.14.9] \~ [1.14.11]:

- Add an event log which you can post its content when reporting bugs.
- Bug fixes and adjustments.

## [1.14.8]:

- Add "Min spacing between chats" option.

## [1.14.6] \~ [1.14.7]:

- Bug fixes and adjustments.

## [1.14.5]:

- Add "Show/Hide super chat author" option.

## [1.14.3] \~ [1.14.4]:

- Bug fixes and adjustments.

## [1.14.2]:

- Add "Chats won't overlap" option.
- Bug fixes and adjustments.

## [1.14.1]:

- Add "Clear Flowing Chats" button.
- Chat filtering no longer affects emoji images.
- Bug fixes and adjustments.

## [1.13.9] \~ [1.14.0]:

- Bug fixes and adjustments.

## [1.13.8]:

- Bug fixes.
- Starting with this version, Web Animation API is used to move chats instead of CSS animation.
    If users are experiencing browser compatibility or performance issues, the change will be undone.

## [1.13.7]:

- Add "Move chat in steps" option, which might lower the C(G)PU usage if the step count is set low.
- Bug fixes and adjustments.

## [1.13.6]:

- Add "Text only (Ignore emojis)" option.
- Improve the UI of the settings panel.

## [1.13.5]:

- Bug fixes.

## [1.13.4]:

- Emojis will also now be shown in super chats.
- Super chat author now appears smaller in font size.

## [1.13.1] \~ [1.13.3]:

- Bug fixes.

## [1.13.0]:

- Fix the "Banned Users" function.
