/**
 * zoningEngine — a browser-sized port of the ZoningEnvelope Rhino plugin's
 * per-story method, for a rectangular lot with the street along the front.
 *
 * For every story it intersects the lot with the setbacks that apply at that
 * height (side yards that grow per story, upper-story stepbacks, a daylight
 * plane rising from the front setback line, transitional-height bands from
 * the rear lot line), giving one floor plate per story. Floor area is then
 * filled bottom-up until the FAR budget runs out, so the result shows which
 * rule actually governs.
 *
 * Pure functions, feet and square feet. Rule values are copied from the
 * plugin's JSON rule sets (src/ZoningEnvelope/codes in the plugin repo);
 * like the plugin, this is a feasibility sketch, not a zoning determination.
 */

export const PRESETS = {
  'lamc-r3': {
    label: 'Los Angeles R3',
    source: 'LAMC 12.10 C; 12.21.1 A.1',
    setbacks: { front: 15, side: 5, rear: 15, sidePerStoryAbove: 2, sidePerStory: 1, sideMax: 16 },
    maxHeight: 45,
    storyHeight: 10,
    far: 3.0,
    lotAreaPerUnit: 800,
    lot: { width: 50, depth: 150 },
  },
  'smmc-r2': {
    label: 'Santa Monica R2',
    source: 'SMMC 9.08.030; 9.21',
    setbacks: { front: 20, side: 8, rear: 15, narrowLotWidth: 50, narrowLotPct: 16, narrowLotMin: 4 },
    maxHeight: 30,
    maxStories: 2,
    storyHeight: 11,
    coverage: 45,
    stepback: { aboveStory: 1, feet: 2 },
    plane: { start: 23, angle: 45 },
    lot: { width: 50, depth: 150 },
  },
  'lamc-c2': {
    label: 'Los Angeles C2 1VL',
    source: 'LAMC 12.14; 12.21.1 A.1, A.10',
    setbacks: { front: 0, side: 0, rear: 0 },
    maxHeight: 45,
    maxStories: 3,
    storyHeight: 14,
    far: 1.5,
    transitional: [
      { upTo: 50, maxHeight: 25 },
      { upTo: 100, maxHeight: 33 },
      { upTo: 200, maxHeight: 61 },
    ],
    lot: { width: 100, depth: 150 },
  },
}

function sideYard(rule, story, lotWidth, { stepback = true } = {}) {
  const s = rule.setbacks
  let side = s.side
  // narrow lot: percentage of width, with a floor
  if (s.narrowLotWidth && lotWidth < s.narrowLotWidth) {
    side = Math.max(s.narrowLotMin || 0, (lotWidth * s.narrowLotPct) / 100)
  }
  // side yard grows one step per story above a given story
  if (s.sidePerStoryAbove && story > s.sidePerStoryAbove) {
    side = Math.min(s.sideMax ?? Infinity, side + (story - s.sidePerStoryAbove) * s.sidePerStory)
  }
  // upper-story stepback on the sides
  if (stepback && rule.stepback && story > rule.stepback.aboveStory) side += rule.stepback.feet
  return side
}

/**
 * @param {object} rule  a PRESETS entry
 * @param {{width:number, depth:number, adjacentLowDensity?:boolean}} lot
 * @returns {{plates: Array, totals: object}}
 */
export function computeEnvelope(rule, lot) {
  const { width: W, depth: D } = lot
  const lotArea = W * D
  const h = rule.storyHeight
  const maxStories = Math.min(rule.maxStories ?? Infinity, Math.floor(rule.maxHeight / h))
  const plates = []

  for (let story = 1; story <= maxStories; story++) {
    const top = story * h
    const side = sideYard(rule, story, W)
    let front = rule.setbacks.front
    let rear = rule.setbacks.rear
    const limits = []

    // daylight plane: rises at `angle` from the front setback line, starting at `start`
    if (rule.plane && top > rule.plane.start) {
      front += (top - rule.plane.start) / Math.tan((rule.plane.angle * Math.PI) / 180)
      limits.push('daylight plane')
    }
    // transitional height: bands measured from the rear (low-density) lot line
    if (rule.transitional && lot.adjacentLowDensity) {
      for (const band of rule.transitional) {
        if (top > band.maxHeight) rear = Math.max(rear, band.upTo)
      }
      if (rear > rule.setbacks.rear) limits.push('transitional height')
    }
    const base = sideYard(rule, story, W, { stepback: false })
    if (story > 1 && base > sideYard(rule, 1, W)) limits.push('side yard grows')
    if (side > base) limits.push('upper-story stepback')

    const x0 = side
    const x1 = W - side
    const z0 = front
    const z1 = D - rear
    const area = Math.max(0, x1 - x0) * Math.max(0, z1 - z0)
    if (area <= 0) break
    plates.push({ story, y0: top - h, y1: top, x0, x1, z0, z1, area, limits })
  }

  // fill floor area bottom-up until the FAR budget is spent
  const farBudget = rule.far ? rule.far * lotArea : Infinity
  let used = 0
  for (const p of plates) {
    const take = Math.max(0, Math.min(p.area, farBudget - used))
    p.built = take
    p.overFar = take < p.area - 0.5
    used += take
  }

  const envelopeArea = plates.reduce((s, p) => s + p.area, 0)
  const groundCoverage = plates[0] ? (plates[0].area / lotArea) * 100 : 0
  const units = rule.lotAreaPerUnit ? Math.floor(lotArea / rule.lotAreaPerUnit) : null

  let governs = 'height'
  if (rule.far && envelopeArea > farBudget + 0.5) governs = 'FAR'
  else if (plates.some((p) => p.limits.includes('daylight plane'))) governs = 'daylight plane'
  else if (plates.some((p) => p.limits.includes('transitional height'))) governs = 'transitional height'
  else if (rule.maxStories && plates.length === rule.maxStories) governs = 'story limit'

  return {
    plates,
    totals: {
      lotArea,
      stories: plates.length,
      envelopeArea,
      builtArea: used,
      far: used / lotArea,
      farAllowed: rule.far ?? null,
      coverage: groundCoverage,
      coverageAllowed: rule.coverage ?? null,
      units,
      governs,
    },
  }
}
