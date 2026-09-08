#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Downloads brand icons at BUILD time for the tools Simple Icons has no mark
// for. Scans src/ for `domain: "..."`, pulls each icon from Google's public
// favicon service (no API key required) into public/logos/, and writes the
// manifest to src/content/brand-logos.generated.ts.
//
// Run manually with `npm run logos`; runs automatically before `build`.
// A download that fails, returns a non-image, or returns something too small
// to be a real icon keeps whatever file is already on disk; with no file at
// all the domain is left out of the manifest and <StackLogo> renders that
// tool's text monogram instead. There is never a broken image.
// ---------------------------------------------------------------------------
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "src");
const LOGO_DIR = path.join(root, "public/logos");
const OUT_FILE = path.join(root, "src/content/brand-logos.generated.ts");
const ICON_SIZE = 128;
const TIMEOUT_MS = 10_000;
/** Anything smaller than this is an error page or a 1px placeholder, not an icon. */
const MIN_BYTES = 200;

const EXTENSIONS = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

/** followupboss.com -> followupboss-com */
const baseName = (domain) => domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

async function collectDomains() {
  const domains = new Set();
  for await (const file of walk(SRC_DIR)) {
    if (file === OUT_FILE) continue;
    const source = await readFile(file, "utf8");
    for (const m of source.matchAll(/domain:\s*"([^"]+)"/g)) domains.add(m[1]);
  }
  return [...domains].sort();
}

/** Any icon already on disk for this domain, so a flaky network never drops one. */
async function existingFile(domain, files) {
  const base = baseName(domain);
  return files.find((f) => f.replace(/\.[^.]+$/, "") === base);
}

async function download(domain) {
  const endpoint = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${ICON_SIZE}`;
  const res = await fetch(endpoint, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  const extension = EXTENSIONS[type];
  if (!extension) throw new Error(`not an image (${type || "no content-type"})`);

  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.byteLength < MIN_BYTES) throw new Error(`only ${bytes.byteLength} bytes`);

  return { file: `${baseName(domain)}${extension}`, bytes };
}

await mkdir(LOGO_DIR, { recursive: true });
const domains = await collectDomains();
const onDisk = await readdir(LOGO_DIR);
const logos = {};

await Promise.all(
  domains.map(async (domain) => {
    try {
      const { file, bytes } = await download(domain);
      await writeFile(path.join(LOGO_DIR, file), bytes);
      // A format change leaves the old extension behind — clear it out.
      for (const stale of onDisk) {
        if (stale !== file && stale.replace(/\.[^.]+$/, "") === baseName(domain)) {
          await unlink(path.join(LOGO_DIR, stale));
        }
      }
      logos[domain] = file;
      console.log(`brand logo ${domain}: ${file} (${bytes.byteLength} bytes)`);
    } catch (err) {
      const kept = await existingFile(domain, onDisk);
      if (kept) {
        logos[domain] = kept;
        console.warn(`brand logo ${domain}: ${err.message} — kept ${kept}`);
      } else {
        console.warn(`brand logo ${domain}: ${err.message} — falling back to monogram`);
      }
    }
  }),
);

const entries = Object.keys(logos)
  .sort()
  .map((domain) => `  "${domain}": "/logos/${logos[domain]}",`)
  .join("\n");

await writeFile(
  OUT_FILE,
  `// GENERATED FILE — do not edit by hand.
// Written by scripts/fetch-brand-logos.mjs (npm run logos, and prebuild).
// Maps a brand domain to its downloaded icon under public/logos/.

export const BRAND_LOGOS: Record<string, string | undefined> = ${entries ? `{\n${entries}\n}` : "{}"};
`,
  "utf8",
);

console.log(
  `brand logos: ${Object.keys(logos).length}/${domains.length} written to ${path.relative(root, OUT_FILE)}`,
);
