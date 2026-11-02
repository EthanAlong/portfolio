// src/data/engineering.js
//
// Content for /engineering — the recruiter-first, skimmable view of the
// software work. The ring stays the main way into the portfolio; this page is
// the 30-second read for engineering / forward-deployed roles.
//
// Every number here is already stated in the matching case study
// (src/data/projects.js, rhinoProjects.js) or in the public repo's README.
// Don't add a figure here that isn't backed somewhere else.
// No client names, model ids or anything from private repos: this page is public.

export const engineeringIntro = {
  eyebrow: 'Engineering',
  headline: ['I sit with the people', 'who have the problem,', 'then ship the tool', 'they keep using.'],
  lede:
    'Senior BIM & Computational Designer at a structural engineering practice in Los Angeles. I find the slow, expensive step in how a team actually works, scope the smallest tool that removes it, deploy it inside the systems they already have (Revit, Rhino, Microsoft 365, Azure), and measure whether it stuck.',
}

export const proofPoints = [
  { value: '8', label: 'internal tools in production' },
  { value: '9', label: 'daily users across the practice' },
  { value: '89×', label: 'modelled return on run cost ($327K vs $3.7K a year)' },
  { value: '1,000+', label: 'structural details made searchable' },
]

export const workingMethod = [
  { step: 'Discover', text: 'Start next to the person doing the work: the PM filing RFIs, the drafter reopening a 40-minute model to copy one detail.' },
  { step: 'Scope', text: 'Pick the pain that costs the most hours, and the smallest thing that removes it. Know who has to say yes.' },
  { step: 'Ship', text: 'Deploy into what the team already runs. A log in the firm’s own Microsoft 365 means IT has nothing new to approve.' },
  { step: 'Adopt', text: 'Design for trust: approval gates so principals keep control, no-restart fixes because a Revit restart costs half an hour.' },
  { step: 'Measure', text: 'Time the task before and after, log real usage, and price the result against the run cost.' },
]

export const caseStudies = [
  {
    id: 'internal-tools-roi',
    title: 'Internal Tools ROI',
    context: 'Structural engineering practice · 2026',
    problem: 'Six months of internal tooling needed to justify itself in hours and dollars, not anecdotes.',
    built: 'A live ROI model priced task by task from before/after timings and measured run cost: detail search, drawing QA/QC, an RFI agent, detail downgrade, sheet-set printing, a family manager and a drafting-standards intake.',
    outcome: '8 tools, 9 daily users: about $327K a year of staff time returned against $3.7K to run (89×), hosting under $100 a month. Usage logging since October 2026 is replacing estimated volumes with counts.',
    stack: ['Discovery', 'Product ownership', 'Azure', 'Microsoft 365', 'React'],
    image: '/internal-tools-roi/hero.png',
    links: [{ label: 'Interactive model', href: '/project/internal-tools-roi' }],
  },
  {
    id: 'revit-agent',
    title: 'AI Agent in Production Revit Models',
    context: 'Structural engineering practice · Aviation · 2026',
    problem: 'Repetitive model and sheet edits on live production models eat drafting hours, but an AI writing to a shared central model with no review is a non-starter for the engineers who sign the drawings.',
    built: 'Claude Code and Codex drive Revit through an MCP bridge. Every write is a plan the engineer approves before it runs. Every element the agent touches carries an invisible marker, so a whole task can be found or rolled back with one filter. Risky batches log their before-state with a revert script, and a shared log lets any session, at home or in the office, pick up where the last one stopped.',
    outcome: '34 approved plans executed on live workshared models, including 63 revision clouds re-sequenced into a bulletin and 286 view overrides refreshed in single passes, each one reversible. Writes to the central model stay a human decision.',
    stack: ['Claude Code', 'Codex', 'MCP', 'Revit API', 'IronPython', 'Python'],
    diagram: 'agent-loop',
    links: [],
    note: 'Private repository: client models. Walkthrough on request.',
  },
  {
    id: 'rag-system',
    title: 'AI Detail Library',
    context: 'Structural engineering practice · 2025–26',
    problem: 'Finding the right standard detail meant remembering cryptic sheet numbers across a 1,000+ drawing library.',
    built: 'A Revit-side exporter tags details; vision-language models extract structured metadata; hybrid keyword + text + image-embedding retrieval with a second-pass AI check that filters near-miss results. Provisioned from infrastructure-as-code.',
    outcome: 'Validated through structured human evaluation before rollout; serves the full curated library in daily production use.',
    stack: ['Python', 'Azure AI Search', 'Bicep', 'VLM / embeddings', 'Revit API', 'React'],
    image: '/rag-system/1.webp',
    links: [{ label: 'Case study', href: '/project/rag-system' }],
  },
  {
    id: 'sb-web',
    title: 'Firm Web Platform & Project Atlas',
    context: 'Structural engineering practice · 2025–26',
    problem: 'The team needed one fast place to find any past project on the map and reach the engineering tools they use every day.',
    built: 'A login-gated platform: an interactive map of the firm’s projects (with a 3D campus view), a registry of in-house structural web tools, automated drawing QA/QC and an admin center for roles and usage.',
    outcome: 'The firm’s daily-driver platform. A new tool is a page plus a registry entry, live on the next deploy.',
    stack: ['Next.js', 'Supabase', 'Mapbox', 'Node'],
    image: '/sb-web/map1.webp',
    links: [{ label: 'Case study', href: '/project/sb-web' }],
  },
  {
    id: 'zoning-envelope',
    title: 'Zoning Envelope for Rhino',
    context: 'Development feasibility · 2026',
    problem: 'Early feasibility calls need the buildable envelope on screen while the massing is still moving.',
    built: 'A Rhino 8 plugin that turns setbacks, height, daylight planes, FAR and coverage into a live envelope and checks a massing against it, with per-facade opening limits. Each jurisdiction is a JSON rule file carrying its source and a verification note.',
    outcome: 'A new zone is a new file, not new code: the configuration-over-customization pattern that makes a tool portable to the next client.',
    stack: ['C#', 'RhinoCommon', 'Eto', 'JSON rules'],
    image: '/zoning-envelope/overview.webp',
    links: [
      { label: 'Case study', href: '/project/zoning-envelope' },
      { label: 'Code', href: 'https://github.com/EthanAlong/ZoningEnvelope', external: true },
    ],
  },
  {
    id: 'dtla-rent-tracker',
    title: 'DTLA Rent Tracker',
    context: 'Personal · 2026',
    problem: 'Walking into a lease renewal with no price history for the building or its comps.',
    built: 'A twice-daily GitHub Actions scraper over eight buildings on two leasing platforms (plain fetch, no browser), an append-only CSV, and a bilingual zoomable dashboard on GitHub Pages. A probe script tells you in one run whether a new building can be onboarded and which adapter it needs.',
    outcome: '~355 units per scrape. Concession banners are parsed into effective rent, and a moved banner is flagged as "check" instead of being logged as a fake "offer ended".',
    stack: ['Node', 'cheerio', 'GitHub Actions', 'ECharts'],
    image: '/dtla-rent-tracker/trend.webp',
    links: [
      { label: 'Live dashboard', href: 'https://ethanalong.github.io/dtla-rent-tracker/', external: true },
      { label: 'Code', href: 'https://github.com/EthanAlong/dtla-rent-tracker', external: true },
    ],
  },
  {
    id: 'store-equipment',
    title: 'Store Equipment Manager',
    context: 'Retail buildouts · 2025',
    problem: 'Store planners ran every new supermarket from a master spreadsheet, a tab per store, and spec PDFs linked out to Drive.',
    built: 'A Python step migrated the workbook and re-hosted the PDFs; a searchable catalog of 209 equipment cards and a drag-and-drop store builder replaced the tabs.',
    outcome: 'A finished schedule exports to a styled Excel workbook or a ZIP of every spec sheet, replacing hours of copy-paste per store.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Vercel'],
    image: '/store-equipment/1.webp',
    links: [{ label: 'Case study', href: '/project/store-equipment' }],
  },
  {
    id: 'unit-schedule-plugin',
    title: 'Unit Schedule Plugin',
    context: 'Multi-family residential · 2026',
    problem: 'Unit mix, area and open-space tallies for multi-family projects are slow to assemble by hand from the model.',
    built: 'A Revit 2025 add-in that scans rooms, detects unit types, tracks private and public open space, and shows a dashboard with CSV and report export.',
    outcome: 'The schedule is read straight from the model and refreshes without restarting the plugin.',
    stack: ['C#', '.NET 8', 'WPF / MVVM', 'Revit API'],
    image: '/unit-schedule-plugin/7.webp',
    links: [
      { label: 'Case study', href: '/project/unit-schedule-plugin' },
      { label: 'Code', href: 'https://github.com/EthanAlong/UnitSchedulePlugin', external: true },
    ],
  },
]

export const toolbox = [
  { group: 'AEC platforms', items: ['Revit API', 'RhinoCommon', 'Grasshopper', 'AutoCAD'] },
  { group: 'Languages', items: ['C# / .NET', 'Python', 'TypeScript', 'JavaScript'] },
  { group: 'AI', items: ['RAG / hybrid search', 'Vision-language extraction', 'Agents with human approval', 'Evaluation'] },
  { group: 'Cloud & delivery', items: ['Azure', 'Bicep', 'Supabase / Postgres', 'Vercel', 'GitHub Actions'] },
]

export const contact = {
  email: 'Ethan_along@outlook.com',
  linkedin: 'https://www.linkedin.com/in/yixiang-huang-08b70620a/',
  github: 'https://github.com/EthanAlong',
}
