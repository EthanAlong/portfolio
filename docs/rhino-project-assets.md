# Rhino plugin portfolio assets

Three project entries are maintained in `src/data/rhinoProjects.js` and included
in the existing Software & AI ring category. These are portfolio case studies,
not downloadable plugin distributions. Existing architectural projects retain
their metadata labels and image treatment.

## Assets

Each directory has one concept cover and actual Rhino captures. The original
case studies use three captures each; workflow walkthroughs add door-review and
floor-setup captures where needed:

- `public/ada-checker/`
- `public/storage-planner/`
- `public/zoning-envelope/`

The covers were generated with the built-in image generation tool. Their
conceptual nature is stated in each case study. Screenshots came from the local
plugin folders; `scripts/prepare-rhino-assets.cjs` records the exact source paths
and can reproduce their WebP encoding when those sibling folders are available.
No source model, client PDF, plugin source code, or binary is included.

All covers are 1536 × 1024. Captures retain their original aspect ratio, capped
at 2048 pixels wide. WebP quality is 88. The original colors are preserved on
the project pages because colors communicate analysis results.

## Final cover prompts

### ADA Checker

Create a sophisticated architectural software portfolio cover, landscape 1536x1024. ADA CHECKER concept: precision isometric miniature of a contemporary architectural floor plan floating on near-black graphite background. Ivory slim walls, a few door openings, luminous translucent emerald green cylindrical turning-space volumes and rectangular clearance zones, one subtle coral collision marker. Fine technical grid, meticulous CAD-like edges blended with beautiful physically based studio render, soft cinematic shadows, restrained mint glow. Object occupies central 70 percent with generous negative margins, legible at small thumbnail size. No text, no letters, no numbers, no interface, no logos. Premium Swiss architecture exhibition aesthetic, conceptual visualization rather than actual software screenshot.

### Storage Planner

Architectural software portfolio cover, landscape 1536x1024. STORAGE PLANNER concept: exquisitely precise isometric miniature self-storage facility floor, dozens of rectangular modules of varying sizes in orderly bands separated by clear circulation aisles. Matte ivory thin partitions, muted amber, terracotta, sage and pale blue modular cuboids, a subtle luminous amber circulation path. Entire rectangular model floats on near-black graphite background with delicate technical grid. Premium architectural model photography meets precise computational design render, soft studio lighting, rich shadows, restrained colors, beautifully coherent rhythm. Central composition with generous margins, legible thumbnail. No text, no letters, no numbers, no logos, no interface. Conceptual visualization, not a screenshot.

### Zoning Envelope

Architectural software portfolio cover, landscape 1536x1024. ZONING ENVELOPE concept: exquisite isometric architectural study model on a dark rectangular parcel plate. A matte ivory mid-rise courtyard building with clearly articulated floor slabs and stepped terraces is enclosed by a larger translucent icy blue buildable envelope with sloping upper setback planes. Thin cyan edges and fine setback lines on the parcel ground, tiny subdued surrounding context blocks. Near-black graphite infinite background with faint precise technical grid, premium architecture exhibition aesthetic, cinematic studio lighting and restrained luminous blue glass, physically based rendering, beautifully clear massing relationships. Entire object centered with generous negative margins, legible at thumbnail size. No text, numbers, letters, labels, interface, logos. Concept illustration, not a screenshot.
