#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Resolves Vimeo poster frames at BUILD time so no page ever fetches them at
// runtime. Scans src/ for `vimeoId: "..."`, asks Vimeo's public oEmbed endpoint
// for each thumbnail (no API key required), and writes the map to
// src/content/vimeo-posters.generated.ts.
//
// Run manually with `npm run posters`; runs automatically before `build`.
// If an id fails to resolve, its previously generated URL is kept; if there is
// none, the id is omitted and <LazyVimeo> falls back to its flat surface.
// ---------------------------------------------------------------------------
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "src");
const OUT_FILE = path.join(root, "src/content/vimeo-posters.generated.ts");
const THUMB_WIDTH = 1280;
const TIMEOUT_MS = 10_000;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

async function collectIds() {
  const ids = new Set();
  for await (const file of walk(SRC_DIR)) {
    if (file === OUT_FILE) continue;
    const source = await readFile(file, "utf8");
    for (const m of source.matchAll(/vimeoId:\s*"(\d+)"/g)) ids.add(m[1]);
  }
  return [...ids].sort();
}

/** Previously generated URLs, so a flaky network never drops a working poster. */
async function readPrevious() {
  try {
    const source = await readFile(OUT_FILE, "utf8");
    return Object.fromEntries(
      [...source.matchAll(/"(\d+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]),
    );
  } catch {
    return {};
  }
}

async function fetchThumbnail(id) {
  const endpoint = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=${THUMB_WIDTH}`;
  const res = await fetch(endpoint, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { thumbnail_url: url } = await res.json();
  if (typeof url !== "string" || !url) throw new Error("no thumbnail_url");
  return url;
}

const ids = await collectIds();
const previous = await readPrevious();
const posters = {};

await Promise.all(
  ids.map(async (id) => {
    try {
      posters[id] = await fetchThumbnail(id);
      console.log(`vimeo poster ${id}: resolved`);
    } catch (err) {
      if (previous[id]) {
        posters[id] = previous[id];
        console.warn(`vimeo poster ${id}: ${err.message} — kept previous URL`);
      } else {
        console.warn(`vimeo poster ${id}: ${err.message} — falling back`);
      }
    }
  }),
);

const entries = Object.keys(posters)
  .sort()
  .map((id) => `  "${id}": "${posters[id]}",`)
  .join("\n");

await writeFile(
  OUT_FILE,
  `// GENERATED FILE — do not edit by hand.
// Written by scripts/fetch-vimeo-posters.mjs (npm run posters, and prebuild).
// Maps a Vimeo id to its poster frame, resolved from Vimeo's public oEmbed API.

export const VIMEO_POSTERS: Record<string, string | undefined> = {
${entries}
};
`,
  "utf8",
);

console.log(
  `vimeo posters: ${Object.keys(posters).length}/${ids.length} written to ${path.relative(root, OUT_FILE)}`,
);
