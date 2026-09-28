// Only resize/encode the generated originals for web delivery; no compositing.
// Usage: node scripts/prepare-software-covers.cjs <generated-images-directory>
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const sources = require('../docs/software-cover-sources.json');

(async () => {
  if (!process.argv[2]) throw new Error('Provide the generated image directory.');
  for (const [id, filename] of Object.entries(sources)) {
    const dest = path.join('public', id, 'cover.webp');
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await sharp(path.join(process.argv[2], filename))
      .resize({width:1536, withoutEnlargement:true})
      .webp({quality:88}).toFile(dest);
    console.log(dest);
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
