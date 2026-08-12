import Editable, * as Ed from '@userscript/ui/Editable';

import UserConfig from '@/UserConfig';

// Keys whose config value can round-trip through a text input.
type TextRepresentableKey = {
  [P in keyof UserConfig]: UserConfig[P] extends
  | number
  | string
  | readonly string[]
    ? P
    : never;
}[keyof UserConfig];

// The config fields bound to free-text inputs in the settings panel, and
// therefore held in state as Editable (committed value plus draft text)
// instead of plain values.
// Deliberately absent despite having text-representable values:
// lang (edited via a picker) and timingFunction (edited through the
// derived timingStepCount field on SettingState).
export const editableConfigKeys = [
  'font',
  'color',
  'ownerColor',
  'moderatorColor',
  'memberColor',
  'chatOpacity',
  'fontSize',
  'fontWeight',
  'shadowFontWeight',
  'maxChatCount',
  'flowSpeed',
  'maxChatLength',
  'laneCount',
  'bannedWords',
  'bannedWordRegexes',
  'bannedUsers',
  'minSpacing',
  'fieldScale',
  'flowY1',
  'flowY2',
  'flowX1',
  'flowX2',
  'shadowColor',
] as const satisfies readonly TextRepresentableKey[];

export type EditableConfigKey = (typeof editableConfigKeys)[number];

// Widened to string elements so arbitrary keys can be tested without casts.
const editableKeySet: ReadonlySet<string> = new Set(editableConfigKeys);

export const isEditableKey = (k: string): k is EditableConfigKey => (
  editableKeySet.has(k)
);

// The Editable-wrapped half of the config state. Named so generic keys
// index it directly ("Per-key config machinery", docs/decisions.md).
export type EditableConfigValues = {
  readonly [P in EditableConfigKey]: Editable<UserConfig[P]>;
};

// An intersection of two per-domain mapped types, not one conditional
// mapped type — see "Per-key config machinery" in docs/decisions.md.
type EditableConfig = EditableConfigValues & {
  readonly [P in Exclude<keyof UserConfig, EditableConfigKey>]:
  UserConfig[P];
};

export default EditableConfig;

// A heterogeneous per-key map is not expressible through Object.fromEntries,
// so the one assertion behind the whole state shape lives here.
export const fromUserConfig = (config: UserConfig): EditableConfig => ({
  ...config,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ...Object.fromEntries(
    editableConfigKeys.map((k) => [k, Ed.of(config[k])]),
  ) as { [P in EditableConfigKey]: Editable<UserConfig[P]> },
});
