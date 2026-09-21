/**
 * Renders public/resume.html to public/louis-park-resume.pdf with headless
 * Chrome, so the Download PDF button hands over a real file rather than
 * opening a print dialog.
 *
 * The page carries its own print stylesheet: no beam, no cards, no gradients,
 * single column. Print media is emulated explicitly so what lands in the PDF
 * is exactly what that stylesheet describes, and page size and margins come
 * from the @page rule in the file rather than being set twice.
 *
 *   npm run resume:pdf
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { stat } from "node:fs/promises";
import puppeteer from "puppeteer";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const source = resolve(root, "public/resume.html");
const output = resolve(root, "public/louis-park-resume.pdf");

const browser = await puppeteer.launch();

try {
  const page = await browser.newPage();

  // networkidle0 so the Google Fonts stylesheet and its files are in before
  // the layout is measured; otherwise the PDF sets in the fallback stack.
  await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle0" });
  await page.emulateMediaType("print");
  await page.evaluate(() => document.fonts.ready);

  await page.pdf({
    path: output,
    format: "Letter",
    printBackground: false,
    preferCSSPageSize: true,
  });
} finally {
  await browser.close();
}

const { size } = await stat(output);
console.log(`resume pdf: ${output} (${(size / 1024).toFixed(0)} kB)`);
