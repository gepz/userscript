import {
  readFileSync,
  readdirSync,
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

// Fixture-capture ingest server: `pnpm capture-server`, run directly by
// node's type stripping, so no @/ aliases and only erasable syntax here.
// Receives already-sanitized fragments from the capture userscript
// (@/fixtureCapture/main) and writes them into src/parseChat/fixtures/;
// workflow in src/parseChat/fixtures/README.md.

// Must match serverBase in @/fixtureCapture/main.
const port = 8931;
const marker = '<!-- captured ';
const fixturesDir = fileURLToPath(
  new URL('../../parseChat/fixtures', import.meta.url),
);

const fixtureFile = (slot: string): string => path.join(
  fixturesDir,
  `${slot}.html`,
);

// The fixture files on disk define the valid slots.
const validSlots = readdirSync(fixturesDir)
  .filter((name) => name.endsWith('.html'))
  .map((name) => name.slice(0, -'.html'.length));

// --refresh forgets prior captures, so every slot the page produces gets
// re-captured this run.
const captured = new Set(process.argv.includes('--refresh')
  ? []
  : validSlots.filter(
    (slot) => readFileSync(fixtureFile(slot), 'utf8').startsWith(marker),
  ));

const report = (): void => {
  const missing = validSlots.filter((slot) => !captured.has(slot));

  process.stdout.write(`captured ${captured.size}/${validSlots.length}${
    missing.length > 0 ? `; missing: ${missing.join(', ')}` : '; all slots'
  }\n`);
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
    || typeof parsed['slot'] !== 'string'
    || typeof parsed['html'] !== 'string'
    || !validSlots.includes(parsed['slot'])) {
    respond(response, 400, {
      error: 'expected {slot, html} with a known slot',
    });

    return;
  }

  writeFileSync(fixtureFile(parsed['slot']), `${marker}${
    new Date().toISOString().slice(0, 10)} -->\n${parsed['html'].trim()}\n`);

  captured.add(parsed['slot']);
  report();
  respond(response, 200, {
    captured: [...captured],
  });
};

createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/status') {
    respond(response, 200, {
      captured: [...captured],
    });

    return;
  }

  if (request.method === 'POST' && request.url === '/capture') {
    const chunks: Buffer[] = [];
    let size = 0;

    request.on('data', (chunk: Buffer) => {
      size += chunk.length;

      if (size > 2_000_000) {
        request.destroy();
      } else {
        chunks.push(chunk);
      }
    });

    request.on('end', () => {
      try {
        handleCapture(Buffer.concat(chunks).toString(), response);
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
