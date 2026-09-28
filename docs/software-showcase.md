# Software & AI visual refresh

The portfolio keeps its existing ring navigation. All 11 Software & AI projects
now share a dark, dimensional concept-cover family. The three existing Rhino
covers are retained; eight additional covers were generated with the built-in
image generation tool. Existing project screenshots remain in the case studies.

## Final cover files

- `public/rag-system/cover.webp`
- `public/sb-web/cover.webp`
- `public/local-ai-deploy/cover.webp`
- `public/robotic-arms/cover.webp`
- `public/unit-schedule-plugin/cover.webp`
- `public/store-equipment/cover.webp`
- `public/ecommerce-tools/cover.webp`
- `public/teams-nudge/cover.webp`
- `public/ada-checker/cover.webp` (retained)
- `public/storage-planner/cover.webp` (retained)
- `public/zoning-envelope/cover.webp` (retained)

The first eight prompts are recorded verbatim in `software-cover-prompts.json`.
Their source filenames are in `software-cover-sources.json`. To reproduce the
WebP assets, run `node scripts/prepare-software-covers.cjs <source-directory>`.
The three Rhino cover prompts remain in `rhino-project-assets.md`.

Every cover is 1536 × 1024, encoded as WebP at quality 88. Both `ringImage` and
`mainImage` use the new artwork. A caption identifies each as an AI-generated
concept cover; software projects retain full-color imagery on desktop.

## Rhino workflow walkthroughs

`WorkflowDemo` presents actual captured Rhino states with a crossfade, concise
step descriptions, manual step selection, and play/pause controls. These are
explicitly labeled capture walkthroughs, not continuous screen recordings.

- ADA Checker: turning spaces → door clearances → 3D review.
- Storage Planner: reserved spaces → long-axis layout → short-axis layout → 3D study.
- Zoning Envelope: massing comparison → unit planning → requirement policies.

Steps are maintained in `src/data/rhinoWorkflows.js`. The new source captures
are recorded in `scripts/prepare-rhino-assets.cjs`; the other steps reuse the
case-study screenshots already in the site.

Autoplay advances every 4.5 seconds while the component is visible and the tab
is active. Selecting a step pauses the loop. Visitors requesting reduced motion
start paused and receive no crossfade; they can still explicitly press Play.
Buttons support keyboard interaction and expose the selected step to assistive
technology. Navigating between projects resets each walkthrough.
