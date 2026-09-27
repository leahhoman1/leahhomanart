// Makes the web copies of your art that visitors see.
//
// For every image in src/art it writes a copy to src/generated/art that is:
//   - at most MAX_SIZE pixels on its longest side (fine on screen, poor for printing)
//   - signed with a small "© <your name>" in the bottom-right corner
// Your originals in src/art are never changed. src/generated is not saved to GitHub;
// it's rebuilt automatically before `npm run dev` and `npm run build`.
//
// Safe to change: MAX_SIZE, OPACITY, and SIZE_RATIO below.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MAX_SIZE = 1600; // longest side, in pixels
const OPACITY = 0.6; // 0 = invisible, 1 = solid white
const SIZE_RATIO = 0.032; // signature height relative to the image's shorter side

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src/art');
const OUT = path.join(ROOT, 'src/generated/art');
const FONT = path.join(ROOT, 'scripts/fonts/Fraunces_600SemiBold_Italic.ttf');
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8'));
const signature = `© ${site.name}`;
// If any setting changes, every image is redone.
const stamp = JSON.stringify({ MAX_SIZE, OPACITY, SIZE_RATIO, signature, v: 1 });
const stampFile = path.join(OUT, '.settings.json');

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return listImages(p);
    return EXTS.has(path.extname(d.name).toLowerCase()) ? [p] : [];
  });
}

async function textLayer(color, alpha, size) {
  const esc = signature.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return sharp({
    text: {
      text: `<span foreground="${color}" fgalpha="${Math.round(alpha * 100)}%">${esc}</span>`,
      font: `Fraunces ${size}`,
      fontfile: FONT,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

async function prepare(src, out) {
  const ext = path.extname(src).toLowerCase();
  const { data, info } = await sharp(src)
    .rotate() // respect phone/camera orientation
    .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: 'inside', withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });

  const size = Math.max(14, Math.round(Math.min(info.width, info.height) * SIZE_RATIO));
  const text = await textLayer('#ffffff', OPACITY, size);
  // Soft dark shadow so the signature reads on light and dark art alike
  const shadow = await sharp((await textLayer('#000000', OPACITY * 0.6, size)).data)
    .blur(Math.max(1, size / 12))
    .toBuffer();
  const margin = Math.round(size * 0.8);
  const left = Math.max(0, info.width - text.info.width - margin);
  const top = Math.max(0, info.height - text.info.height - margin);

  let img = sharp(data).composite([
    { input: shadow, left: left + 1, top: top + 2 },
    { input: text.data, left, top },
  ]);
  if (ext === '.jpg' || ext === '.jpeg') img = img.jpeg({ quality: 90, mozjpeg: true });
  else if (ext === '.png') img = img.png();
  else if (ext === '.webp') img = img.webp({ quality: 90 });
  else if (ext === '.avif') img = img.avif({ quality: 70 });
  else img = img.gif();

  fs.mkdirSync(path.dirname(out), { recursive: true });
  await img.toFile(out);
}

const sources = listImages(SRC);
const settingsChanged = !fs.existsSync(stampFile) || fs.readFileSync(stampFile, 'utf8') !== stamp;
let made = 0;

for (const src of sources) {
  const out = path.join(OUT, path.relative(SRC, src));
  const fresh = !settingsChanged && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;
  if (fresh) continue;
  try {
    await prepare(src, out);
    made++;
  } catch (err) {
    console.error(`[prepare-art] Could not process ${path.relative(ROOT, src)}: ${err.message}`);
    process.exitCode = 1;
  }
}

// Remove copies of images that were deleted from src/art
const wanted = new Set(sources.map((s) => path.join(OUT, path.relative(SRC, s))));
for (const out of listImages(OUT)) {
  if (!wanted.has(out)) fs.rmSync(out);
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(stampFile, stamp);
console.log(`[prepare-art] ${sources.length} artworks ready (${made} updated).`);
