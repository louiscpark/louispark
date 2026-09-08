#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Resolves Vimeo poster frames and frame shapes at BUILD time so no page ever
// fetches them at runtime. Scans src/ for `vimeoId: "..."`, asks Vimeo's public
// oEmbed endpoint for each thumbnail and the video's own dimensions (no API key
// required), and writes the map to src/content/vimeo-posters.generated.ts.
//
// Run manually with `npm run posters`; runs automatically before `build`.
// If an id fails to resolve, its previously generated entry is kept; if there
// is none, the id is omitted — <LazyVimeo> then falls back to its flat surface
// and a 16:9 frame.
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

/** Previously generated entries, so a flaky network never drops a working poster. */
async function readPrevious() {
  try {
    const source = await readFile(OUT_FILE, "utf8");
    const previous = {};
    for (const [, id, body] of source.matchAll(/"(\d+)":\s*\{([^}]*)\}/g)) {
      const poster = body.match(/poster:\s*"([^"]+)"/)?.[1];
      const aspectRatio = body.match(/aspectRatio:\s*([\d.]+)/)?.[1];
      const entry = {};
      if (poster) entry.poster = poster;
      if (aspectRatio) entry.aspectRatio = Number(aspectRatio);
      if (Object.keys(entry).length > 0) previous[id] = entry;
    }
    return previous;
  } catch {
    return {};
  }
}

async function fetchMeta(id) {
  const endpoint = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=${THUMB_WIDTH}`;
  const res = await fetch(endpoint, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  const entry = {};

  if (typeof data.thumbnail_url === "string" && data.thumbnail_url) {
    entry.poster = data.thumbnail_url;
  }
  // The video's own dimensions, not the thumbnail's — this is what decides
  // whether the frame is landscape or portrait.
  if (Number(data.width) > 0 && Number(data.height) > 0) {
    entry.aspectRatio = Number((Number(data.width) / Number(data.height)).toFixed(4));
  }
  if (Object.keys(entry).length === 0) throw new Error("no poster or dimensions");

  return entry;
}

const ids = await collectIds();
const previous = await readPrevious();
const videos = {};

await Promise.all(
  ids.map(async (id) => {
    try {
      videos[id] = await fetchMeta(id);
      const { aspectRatio } = videos[id];
      const shape = aspectRatio ? (aspectRatio < 1 ? "portrait" : "landscape") : "unknown shape";
      console.log(`vimeo ${id}: resolved (${shape})`);
    } catch (err) {
      if (previous[id]) {
        videos[id] = previous[id];
        console.warn(`vimeo ${id}: ${err.message} — kept previous entry`);
      } else {
        console.warn(`vimeo ${id}: ${err.message} — falling back`);
      }
    }
  }),
);

const entries = Object.keys(videos)
  .sort()
  .map((id) => {
    const fields = [];
    if (videos[id].poster) fields.push(`poster: "${videos[id].poster}"`);
    if (videos[id].aspectRatio) fields.push(`aspectRatio: ${videos[id].aspectRatio}`);
    return `  "${id}": { ${fields.join(", ")} },`;
  })
  .join("\n");

await writeFile(
  OUT_FILE,
  `// GENERATED FILE — do not edit by hand.
// Written by scripts/fetch-vimeo-posters.mjs (npm run posters, and prebuild).
// Maps a Vimeo id to its poster frame and its aspect ratio (width / height),
// both resolved from Vimeo's public oEmbed API.

export type VimeoMeta = {
  poster?: string;
  /** width / height of the video itself. Below 1 means a portrait frame. */
  aspectRatio?: number;
};

export const VIMEO_META: Record<string, VimeoMeta | undefined> = ${entries ? `{\n${entries}\n}` : "{}"};
`,
  "utf8",
);

console.log(
  `vimeo: ${Object.keys(videos).length}/${ids.length} written to ${path.relative(root, OUT_FILE)}`,
);
