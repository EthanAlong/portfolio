"use client"
/**
 * StorageSandbox — playable plan generator for the Storage Planner project.
 * Change the floor, corridor or mix and the layout is regenerated: units
 * sweep in row by row, both orientations are scored, the better one is
 * flagged. SVG (crisp at any size), CSS animation, static for reduced motion.
 */
import React, { useMemo, useState } from 'react'
import { MIXES, UNIT_WIDTHS, alternatives } from './storageEngine'
import styles from './storage.module.css'

// ---------- UI TUNABLES ----------
const UI = {
  fill: { 5: '#dbe9fb', 10: '#a9cbf6', 15: '#5c9ced' }, // blue = rentable area (data)
  stroke: '#ffffff',
  outline: '#1d1d1f',
  staggerMs: 5,     // delay per unit as it sweeps in
  maxDelayMs: 900,
}

const pct = (x) => `${(x * 100).toFixed(1)}%`
const fmt = (n) => Math.round(n).toLocaleString('en-US')
const NAMES = { long: 'Long axis', short: 'Short axis' }

export default function StorageSandbox() {
  const [width, setWidth] = useState(160)
  const [depth, setDepth] = useState(100)
  const [corridor, setCorridor] = useState(5)
  const [mix, setMix] = useState('balanced')
  const [pick, setPick] = useState(null) // null = follow the recommendation

  const alts = useMemo(() => alternatives({ width, depth, corridor, unitDepth: 10, mix }), [width, depth, corridor, mix])
  const best = alts[0].orientation
  const shown = alts.find((a) => a.orientation === (pick || best))
  const r = shown.result
  const m = r.metrics
  const pad = 6
  const runKey = `${width}-${depth}-${corridor}-${mix}-${shown.orientation}`

  return (
    <div className={styles.sandbox} id="sandbox">
      <div className={styles.head}>
        <p className={styles.kicker}>Try it</p>
        <h3 className={styles.title}>A floor, laid out in a second</h3>
        <p className={styles.lede}>
          A browser sketch of the planner&apos;s method: corridor bands, back-to-back unit rows sized to a target mix,
          fixed spaces removed, and both orientations scored on rentable area and mix.
        </p>
      </div>

      <div className={styles.stage}>
        <svg viewBox={`${-pad} ${-pad} ${r.W + pad * 2} ${r.D + pad * 2}`} className={styles.plan}
          role="img" aria-label={`${NAMES[shown.orientation]} layout: ${m.unitCount} units, ${pct(m.efficiency)} rentable`}>
          <defs>
            <pattern id="sp-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="3" stroke="#c7c7cc" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={r.W} height={r.D} fill="#fff" />
          <g key={runKey}>
            {r.units.map((u, i) => (
              <rect key={i} className={styles.unit} x={u.x} y={u.y} width={u.w} height={u.h}
                fill={UI.fill[u.wft]} stroke={UI.stroke} strokeWidth="0.5"
                style={{ animationDelay: `${Math.min(i * UI.staggerMs, UI.maxDelayMs)}ms` }} />
            ))}
          </g>
          {r.leftover && (
            <rect x={r.leftover.x} y={r.leftover.y} width={r.leftover.w} height={r.leftover.h}
              fill="none" stroke="#a1a1a6" strokeWidth="0.4" strokeDasharray="1.5 1.5" />
          )}
          {r.reserved.map((z) => (
            <g key={z.label}>
              <rect x={z.x} y={z.y} width={z.w} height={z.h} fill="url(#sp-hatch)" stroke="#8e8e93" strokeWidth="0.4" />
              <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 1.2} textAnchor="middle" fontSize="3.4" fontWeight="600" fill="#515154">
                {z.label}
              </text>
            </g>
          ))}
          <rect x="0" y="0" width={r.W} height={r.D} fill="none" stroke={UI.outline} strokeWidth="0.8" />
          <text x={r.W / 2} y={-1.8} textAnchor="middle" fontSize="3.2" fill="#6e6e73">{width} ft</text>
          <text x={-1.8} y={r.D / 2} textAnchor="middle" fontSize="3.2" fill="#6e6e73" transform={`rotate(-90 ${-1.8} ${r.D / 2})`}>{depth} ft</text>
        </svg>
        <div className={styles.legend} aria-hidden="true">
          {UNIT_WIDTHS.map((w) => (
            <span key={w}><i style={{ background: UI.fill[w] }} /> {w}×10</span>
          ))}
          <span><i className={styles.swHatch} /> fixed spaces</span>
          <span><i className={styles.swLeft} /> unused</span>
        </div>
      </div>

      <div className={styles.compare} role="radiogroup" aria-label="Orientation">
        {alts.map((a) => (
          <button key={a.orientation} type="button" role="radio" aria-checked={a.orientation === shown.orientation}
            className={a.orientation === shown.orientation ? styles.optOn : styles.opt}
            onClick={() => setPick(a.orientation)}>
            <span className={styles.optName}>
              {NAMES[a.orientation]}
              {a.orientation === best && <em>Recommended</em>}
            </span>
            <span className={styles.optStat}>{pct(a.result.metrics.efficiency)} rentable · {a.result.metrics.unitCount} units</span>
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <label className={styles.slider}>
          <span>Floor width <b>{width} ft</b></span>
          <input type="range" min={80} max={240} step={5} value={width} onChange={(e) => { setWidth(+e.target.value); setPick(null) }} />
        </label>
        <label className={styles.slider}>
          <span>Floor depth <b>{depth} ft</b></span>
          <input type="range" min={60} max={160} step={5} value={depth} onChange={(e) => { setDepth(+e.target.value); setPick(null) }} />
        </label>
        <label className={styles.slider}>
          <span>Corridor <b>{corridor} ft</b></span>
          <input type="range" min={4} max={8} step={1} value={corridor} onChange={(e) => { setCorridor(+e.target.value); setPick(null) }} />
        </label>
        <div className={styles.segmented} role="radiogroup" aria-label="Unit mix">
          {Object.entries(MIXES).map(([id, x]) => (
            <button key={id} type="button" role="radio" aria-checked={id === mix}
              className={id === mix ? styles.segOn : styles.seg} onClick={() => { setMix(id); setPick(null) }}>
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <dl className={styles.metrics}>
        <div><dt>Units</dt><dd>{m.unitCount}</dd></div>
        <div><dt>Rentable</dt><dd>{fmt(m.rentable)} <small>sf</small></dd></div>
        <div><dt>Efficiency</dt><dd>{pct(m.efficiency)}</dd></div>
        <div><dt>Off target mix</dt><dd>{pct(m.mixDeviation)}</dd></div>
      </dl>
      <p className={styles.note}>
        5×10 · 10×10 · 15×10: {m.counts[5]} · {m.counts[10]} · {m.counts[15]}. A planning sketch: columns, egress
        distances and life-safety review are not modelled here.
      </p>
    </div>
  )
}
