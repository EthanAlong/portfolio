/**
 * storageEngine — a browser sketch of the StoragePlanner method (the Rhino
 * plugin itself is C#; this is a re-implementation of the idea, not a port):
 * corridor bands across a rectangular floor, back-to-back unit rows between
 * them, unit widths picked to track a target mix, reserved zones removed,
 * and two orientations scored against each other.
 *
 * Feet, square feet. Pure functions.
 */

export const UNIT_WIDTHS = [5, 10, 15] // along the row; depth comes from the band
export const MIXES = {
  balanced: { label: 'Balanced', share: { 5: 0.3, 10: 0.45, 15: 0.25 } },
  small: { label: 'Small units', share: { 5: 0.55, 10: 0.35, 15: 0.1 } },
  large: { label: 'Large units', share: { 5: 0.15, 10: 0.35, 15: 0.5 } },
}

const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h

/** Fill one row of length `len` with widths chasing the target area shares. */
function fillRow(len, share, tally) {
  const out = []
  let x = 0
  while (true) {
    const left = len - x
    const fits = UNIT_WIDTHS.filter((w) => w <= left)
    if (!fits.length) break
    const total = UNIT_WIDTHS.reduce((s, w) => s + tally[w] * w, 0) || 1
    // biggest deficit vs the target area share wins
    fits.sort((a, b) => (share[b] - (tally[b] * b) / total) - (share[a] - (tally[a] * a) / total))
    const w = fits[0]
    out.push({ x, w })
    tally[w]++
    x += w
  }
  return { cells: out, waste: len - x }
}

/**
 * @param {{width:number, depth:number, corridor:number, unitDepth:number,
 *          mix:string, orientation:'long'|'short'}} p
 */
export function layout(p) {
  const share = MIXES[p.mix].share
  const W = p.width
  const D = p.depth
  // corridors run along the chosen axis; bands stack across the other one
  const along = p.orientation === 'long' ? Math.max(W, D) : Math.min(W, D)
  const across = p.orientation === 'long' ? Math.min(W, D) : Math.max(W, D)
  const alongIsX = p.orientation === 'long' ? W >= D : W < D

  // fixed spaces: entry + loading at the street corner, stair at the far corner
  const reserved = [
    { x: 0, y: 0, w: 24, h: 18, label: 'Entry / loading' },
    { x: W - 14, y: D - 22, w: 14, h: 22, label: 'Stair' },
  ]

  // band pattern across: unit row, corridor, unit row | unit row, corridor, unit row | ...
  const rows = []
  const corridors = []
  let c = 0
  while (true) {
    const need = p.unitDepth + p.corridor + p.unitDepth
    if (c + need > across + 0.001) break
    rows.push(c)
    corridors.push({ at: c + p.unitDepth, w: p.corridor })
    rows.push(c + p.unitDepth + p.corridor)
    c += need
  }
  const leftover = across - c

  const tally = { 5: 0, 10: 0, 15: 0 }
  const units = []
  let waste = 0
  const toXY = (a, b, la, lb) => (alongIsX ? { x: a, y: b, w: la, h: lb } : { x: b, y: a, w: lb, h: la })

  rows.forEach((r, ri) => {
    const { cells, waste: wst } = fillRow(along, share, tally)
    waste += wst * p.unitDepth
    cells.forEach((cell) => {
      const rect = toXY(cell.x, r, cell.w, p.unitDepth)
      const hit = reserved.find((z) => overlaps(rect, z))
      if (hit) {
        tally[cell.w]--
        return
      }
      units.push({ ...rect, size: `${cell.w}×${p.unitDepth}`, wft: cell.w, row: ri })
    })
  })

  const gross = W * D
  const rentable = units.reduce((s, u) => s + u.w * u.h, 0)
  const counts = UNIT_WIDTHS.reduce((o, w) => ((o[w] = units.filter((u) => u.wft === w).length), o), {})
  const areaBy = UNIT_WIDTHS.reduce((o, w) => ((o[w] = counts[w] * w * p.unitDepth), o), {})
  const mixDeviation = rentable
    ? UNIT_WIDTHS.reduce((s, w) => s + Math.abs(areaBy[w] / rentable - share[w]), 0) / 2
    : 1
  const efficiency = rentable / gross
  const score = efficiency - 0.5 * mixDeviation

  return {
    W, D, alongIsX, units, reserved,
    corridors: corridors.map((k) => toXY(0, k.at, along, k.w)),
    leftover: leftover > 0.5 ? toXY(0, c, along, leftover) : null,
    metrics: { gross, rentable, efficiency, mixDeviation, counts, score, unitCount: units.length },
  }
}

/** Both orientations, best first. */
export function alternatives(p) {
  return ['long', 'short']
    .map((o) => ({ orientation: o, result: layout({ ...p, orientation: o }) }))
    .sort((a, b) => b.result.metrics.score - a.result.metrics.score)
}
