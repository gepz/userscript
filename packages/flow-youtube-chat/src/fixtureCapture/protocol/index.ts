// Shared vocabulary of the capture protocol: both the userscript
// (@/fixtureCapture/main) and the ingest server (@/fixtureCapture/server)
// import this module, so the two sides cannot drift. The server runs it
// under node type stripping: erasable syntax only, no other imports.

// A capture kind is either a slot name (@/fixtureCapture/Slot) or the tag
// name of an unrecognized renderer; both go through the same /capture
// endpoint and the same per-kind bookkeeping.

export const port = 8931;

// Raw samples the server keeps per kind; further captures are rejected,
// and clients that see a full count stop sending that kind.
export const maxSamples = 3;

// Minimum spacing between accepted samples of one kind, so the samples
// come from distinct messages instead of one burst.
export const cooldownMs = 5000;

// Unrecognized kinds must look like custom-element tag names; passing this
// is also what makes any kind safe to embed in a filename.
export const tagPattern = /^[a-z][a-z0-9-]{0,99}$/;

// Raw sample files under capture-snapshots/, numbered 1..maxSamples.
export const sampleName = (
  kind: string,
  n: number,
): string => `sample-${kind}-${n}.html`;

// Settled twin of a raw sample: the same element re-serialized after its
// post-insert mutations went quiet. Present only when it differs from the
// insert-time form; the prefix keeps it invisible to the sample counter.
export const settledName = (
  kind: string,
  n: number,
): string => `settled-${kind}-${n}.html`;

// Body of every server response (status poll or capture, accepted or
// rejected): sample counts per kind, so clients resync instead of retrying.
export type KindCounts = Record<string, number>;
