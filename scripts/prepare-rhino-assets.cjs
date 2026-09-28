// Run from the portfolio root beside the three local plugin folders.
// Only resize/encode the original captures; no image content is altered.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');

const captures = {
  'ada-checker': {
    'floor-perspective': '../AdaChecker/docs/screenshots/auto_floor_perspective_clean.png',
    'floor-turning': '../AdaChecker/docs/screenshots/auto_floor_top_turning_only.png',
    'floor-doors': '../AdaChecker/docs/screenshots/auto_floor_top_doors_only.png',
    'room-detail': '../AdaChecker/docs/screenshots/auto_exam_perspective_clean.png',
  },
  'storage-planner': {
    setup: '../StoragePlanner/docs/screenshots/client/01_setup_floor_placeholders.png',
    'layout-3d': '../StoragePlanner/docs/screenshots/client/08_3d_overview_clean.png',
    'long-axis': '../StoragePlanner/docs/screenshots/client/02_variant_A_long_axis_clean.png',
    'short-axis': '../StoragePlanner/docs/screenshots/client/03_variant_B_short_axis_clean.png',
  },
  'zoning-envelope': {
    overview: '../ZoningEnvelope/artifacts/client/01-rhino-overview.png',
    'unit-planning': '../ZoningEnvelope/artifacts/client/02-rhino-unit-planning.png',
    requirements: '../ZoningEnvelope/artifacts/client/03-rhino-requirements.png',
  },
};

(async () => {
  for (const [project, files] of Object.entries(captures)) {
    const dest = path.join('public', project);
    await fs.mkdir(dest, { recursive: true });
    for (const [name, source] of Object.entries(files)) {
      await sharp(source).resize({ width: 2048, withoutEnlargement: true })
        .webp({ quality: 88 }).toFile(path.join(dest, `${name}.webp`));
    }
  }
  // Pass the three generated image paths in ADA, storage, zoning order.
  const covers = process.argv.slice(2);
  if (covers.length && covers.length !== 3) throw new Error('Supply exactly three cover paths.');
  for (let i = 0; i < covers.length; i++) {
    await sharp(covers[i]).resize({ width: 1536, withoutEnlargement: true })
      .webp({ quality: 88 }).toFile(path.join('public', Object.keys(captures)[i], 'cover.webp'));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
