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
  headline: ['Find the pain.', 'Ship the fix.', 'Measure it.'],
  lede:
    'Senior BIM & computational designer at a structural engineering practice in Los Angeles. I work next to the team, ship tools into the systems they already use (Revit, Rhino, Microsoft 365, Azure) and measure whether they stick.',
}

export const proofPoints = [
  { value: '8', label: 'tools in production' },
  { value: '9', label: 'daily users' },
  { value: '89×', label: 'return on run cost (modelled)' },
  { value: '1,000+', label: 'details searchable' },
]

export const dataFlow = {
  eyebrow: 'Data flow',
  heading: ['Model in.', 'Answers out.'],
  lede: 'Read from what the team already uses. Run through one small platform. Land back where the work happens.',
  stats: [
    { value: '4', label: 'sources' },
    { value: '1', label: 'platform' },
    { value: '8', label: 'tools' },
    { value: '9', label: 'daily users' },
  ],
}

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
    tagline: '$327K a year back. $3.7K to run.',
    context: 'Structural engineering practice · 2026',
    problem: 'Six months of internal tooling needed to justify itself in hours and dollars, not anecdotes.',
    built: 'A live ROI model priced task by task from before/after timings and measured run cost: detail search, drawing QA/QC, an RFI agent, detail downgrade, sheet-set printing, a family manager and a drafting-standards intake.',
    outcome: '8 tools, 9 daily users: about $327K a year of staff time returned against $3.7K to run (89×), hosting under $100 a month. Usage logging since October 2026 is replacing estimated volumes with counts.',
    stack: ['Discovery', 'Product ownership', 'Azure', 'Microsoft 365', 'React'],
    image: '/internal-tools-roi/hero.png',
    imageSize: [1200, 695],
    links: [{ label: 'Interactive model', href: '/project/internal-tools-roi' }],
  },
  {
    id: 'rfi-agent',
    title: 'RFI Agent',
    tagline: 'Email in. Folder, PDF and log row out.',
    context: 'Structural engineering practice · Construction administration · 2026',
    problem: 'The RFI coordinator filed about 60 RFIs a day by hand: download the PDF from the contractor’s portal, name the folder the project’s way, save the email, type the log row. Engineers filing their own lost about an hour a day each.',
    built: 'An Outlook add-in sends the email to an async Azure Functions intake; an LLM reads the number, title, dates and which project it belongs to; she confirms on a card in the portal; a small Windows runner files the folder, PDF and original .msg and appends the log row (Graph API for cloud workbooks, an XML-level edit for local ones so logos and formulas survive). Each project’s naming, log layout and due-date rule is a JSON protocol, not code; PDFs come from Procore links or Bluebeam Studio sessions.',
    outcome: 'Live in ten days, now on several active jobs. 3 min → 10 s per RFI, and the engineers’ hour a day back. Four layers of duplicate protection, because two people filing the same RFI was the real failure mode. On the RFIs and submittals replayed against her hand-filed ones, the folder names and log rows came out identical.',
    stack: ['Python', 'Azure Functions', 'Storage queues', 'Azure OpenAI', 'Microsoft Graph', 'Office add-in', 'PyInstaller'],
    diagram: 'rfi',
    links: [],
    note: 'Private repository: client correspondence. Walkthrough on request.',
  },
  {
    id: 'revit-agent',
    title: 'Revit AI Agent',
    tagline: 'AI edits live models. Engineers approve every write.',
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
    id: 'revit-suite',
    title: 'Revit Add-in Suite',
    tagline: 'Four daily Revit chores, one signed add-in.',
    context: 'Structural engineering practice · 2025–26',
    problem: 'Drafters lost hours a week inside Revit: opening a 40-minute model to copy one detail, redrawing details an older Revit could not open, babysitting a 200-page print.',
    built: 'One code-signed add-in suite, so IT installs it like any vendor tool. Each tool was scoped next to the person doing the task, and every fix ships with a no-restart workaround, because a Revit restart costs an engineer half an hour.',
    outcome: 'Before → after per occurrence, from timed runs: 30 min → 5 min to find and place a detail; 30 min → 10 s to reuse a 2025 detail in a 2022 project; 90 min → 5 min of hands-on time per drawing set.',
    spotlight: {
      label: 'Spotlight',
      title: 'AI Detail Library',
      text: 'A Revit-side exporter tags every standard detail. A vision-language model writes a structured record for each drawing; one Postgres query (pgvector) matches by keyword, meaning and image similarity, and a second AI pass drops near-misses. The model was picked by a blind evaluation of four frontier models, scored by six engineers in a review tool I built: the people who live with the results made the call, and it was adopted on day one. 1,000+ details, all of it reproducible from Bicep.',
    },
    tools: [
      { name: 'AI Detail Library', what: 'find a detail, bring it into the set', before: '30 min', after: '5 min' },
      { name: 'Detail Downgrade', what: 'reuse a 2025 detail in Revit 2022', before: '30 min', after: '10 s' },
      { name: 'Sheet-set Printing', what: 'print, merge, bookmark, link 200 pages', before: '90 min', after: '5 min' },
      { name: 'Family Manager', what: 'find and load the right family', before: '20 min / day', after: '≈ 0' },
    ],
    stack: ['C#', 'Revit API', 'WPF', 'Python', 'Postgres + pgvector', 'Azure Functions', 'Bicep'],
    image: '/rag-system/2.webp',
    imageSize: [1525, 816],
    imageAlt: 'AI Detail Library: a structural detail with its AI-generated summary, title, type and structural system',
    links: [{ label: 'Detail library case study', href: '/project/rag-system' }],
  },
  {
    id: 'azure-platform',
    title: 'Azure Platform',
    tagline: 'Every tool’s backend, rebuilt from one Bicep file.',
    context: 'Structural engineering practice · 2026 · Microsoft Certified: Azure Administrator Associate (AZ-104)',
    problem: 'The tools needed a backend the firm’s IT could audit, pay for and eventually take over: no secrets in browsers, predictable cost, nothing that only runs on one person’s machine.',
    built: 'Python and Node Azure Functions (Flex Consumption) behind a thin session proxy with company sign-in; Postgres Flexible Server with pgvector as the system of record; blob storage behind 15-minute SAS links; six storage queues so long jobs survive a closed browser; model deployments on Azure OpenAI. Named, separately rotatable keys per caller, HMAC identity tokens for attribution, budget alerts and per-user cost telemetry. Every resource is in Bicep; every infra change is shown as a what-if first.',
    outcome: 'Prototyped on a personal subscription, then moved into the company subscription as one replay of the same Bicep, with Contributor rights rather than Owner; the personal resource group was deleted a week later. IT got a written brief first: system map, access needed, run cost. Measured spend in the first three weeks of production: $16.82.',
    stack: ['Bicep', 'Azure Functions', 'PostgreSQL + pgvector', 'Blob + Queue Storage', 'Azure OpenAI', 'Entra ID', 'AZ-104'],
    diagram: 'azure',
    links: [],
    note: 'Private repository: company infrastructure. System map and IT brief on request.',
  },
  {
    id: 'outlook-mcp',
    title: 'Outlook MCP',
    tagline: 'Claude reads my mail. Only I can send it.',
    context: 'Personal · 2026 · built on an open-source (MIT) MCP server',
    problem: 'Anthropic’s Microsoft 365 connector covers work accounts only. I wanted Claude on the web, on my phone, in Claude Code and in a scheduled routine to triage my personal inbox for the job search, without a third-party relay holding the mail.',
    built: 'Forked an MIT-licensed Python MCP server for Outlook and added what it needed to run safely in the cloud: an owner allow-list so only my Microsoft account can sign in; a send allow-list, so even a prompt-injected “forward everything” can only reach me; OAuth dynamic client registration (RFC 7591) with loopback redirects (RFC 8252) so Claude Code can connect, with stateless signed client ids that survive restarts; sessions persisted to Key Vault through a managed identity. Deployed on Azure Container Apps with secrets as Key Vault references.',
    outcome: 'One endpoint for every Claude surface. Drafts by default; sending needs my approval for each message, enforced in the connector and again on the server. 24 tests cover the additions on top of the upstream suite.',
    stack: ['Python', 'FastMCP', 'Microsoft Graph', 'OAuth 2.1 / DCR', 'Azure Container Apps', 'Key Vault'],
    diagram: 'mail',
    links: [],
    note: 'Private repository: it names live endpoints. Walkthrough on request.',
  },
  {
    id: 'sb-web',
    title: 'Project Atlas',
    tagline: '200+ projects on a 3D globe.',
    context: 'Structural engineering practice · 2025–26',
    problem: 'The team needed one fast place to find any past project on the map, show it to a client, and reach the engineering tools they use every day.',
    built: 'A Mapbox GL globe of 200+ projects: select one and the camera flies into a 3D oblique view with the building extruded, drone-style multi-waypoint tours, Speckle 3D model embeds and campus roll-ups. Company sign-in through Azure AD, token-based public share links, and the calculators and QA/QC split into their own suite with a single-sign-on handoff.',
    outcome: 'Runs in production on Vercel, Render and Supabase with a mirrored staging stack: staging-first deploys, backups before every production migration, nightly database dumps.',
    stack: ['React 19', 'Vite', 'Mapbox GL', 'Express / Prisma', 'Supabase', 'Azure AD'],
    image: '/sb-web/map1.webp',
    imageSize: [2000, 1027],
    links: [{ label: 'Case study', href: '/project/sb-web' }],
  },
  {
    id: 'zoning-envelope',
    title: 'Zoning Envelope',
    tagline: 'A new zone is a JSON file, not new code.',
    context: 'Development feasibility · 2026',
    problem: 'Early feasibility calls need the buildable envelope on screen while the massing is still moving.',
    built: 'A Rhino 8 plugin that turns setbacks, height, daylight planes, FAR and coverage into a live envelope and checks a massing against it, with per-facade opening limits. Each jurisdiction is a JSON rule file carrying its source and a verification note.',
    outcome: 'A new zone is a new file, not new code: the configuration-over-customization pattern that makes a tool portable to the next client.',
    stack: ['C#', 'RhinoCommon', 'Eto', 'JSON rules'],
    image: '/zoning-envelope/overview.webp',
    imageSize: [1776, 791],
    links: [
      { label: 'Try it in the browser', href: '/project/zoning-envelope#sandbox' },
      { label: 'Case study', href: '/project/zoning-envelope' },
      { label: 'Code', href: 'https://github.com/EthanAlong/ZoningEnvelope', external: true },
    ],
  },
  {
    id: 'dtla-rent-tracker',
    title: 'DTLA Rent Tracker',
    tagline: '8 buildings, scraped twice a day.',
    context: 'Personal · 2026',
    problem: 'Walking into a lease renewal with no price history for the building or its comps.',
    built: 'A twice-daily GitHub Actions scraper over eight buildings on two leasing platforms (plain fetch, no browser), an append-only CSV, and a bilingual zoomable dashboard on GitHub Pages. A probe script tells you in one run whether a new building can be onboarded and which adapter it needs.',
    outcome: '~355 units per scrape. Concession banners are parsed into effective rent, and a moved banner is flagged as "check" instead of being logged as a fake "offer ended".',
    stack: ['Node', 'cheerio', 'GitHub Actions', 'ECharts'],
    image: '/dtla-rent-tracker/trend.webp',
    imageSize: [1600, 588],
    links: [
      { label: 'Live dashboard', href: 'https://ethanalong.github.io/dtla-rent-tracker/', external: true },
      { label: 'Code', href: 'https://github.com/EthanAlong/dtla-rent-tracker', external: true },
    ],
  },
  {
    id: 'store-equipment',
    title: 'Store Builder',
    tagline: 'A master spreadsheet became 209 searchable cards.',
    context: 'Retail buildouts · 2025',
    problem: 'Store planners ran every new supermarket from a master spreadsheet, a tab per store, and spec PDFs linked out to Drive.',
    built: 'A Python step migrated the workbook and re-hosted the PDFs; a searchable catalog of 209 equipment cards and a drag-and-drop store builder replaced the tabs.',
    outcome: 'A finished schedule exports to a styled Excel workbook or a ZIP of every spec sheet, replacing hours of copy-paste per store.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Prisma', 'Vercel'],
    image: '/store-equipment/1.webp',
    imageSize: [1440, 1700],
    mediaWidth: 640,  // tall screenshot: keep it from taking a whole screen
    links: [{ label: 'Case study', href: '/project/store-equipment' }],
  },
]

export const toolbox = [
  { group: 'AEC platforms', items: ['Revit API', 'RhinoCommon', 'Grasshopper', 'AutoCAD'] },
  { group: 'Languages', items: ['C# / .NET', 'Python', 'TypeScript', 'JavaScript'] },
  { group: 'AI', items: ['RAG / hybrid search', 'Vision-language extraction', 'Agents with human approval', 'Evaluation'] },
  { group: 'Cloud & delivery', items: ['Azure (AZ-104)', 'Bicep', 'Postgres + pgvector', 'Vercel / Render', 'GitHub Actions'] },
]

export const certification = {
  name: 'Microsoft Certified: Azure Administrator Associate',
  code: 'AZ-104',
}

export const contact = {
  email: 'Ethan_along@outlook.com',
  linkedin: 'https://www.linkedin.com/in/yixiang-huang-08b70620a/',
  github: 'https://github.com/EthanAlong',
}
