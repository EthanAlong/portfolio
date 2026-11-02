// Ring thumbnails: every project's ringImage at 640 px wide, WebP q78,
// written to public/thumbs/<same path>.webp. The ring shows these; the
// centre preview and the project pages keep the full-size originals.
//
//   node scripts/make-ring-thumbs.cjs        (re-run after adding a project)
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

const WIDTH = 640;
const QUALITY = 78;

(async () => {
  // read the paths straight from the data files (they are ESM with
  // extension-less imports, which plain Node cannot load)
  const text = (await Promise.all(['src/data/projects.js', 'src/data/rhinoProjects.js']
    .map((f) => fs.readFile(f, 'utf8')))).join('\n');
  const srcs = [...new Set([...text.matchAll(/ringImage:\s*["']([^"']+)["']/g)].map((m) => m[1]))]
    .filter((s) => s.startsWith('/'));
  let before = 0;
  let after = 0;
  for (const src of srcs) {
    const input = path.join('public', src);
    const output = path.join('public', 'thumbs', src.replace(/\.(png|jpe?g|webp)$/i, '.webp'));
    await fs.mkdir(path.dirname(output), { recursive: true });
    await sharp(input).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(output);
    before += (await fs.stat(input)).size;
    after += (await fs.stat(output)).size;
  }
  console.log(`${srcs.length} thumbs · ${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(1)} MB`);
})();
