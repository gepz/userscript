import {
  readFileSync,
} from 'node:fs';
import path from 'node:path';

// Prints the one-line note pasted into Greasyfork when a release is uploaded.
// The upload stays manual, so this only removes the hand-assembly of the line,
// and fails loudly when a changelog is missing its dated entry for the version
// being released.

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
const readPackageFile = (file: string): string => readFileSync(
  path.join(process.cwd(), file),
  'utf8',
);

const packageJson: unknown = JSON.parse(readPackageFile('package.json'));

const stringAt = (...keys: readonly string[]): string => {
  const value = keys.reduce<unknown>(
    (x, key) => (typeof x === 'object' && x !== null && key in x
      ? Reflect.get(x, key)
      : undefined),
    packageJson,
  );

  if (typeof value !== 'string') {
    throw new Error(`package.json carries no ${keys.join('.')} string`);
  }

  return value;
};

const version = stringAt('version');

// npm's canonical repository url is a git remote; the links want the web form.
const repoBlob = `${
  stringAt('repository', 'url').replace(/^git\+/u, '').replace(/\.git$/u, '')
}/blob/main`;

const packagePath = stringAt('repository', 'directory');

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
