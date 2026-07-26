import {
  readFileSync,
} from 'node:fs';
import path from 'node:path';

// Prints the one-line note pasted into Greasyfork when a release is uploaded.
// The upload stays manual, so this only removes the hand-assembly of the line,
// and fails loudly when a changelog is missing its dated entry for the version
// being released.

const repoBlob = 'https://github.com/gepz/userscript/blob/main';
const packagePath = 'packages/flow-youtube-chat';

const changelogs = [
  {
    file: 'CHANGELOG_JP.md',
    label: '更新履歴(JP)',
  },
  {
    file: 'CHANGELOG_EN.md',
    label: 'Changelog(EN)',
  },
] as const;

// The package directory, which pnpm makes the cwd of every script it runs.
// Deriving it from import.meta instead would type this file as ESM, and every
// other config/ file is typed as CommonJS.
const readPackageFile = (file: string): string => readFileSync(
  path.join(process.cwd(), file),
  'utf8',
);

const versionOf = (source: string): string => {
  const parsed: unknown = JSON.parse(source);

  if (
    typeof parsed !== 'object' || parsed === null
    || !('version' in parsed) || typeof parsed.version !== 'string'
  ) {
    throw new Error('package.json carries no version');
  }

  return parsed.version;
};

const version = versionOf(readPackageFile('package.json'));

// The Keep a Changelog release heading, without its leading marker.
const headingOf = (file: string): string => {
  const heading = new RegExp(
    `^## \\[${version.replaceAll('.', '\\.')}\\] - \\d{4}-\\d{2}-\\d{2}$`,
    'mu',
  ).exec(readPackageFile(file))?.[0];

  if (heading === undefined) {
    throw new Error(`${file} has no dated entry for ${version}`);
  }

  return heading.slice('## '.length);
};

// GitHub derives a heading anchor by lowercasing, dropping every character
// that is not a word character, hyphen or space, then hyphenating the spaces.
const anchor = (heading: string): string => heading
  .toLowerCase()
  .replaceAll(/[^\w\- ]/gu, '')
  .replaceAll(' ', '-');

const entries = changelogs.map((x) => ({
  ...x,
  heading: headingOf(x.file),
}));

if (new Set(entries.map((x) => x.heading)).size > 1) {
  throw new Error(`the changelogs date ${version} differently`);
}

process.stdout.write(`${entries.map((x) => `[${version} ${x.label}](${
  repoBlob}/${packagePath}/${x.file}#${anchor(x.heading)});`).join(' ')}\n`);
