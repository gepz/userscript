# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Unreleased:

* Nothing

## 1.16.1

### Changed

* Minor UI adjustments.

### Fixed

* Fix the ban button.

## 1.16.0

### Fixed

* Fix logging import function

## 1.15.21

### Changed

* Improving event logging functionality.
    * Add "Enable event logging" option.
    * Add "Import event log" button.
    * Older logs are now compressed to enhance memory efficiency.
    * More events are logged.

### Fixed

* Fix a bug that stop certain options from being applied when other options were unchecked.
* Fix a bug that causes errors when modifying chat filters.

## 1.15.20

### Fixed

* Fix a bug that resulted in missing event logs.

## 1.15.19

### Changed

* Internal changes only.

## 1.15.18

### Changed

* The full-sized version of emoji images will now be used in flow chats to display them with higher quality.

## 1.15.17

### Changed

* Minor UI adjustments.

### Fix

* Fix a bug that prevent some ban buttons from showing in chat field.

## 1.15.16

### Fix

* Correct the Japanese text on the tooltip of the chat display toggle button.

## 1.15.15

### Changed

* The settings panel will now fits into smaller browser page.
    It was common for part of the settings panel UI to be unreachable outside of screen for handheld device users.
* Make the Youtube UI detection log more detailed for easier debugging in the future.

## 1.15.14

### Fixed

* Fix chat window scaling function.

## 1.15.13

### Fixed

* Stop the settings panel from showing on pages where it shouldn't.

## 1.15.12:

### Fixed

* Fix an event logging bug.

## 1.15.11:

### Fixed

* Fix a UI bug caused by Youtube UI update.

## 1.15.10:

### Fixed

* **(Failed)** Fix a UI bug caused by Youtube UI update.

## 1.15.9:

### Changed

* Decrease the step size of flow area sliders.

### Fixed

* Fix how the script retries when errored.
* Fix how things are logged to console.
* Fix a UI bug in the "Flow Chat" panel that occurres when the language is set in Japanese.

## 1.15.8:

* Add "Flow area left/right edge" option.

## 1.15.7:

* Added "Color(Shadow)" option.

## 1.15.6:

* Bug fixes.

## 1.15.5:

* Add "Flow area top/bottom edge" option.

## 1.15.0 \~ 1.15.4:

* Bug fixes and adjustments.

## 1.14.19:

* You can now specify custom font.

## 1.14.18:

* Bug fixes.

## 1.14.17:

* Super Chats' currency texts are also subject to chat filters.
* Safari bug fix.

## 1.14.14 \~ 1.14.16:

* Bug fixes.

## 1.14.13:

* Add "Chat Window / Scale" option.

## 1.14.12:

* Bugs related to popout chat are fixed.

## 1.14.9 \~ 1.14.11:

* Add an event log which you can post its content when reporting bugs.
* Bug fixes and adjustments.

## 1.14.8:

* Add "Min spacing between chats" option.

## 1.14.6 \~ 1.14.7:

* Bug fixes and adjustments.

## 1.14.5:

* Add "Show/Hide super chat author" option.

## 1.14.3 \~ 1.14.4:

* Bug fixes and adjustments.

## 1.14.2:

* Add "Chats won't overlap" option.
* Bug fixes and adjustments.

## 1.14.1:

* Add "Clear Flowing Chats" button.
* Chat filtering no longer affects emoji images.
* Bug fixes and adjustments.

## 1.13.9 \~ 1.14.0:

* Bug fixes and adjustments.

## 1.13.8:

* Bug fixes.
* Starting with this version, Web Animation API is used to move chats instead of CSS animation.
    If users are experiencing browser compatibility or performance issues, the change will be undone.

## 1.13.7:

* Add "Move chat in steps" option, which might lower the C(G)PU usage if the step count is set low.
* Bug fixes and adjustments.

## 1.13.6:

* Add "Text only (Ignore emojis)" option.
* Improve the UI of the settings panel.

## 1.13.5:

* Bug fixes.

## 1.13.4:

* Emojis will also now be shown in super chats.
* Super chat author now appears smaller in font size.

## 1.13.1 \~ 1.13.3:

* Bug fixes.

## 1.13.0:

* Fix the "Banned Users" function.