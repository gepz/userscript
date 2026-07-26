export interface SettingsPanelSize {
  width: number
  height: number
}

// The tabs lay out three 212px columns plus margins and padding: 660px
// exactly. The scrollbar thickness argument (see scrollbarThickness)
// buys the space the tab body's scrollbar-gutter reserves (see
// settingsPanel), so a tab that scrolls vertically doesn't also scroll
// horizontally.
export default (scrollbarThickness: number): SettingsPanelSize => ({
  width: 660 + scrollbarThickness,
  height: 395,
});
