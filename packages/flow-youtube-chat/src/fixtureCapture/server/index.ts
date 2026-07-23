import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {
  createServer,
  ServerResponse,
} from 'node:http';
import path from 'node:path';
import {
  fileURLToPath,
} from 'node:url';

// Node's type stripping resolves only explicit .ts specifiers, so these
// local imports must carry the extension the lint rule would strip.
/* eslint-disable import-x/extensions, import-x/no-useless-path-segments */
import {
  slots,
} from '../Slot/index.ts';
import {
  cooldownMs,
  maxSamples,
  port,
  sampleName,
  settledName,
  tagPattern,
} from '../protocol/index.ts';
/* eslint-enable import-x/extensions, import-x/no-useless-path-segments */

// Fixture-capture ingest server: `pnpm capture-server`, run directly by
// node's type stripping, so no @/ aliases and only erasable syntax here
// and in the modules imported above. Receives captures from the userscript
// (@/fixtureCapture/main); shared constants in @/fixtureCapture/protocol;
// workflow in src/parseChat/fixtures/README.md.

const marker = '<!-- captured ';
const fixturesDir = fileURLToPath(
  new URL('../../parseChat/fixtures', import.meta.url),
);

// Raw samples and whole-DOM snapshots: real user content, so the directory
// is gitignored (see the root .gitignore) and must stay local-only.
const snapshotDir = fileURLToPath(
  new URL('../../../capture-snapshots', import.meta.url),
);

const slotSet = new Set<string>(slots);

// Samples held per kind, derived from the files on disk, so counts survive
// restarts. --refresh forgets them: every kind gets re-sampled (and its
// files and fixture overwritten) this run.
const counts = new Map<string, number>();

if (!process.argv.includes('--refresh') && existsSync(snapshotDir)) {
  readdirSync(snapshotDir).forEach((name) => {
    // Inverse of sampleName in ../protocol.
    const match = /^sample-(.+)-(\d+)\.html$/.exec(name);
    const kind = match?.[1];
    const n = Number(match?.[2]);

    if (kind !== undefined && Number.isInteger(n)) {
      counts.set(kind, Math.max(counts.get(kind) ?? 0, n));
    }
  });
}

const lastAccepted = new Map<string, number>();

const kindCounts = (): Record<string, number> => Object.fromEntries(counts);

const progress = (
  kind: string,
): string => `${kind} ${counts.get(kind) ?? 0}/${maxSamples}`;

const report = (): void => {
  const missing = slots.filter((slot) => (counts.get(slot) ?? 0) < maxSamples);
  const unknownKinds = [...counts.keys()]
    .filter((kind) => !slotSet.has(kind));

  process.stdout.write(`slots full ${slots.length - missing.length}/${
    slots.length}${
    missing.length > 0
      ? `; sampling: ${missing.map(progress).join(', ')}`
      : ''}${
    unknownKinds.length > 0
      ? `; unknown: ${unknownKinds.map(progress).join(', ')}`
      : ''}\n`);
};

const respond = (
  response: ServerResponse,
  status: number,
  payload: unknown,
): void => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });

  response.end(JSON.stringify(payload));
};

const isRecord = (
  x: unknown,
): x is Record<string, unknown> => typeof x === 'object' && x !== null;

const handleCapture = (body: string, response: ServerResponse): void => {
  const parsed: unknown = JSON.parse(body);

  if (!isRecord(parsed)
    || typeof parsed['kind'] !== 'string'
    || typeof parsed['raw'] !== 'string'
    || ('settled' in parsed && typeof parsed['settled'] !== 'string')
    || !(slotSet.has(parsed['kind'])
      ? typeof parsed['sanitized'] === 'string'
      : tagPattern.test(parsed['kind']))) {
    respond(response, 400, {
      error: 'expected {kind, raw, settled?}, plus sanitized for slot kinds',
    });

    return;
  }

  const kind = parsed['kind'];
  const held = counts.get(kind) ?? 0;

  // Full kinds and cooldown violations are rejected, but still answered
  // with the counts, so the client resyncs (and stops sending a full kind)
  // instead of retrying.
  if (held < maxSamples
    && Date.now() - (lastAccepted.get(kind) ?? 0) >= cooldownMs) {
    mkdirSync(snapshotDir, {
      recursive: true,
    });

    writeFileSync(
      path.join(snapshotDir, sampleName(kind, held + 1)),
      `${parsed['raw']}\n`,
    );

    // The settled twin records what the element became once its
    // post-insert mutations went quiet (hydration, lazy loads, rewrites);
    // it is absent when nothing changed. A stale twin from an earlier
    // sampling round of this number is removed either way.
    const settledPath = path.join(snapshotDir, settledName(kind, held + 1));

    rmSync(settledPath, {
      force: true,
    });

    if (typeof parsed['settled'] === 'string') {
      writeFileSync(settledPath, `${parsed['settled']}\n`);
      process.stdout.write(`${kind} ${held + 1}: mutated after insert${
        parsed['detached'] === true ? ', left the document' : ''}\n`);
    }

    // The committed fixture is the sanitized twin of the newest sample.
    if (typeof parsed['sanitized'] === 'string') {
      writeFileSync(path.join(fixturesDir, `${kind}.html`), `${marker}${
        new Date().toISOString().slice(0, 10)} -->\n${
        parsed['sanitized'].trim()}\n`);
    }

    counts.set(kind, held + 1);
    lastAccepted.set(kind, Date.now());
    report();
  }

  respond(response, 200, {
    kinds: kindCounts(),
  });
};

const handleSnapshot = (body: string, response: ServerResponse): void => {
  const parsed: unknown = JSON.parse(body);

  if (!isRecord(parsed) || typeof parsed['html'] !== 'string') {
    respond(response, 400, {
      error: 'expected {html}',
    });

    return;
  }

  mkdirSync(snapshotDir, {
    recursive: true,
  });

  const file = path.join(snapshotDir, `snapshot-${
    new Date().toISOString().replace(/[:.]/g, '-')}.html`);

  writeFileSync(file, `${parsed['html']}\n`);
  process.stdout.write(`raw snapshot written: ${file}\n`);
  respond(response, 200, {
    written: path.basename(file),
  });
};

createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/status') {
    respond(response, 200, {
      kinds: kindCounts(),
    });

    return;
  }

  const handlers: Record<string, typeof handleCapture | undefined> = {
    '/capture': handleCapture,
    '/snapshot': handleSnapshot,
  };

  const handler = request.method === 'POST' && request.url !== undefined
    ? handlers[request.url]
    : undefined;

  if (handler) {
    const sizeLimit = request.url === '/snapshot' ? 30_000_000 : 2_000_000;
    const chunks: Buffer[] = [];
    let size = 0;

    request.on('data', (chunk: Buffer) => {
      size += chunk.length;

      if (size > sizeLimit) {
        request.destroy();
      } else {
        chunks.push(chunk);
      }
    });

    request.on('end', () => {
      try {
        handler(Buffer.concat(chunks).toString(), response);
      } catch {
        respond(response, 400, {
          error: 'invalid request',
        });
      }
    });

    return;
  }

  respond(response, 404, {
    error: 'not found',
  });
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(
    `fixture-capture server on http://127.0.0.1:${port}\n`,
  );

  process.stdout.write(`writing to ${fixturesDir}\n`);
  report();
});
