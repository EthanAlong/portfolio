// src/data/diagrams.js
//
// Specs for <FlowDiagram/> (viewBox 640 × 400). Used where the repo is
// private and a screenshot would show client data. De-identified: no firm,
// project, person or host names.

export const rfiFlow = {
  id: 'rfi',
  title: 'RFI AGENT · EMAIL IN, FILED OUT',
  aria: 'RFI agent: the coordinator sends the email from an Outlook add-in, a cloud intake extracts the RFI with an LLM, she confirms it on a card, and a runner on her PC files the folder, PDF and email and appends the log row.',
  footer: '~60 A DAY · 3 MIN → 10 S EACH · LIVE IN TEN DAYS',
  nodes: [
    { id: 'mail', x: 20, y: 70, w: 140, h: 74, actor: 'Coordinator', title: 'Outlook add-in', lines: ['sends the RFI email', 'one click, no form'], seq: 0 },
    { id: 'intake', x: 225, y: 70, w: 160, h: 74, actor: 'Azure', title: 'Cloud intake', lines: ['queue + LLM: number, title,', 'dates, which project'], seq: 1 },
    { id: 'card', x: 450, y: 70, w: 170, h: 74, actor: 'Coordinator', title: 'Confirm card', lines: ['she checks and confirms;', 'duplicates flagged'], solid: true, seq: 2 },
    { id: 'runner', x: 450, y: 240, w: 170, h: 74, actor: 'Her PC', title: 'Runner', lines: ['scheduled task, polls', 'the cloud for jobs'], seq: 3 },
    { id: 'folder', x: 225, y: 240, w: 160, h: 74, actor: 'File share', title: 'Project folder', lines: ['folder · PDF · original .msg', 'named the project’s way'], seq: 3 },
    { id: 'log', x: 20, y: 240, w: 140, h: 74, actor: 'Excel / M365', title: 'RFI log row', lines: ['Graph API or .xlsx,', 'formulas + logo kept'], seq: 4 },
  ],
  edges: [
    { from: 'mail', to: 'intake', seq: 1 },
    { from: 'intake', to: 'card', seq: 2 },
    { from: 'card', to: 'runner', seq: 3 },
    { from: 'runner', to: 'folder', seq: 3 },
    { from: 'folder', to: 'log', seq: 4 },
    // per-project rules feed the intake and the filing
    { from: 'intake', to: 'folder', dashed: true, packets: false, seq: 2,
      d: 'M305 144 V236', label: 'project protocol (JSON)', lx: 313, ly: 196 },
  ],
}

export const azureMap = {
  id: 'azure',
  title: 'AZURE PLATFORM · CLIENTS → PROXY → ONE RESOURCE GROUP',
  aria: 'Azure platform: web tools and the Outlook add-in go through a session proxy with company sign-in; the Revit add-in and the RFI runner call the API with their own keys. One resource group in Bicep holds a Python Functions API, a Node QA/QC Functions app, six storage queues, Postgres with pgvector, blob storage and Azure OpenAI models.',
  footer: 'BICEP · BUDGET ALERTS · NAMED KEYS · HMAC IDENTITY · AZ-104',
  frames: [{ x: 268, y: 40, w: 360, h: 302, label: 'AZURE · ONE RESOURCE GROUP · BICEP' }],
  nodes: [
    { id: 'web', x: 16, y: 60, w: 112, h: 44, title: 'Web tools', lines: ['portal + suite'], seq: 0 },
    { id: 'outlook', x: 16, y: 120, w: 112, h: 44, title: 'Outlook add-in', lines: ['RFI intake'], seq: 0 },
    { id: 'revit', x: 16, y: 200, w: 112, h: 44, title: 'Revit add-in', lines: ['own key'], seq: 0 },
    { id: 'runner', x: 16, y: 260, w: 112, h: 44, title: 'RFI runner', lines: ['own key'], seq: 0 },
    { id: 'proxy', x: 150, y: 70, w: 96, h: 84, actor: 'Proxy', title: 'Session', lines: ['company', 'sign-in, holds', 'the keys'], solid: true, seq: 1 },
    { id: 'api', x: 284, y: 66, w: 128, h: 70, title: 'Functions · API', lines: ['Python: search,', 'RFI, protocols'], seq: 2 },
    { id: 'qaqc', x: 284, y: 166, w: 128, h: 56, title: 'Functions · QA/QC', lines: ['Node: long jobs'], seq: 2 },
    { id: 'queues', x: 284, y: 262, w: 128, h: 56, title: '6 storage queues', lines: ['jobs survive a', 'closed browser'], seq: 2 },
    { id: 'pg', x: 464, y: 66, w: 150, h: 58, title: 'Postgres + pgvector', lines: ['system of record,', 'hybrid search'], seq: 3 },
    { id: 'blob', x: 464, y: 160, w: 150, h: 50, title: 'Blob storage', lines: ['15-minute SAS links'], seq: 3 },
    { id: 'ai', x: 464, y: 246, w: 150, h: 60, title: 'Azure OpenAI', lines: ['extract · embed · verify', 'per-user cost logged'], seq: 3 },
  ],
  edges: [
    { from: 'web', to: 'proxy', seq: 1 },
    { from: 'outlook', to: 'proxy', seq: 1 },
    { from: 'revit', to: 'api', seq: 1, d: 'M128 222 C226 222 248 132 280 124' },
    { from: 'runner', to: 'api', seq: 1, d: 'M128 282 C236 282 256 140 280 130' },
    { from: 'proxy', to: 'api', seq: 2 },
    { from: 'proxy', to: 'qaqc', seq: 2 },
    { from: 'queues', to: 'qaqc', seq: 2 },
    { from: 'api', to: 'pg', seq: 3 },
    { from: 'api', to: 'blob', seq: 3 },
    { from: 'api', to: 'ai', seq: 3 },
    { from: 'qaqc', to: 'blob', seq: 3 },
    { from: 'qaqc', to: 'ai', seq: 3 },
  ],
}
