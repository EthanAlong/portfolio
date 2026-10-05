// src/components/roi/roiModel.js
//
// The ROI model behind the "Internal Tools ROI" explorer. Pure data + pure
// functions so the numbers can be unit-checked and reused outside React.
//
// Method: measured unit cost × projected volume. "before" and "after" are the
// minutes one person spends on one occurrence of the task; "perYear" is how
// many times the task happens firm-wide in a year (250 working days). The rate
// is the loaded hourly cost of the role doing the task (salary ÷ 2,080 h × 1.3).

export const WORKING_DAYS = 250

export const ROLES = {
  drafter: { label: 'Drafter', salary: 75_000 },
  engineer: { label: 'Engineer', salary: 130_000 },
  admin: { label: 'Document admin', salary: 65_000 },
}

export const LOADED = 1.3

export function hourly(roleKey, loaded = true) {
  const base = ROLES[roleKey].salary / 2080
  return loaded ? base * LOADED : base
}

// Each tool is one task that changed. Every number here is the default a
// visitor can drag; the "source" line says where it came from.
export const TOOLS = [
  {
    id: 'library',
    name: 'Detail library',
    task: 'Find a comparable structural detail and bring it into the current set',
    role: 'drafter',
    before: 30,
    after: 5,
    perYear: 6 * 2 * WORKING_DAYS, // six drafters, at least two lookups a day
    volumeNote: '6 drafters × 2 lookups a day',
    range: { before: [5, 60], after: [1, 30], perYear: [250, 6000] },
    note: 'Opening the source model alone was 10–15 min, 40 on the two largest projects. Waiting on another firm’s model for access is not counted.',
  },
  {
    id: 'qaqc',
    name: 'Drawing QA/QC',
    task: 'Back-check that an engineer’s markup was actually picked up in the issued sheet',
    role: 'engineer',
    before: 7.5,
    after: 0.5,
    perYear: 2 * 30 * 0.75 * WORKING_DAYS, // two hospital projects, ~30 RFIs/day each, 0.75 sheet changes per RFI
    volumeNote: '2 projects × 30 RFIs a day × 0.75 sheet changes',
    range: { before: [2, 15], after: [0, 5], perYear: [1000, 20000] },
    note: 'Nobody had time to do this check by hand, so it was not happening. One missed markup had cost two to three engineer-days of recalculation.',
  },
  {
    id: 'rfi',
    name: 'RFI agent',
    task: 'Turn an RFI email into a filed package and a log row',
    role: 'admin',
    before: 3,
    after: 0.17,
    perYear: 60 * WORKING_DAYS,
    volumeNote: '~60 RFIs a day across two projects',
    range: { before: [1, 10], after: [0, 3], perYear: [1000, 25000] },
    note: 'Engineers were filing their own RFIs too, about an hour a day each; that time is in the next row.',
  },
  {
    id: 'rfi-eng',
    name: 'RFI agent, engineers’ share',
    task: 'The hour a day three engineers spent filing their own RFIs',
    role: 'engineer',
    before: 60,
    after: 3,
    perYear: 3 * WORKING_DAYS,
    volumeNote: '3 engineers × 1 hour a day',
    range: { before: [15, 120], after: [0, 30], perYear: [250, 2500] },
    note: 'Two project engineers and one senior engineer. Modelled at the same hour for all three.',
  },
  {
    id: 'downgrade',
    name: 'Revit detail downgrade',
    task: 'Reuse a Revit 2025 detail in a Revit 2022 project',
    role: 'drafter',
    before: 30,
    after: 0.17,
    perYear: 6 * 2.5 * 50,
    volumeNote: '6 drafters × 2–3 details a week',
    range: { before: [10, 60], after: [0, 10], perYear: [100, 2000] },
    note: 'Redrawing was the only option before. Ten engineers also spent about half an hour a week finding the source detail; that sits in the next row.',
  },
  {
    id: 'downgrade-eng',
    name: 'Detail downgrade, engineers’ share',
    task: 'Finding and coordinating the source detail for a downgrade',
    role: 'engineer',
    before: 30,
    after: 2,
    perYear: 10 * 50,
    volumeNote: '10 engineers × once a week',
    range: { before: [5, 60], after: [0, 15], perYear: [100, 1500] },
    note: '',
  },
  {
    id: 'printer',
    name: 'Sheet-set printing',
    task: 'Print, merge, bookmark and hyperlink a 200-page drawing set',
    role: 'drafter',
    before: 90,
    after: 5,
    perYear: 50,
    volumeNote: 'at least one set a week',
    range: { before: [30, 180], after: [0, 30], perYear: [12, 300] },
    note: 'The hour of printing still happens, but unattended on another machine. The babysitting, hand-combining and manual detail links are gone.',
  },
  {
    id: 'family',
    name: 'Family manager',
    task: 'Find and load the right Revit family',
    role: 'drafter',
    before: 20,
    after: 0,
    perYear: 9 * WORKING_DAYS,
    volumeNote: '9 users, 20 minutes a day each',
    range: { before: [5, 40], after: [0, 10], perYear: [500, 5000] },
    note: 'Counted as 20 minutes a day per person, no more. Four of the nine users are engineers; modelled at the drafter rate to stay conservative.',
  },
]

// Run cost of the whole platform (measured, then budgeted).
export const RUN_COST = {
  measuredFirstThreeWeeks: 16.82,
  monthlyBudget: 90,
  aiPerYear: 2600, // QA/QC ≈ $0.15 a page, RFI ≈ $0.03 each, at the default volumes
  perYear() {
    return this.monthlyBudget * 12 + this.aiPerYear
  },
}

export function toolHours(t, scale = 1) {
  const saved = Math.max(0, t.before - t.after) * scale
  return (saved / 60) * t.perYear
}

export function toolDollars(t, scale = 1, loaded = true) {
  return toolHours(t, scale) * hourly(t.role, loaded)
}

export function totals(tools, scale = 1, loaded = true) {
  const hours = tools.reduce((s, t) => s + toolHours(t, scale), 0)
  const dollars = tools.reduce((s, t) => s + toolDollars(t, scale, loaded), 0)
  const cost = RUN_COST.perYear()
  return { hours, dollars, cost, multiple: dollars / cost }
}

export const SECONDS_PER_YEAR = 365.25 * 24 * 3600
