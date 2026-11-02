# EthanDigital portfolio — notes for the next session

Next.js 16 (App Router) + React 19 + React Three Fiber, deployed on Vercel from
`main` (push = deploy). Live: https://www.ethanhdigital.com. Two audiences:
the **ring** (`/`, architecture + software projects) and **`/engineering`**
(the skimmable FDE / engineering view, linked when Ethan applies to jobs).

## Where things live

| Path | What |
|---|---|
| `src/app/layout.js` | Server root layout: site metadata (title template, OG), Vercel Analytics + Speed Insights for every page. |
| `src/components/site/SiteChrome.js` | Client nav: logo, **Portfolio \| Engineering** segmented switch (full-width navs only), ABOUT. |
| `src/data/projects.js`, `rhinoProjects.js` | Every ring project. `content` blocks: `textBlock`, `imageGrid`, `videoEmbed`, `interactive` (`component: 'roi' \| 'zoning' \| 'storage' \| 'ada'`). |
| `src/app/project/[id]/` | Project page (client) + `layout.js` (server: per-project title/OG via `generateMetadata`). Interactive blocks are wired in `page.js`, twice (mobile + desktop branches). |
| `src/app/engineering/` + `src/data/engineering.js` | The engineering page. All copy, numbers and case order are in the data file. `opengraph-image.js` = share card (Inter 900/500 bundled in `fonts/`, OFL). |
| `src/components/engineering/` | `StructureFrame` (3D hero, packets, scroll link), `DataFlow`, `FlowDiagram` (data-driven SVG for private repos; specs in `src/data/diagrams.js`), `AgentLoop`, `CountUp`. |
| `src/app/about/` + `src/data/about.js` | About: one data file for both layouts; `components/about/` = story + animated timeline. |
| `src/components/{zoning,storage,ada}/` | Playable sandboxes on those project pages; pure engines (`*Engine.js`) + UI. |
| `scripts/make-ring-thumbs.cjs` | **Re-run after adding a project**: 640 px ring thumbnails in `public/thumbs/` (home went 18.8 MB → 4.7 MB). |
| `src/app/sitemap.js`, `robots.js` | Generated from the project list. |

## Rules (agreed with Ethan)

- **Headlines are the only thing people read**: a few words, no sentences. Each
  engineering case = title + one-line result (`tagline`) + Problem/Built/Outcome.
- **Apple-like restraint**: white, black type, hairlines. **Blue `#0071e3` is
  reserved for "data"** (packets, flows, live/current markers, AZ-104).
  `docs/visual-direction.md` still applies to the ring (no grid view there).
- **Numbers must have a source.** ROI figures come from
  `src/components/roi/roiModel.js` (8 tools, ~$327K/yr vs $3.7K/yr = 89×);
  RFI/Azure/Revit-agent facts from the private SBRFI, SBAzureDeploy and
  SBRevitTrack repos; career facts from the private `resume` repo. Don't round up
  or invent; say "modelled" where it is a model.
- **De-identification**: the employer (Saiful Bouquet Structural Engineers) may be
  named; **clients, project names, people, hosts, element ids may not**. The
  Revit agent case says only "Aviation". Private repos get a FlowDiagram, never
  a screenshot with client data. No address, phone or visa status on the site.
- **Detail search is Postgres + pgvector** (Azure AI Search was retired 2026-08).
- Contact = **LinkedIn only** (the contact form was built and removed on purpose).
  No resume download (Ethan sends the link himself when applying).
- Every animation has a `prefers-reduced-motion` path; canvases stop rendering
  off screen.

## The ring (`src/components/canvas/RingInterface.js`)

- Every project is also a visually hidden link (`ProjectLinks`, class `ring-a11y` in
  `globals.css`), in ring order, rendered before mount too, so the server HTML links
  every project. The canvas is `aria-hidden`.
- Tab / ← → ↑ ↓ / Home / End move focus along that list; focus turns the ring
  (`rotationToFace`) and lifts the tile exactly like a hover. Desktop slot =
  `RING_PARAMS.desktop.selection.keyboardAngle` (front-left: tiles stand radially, so
  the front one is edge-on); mobile = the existing `selectionOffset` pop-out point.
  Enter plays the normal transition, Esc leaves. Arrow keys are only taken when focus is
  on the page or already in the list.
- `prefers-reduced-motion`: ring snaps instead of easing, no intro/return spin, no
  spin-and-expand on navigate, background network and arc glow stand still, CSS reveals
  render at rest.
- Central preview: textures load outside React (`loadCentralTexture`, LRU of 8, on-screen
  ones pinned), so a switch keeps the old picture until the new one is decoded, then
  crossfades (`central.fade`). Desktop preloads every main image at idle after the intro;
  mobile only the two either side of the one on show.
- Drag / swipe release carries on at release speed (`interaction.fling`); mobile then
  settles with the nearest project exactly at the pop-out point (`fling.snap`). A pause
  of >80 ms before letting go means "put it here". Headless drags are too slow to fling
  (events 120-400 ms apart under SwiftShader): test by dispatching events in-page.
- Cursor: `is-pointing` / `is-grabbing` classes on the wrapper, toggled directly (no
  re-render on hover).
- The central preview title uses `public/fonts/inter-latin-900-normal.woff` (OFL, copy of
  the engineering OG font). Without a `font`, drei `<Text>` / troika fetches a fallback
  font from jsdelivr at runtime. Image and title sit in separate Suspense boundaries.
- Headless screenshots of the ring: launch Chromium with
  `args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']`, otherwise the
  central preview never draws (default headless GL), on hover or keyboard alike.

## Verify before pushing

```bash
npx eslint src            # 0 errors expected (warnings only)
npm run build
npx next start -p 3123    # then check /, /engineering, /about, a project page on desktop + 390 px
```
Headless screenshots of the desktop project pages can show stale frames inside the
inner scroll container; check computed styles or a viewport screenshot instead.

## Backlog (rough priority)

1. Real 2x screenshots / GIFs from Ethan's Windows machine: Detail Viewer, ROI
   page, Detail DB Exporter, RhinoInitiator wizard, ZoningEnvelope run.
2. ~~Ring keyboard navigation / accessibility~~ done 2026-11-02 (see "The ring" above).
3. TOC / CHIP density-bonus calculator on the TOC project pages (parked; rules
   must be checked against the TOC Guidelines text).
4. ZoningEnvelope v0.7 (scheme comparison) is on Ethan's machine, not pushed.

## Other repos touched in the 2026-11-02 session

ZoningEnvelope, dtla-rent-tracker, UnitSchedulePlugin, RhinoInitiator,
ApartmentPriceTracking (README case-study rewrites, build output untracked),
EthanAlong/EthanAlong (profile README). All merged to `main`.
