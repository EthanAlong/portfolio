"use client"
/**
 * ============================================================
 * 【 RoiExplorer - 内部工具 ROI 交互模块 】
 * ============================================================
 *
 * Rendered inside a project page as an `interactive` content block.
 * Everything on screen is computed live from roiModel.js: drag a slider and
 * the counter, the returns bar and the per-tool figures all re-flow.
 *
 * Three ideas, in order of importance:
 *   1. The counter: modelled dollars returned so far this calendar year,
 *      ticking in real time. It is the one bold element on the page.
 *   2. The returns bar: one track, one segment per tool, and a sliver at the
 *      end for the platform's whole run cost. The ratio is the argument.
 *   3. The assumptions are the interface: before / after / volume per tool,
 *      plus "halve every saving" so a sceptic can test the conclusion.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './roi.module.css'
import {
  TOOLS, ROLES, RUN_COST, SECONDS_PER_YEAR,
  hourly, toolHours, toolDollars, totals,
} from './roiModel'

const money0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const money2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const int = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

function kilo(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}K`
  return money0.format(n)
}

function minutes(m) {
  if (m >= 60) return `${(m / 60).toFixed(m % 60 === 0 ? 0 : 1)} h`
  if (m < 1 && m > 0) return `${Math.round(m * 60)} s`
  return `${m % 1 === 0 ? m : m.toFixed(1)} min`
}

function secondsIntoYear(now) {
  const start = new Date(now.getFullYear(), 0, 1)
  return (now - start) / 1000
}

/** Live counter: dollars per year × fraction of the year elapsed, refreshed ~12×/s. */
function useRunningTotal(dollarsPerYear) {
  // Starts at null so the server and the first client render agree (no hydration
  // mismatch from the clock); the real value arrives on the first tick after mount.
  const [value, setValue] = useState(null)
  const reduced = useRef(false)
  useEffect(() => {
    reduced.current = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let id
    const tick = () => {
      setValue(dollarsPerYear * (secondsIntoYear(new Date()) / SECONDS_PER_YEAR))
      if (!reduced.current) id = setTimeout(tick, 80)
    }
    tick()
    return () => clearTimeout(id)
  }, [dollarsPerYear])
  return value
}

export default function RoiExplorer() {
  const [tools, setTools] = useState(() => TOOLS.map(t => ({ ...t })))
  const [halved, setHalved] = useState(false)
  const [loaded, setLoaded] = useState(true)
  const [active, setActive] = useState(null)

  const scale = halved ? 0.5 : 1
  const sum = useMemo(() => totals(tools, scale, loaded), [tools, scale, loaded])
  const running = useRunningTotal(sum.dollars)

  const update = (id, key, v) =>
    setTools(ts => ts.map(t => (t.id === id ? { ...t, [key]: v } : t)))

  const reset = () => { setTools(TOOLS.map(t => ({ ...t }))); setHalved(false); setLoaded(true) }

  const barTotal = sum.dollars + sum.cost

  return (
    <section className={styles.roi} aria-label="Internal tools return on investment, interactive model">

      {/* 1. The counter */}
      <div className={styles.hero}>
        <p className={styles.heroLabel}>
          Staff time returned so far this year, at today&rsquo;s assumptions
        </p>
        <p className={styles.counter} aria-live="off">
          <span className={styles.counterValue}>{running == null ? ' ' : money2.format(running)}</span>
        </p>
        <p className={styles.heroSub}>
          <span>{kilo(sum.dollars)} a year</span>
          <span>{int.format(sum.hours)} staff hours</span>
          <span>{sum.multiple >= 10 ? `${Math.round(sum.multiple)}×` : `${sum.multiple.toFixed(1)}×`} the platform&rsquo;s run cost</span>
        </p>
      </div>

      {/* 2. The returns bar */}
      <div className={styles.barWrap}>
        <div className={styles.bar} role="img" aria-label={`Returns ${kilo(sum.dollars)} a year against run cost ${kilo(sum.cost)} a year`}>
          {tools.map(t => {
            const d = toolDollars(t, scale, loaded)
            const w = barTotal > 0 ? (d / barTotal) * 100 : 0
            return (
              <div
                key={t.id}
                className={`${styles.seg} ${active === t.id ? styles.segActive : ''}`}
                style={{ width: `${w}%` }}
                onMouseEnter={() => setActive(t.id)}
                onMouseLeave={() => setActive(null)}
                title={`${t.name}: ${kilo(d)} a year`}
              />
            )
          })}
          <div className={styles.cost} style={{ width: `${Math.max(0.6, (sum.cost / barTotal) * 100)}%` }} title={`Run cost: ${kilo(sum.cost)} a year`} />
        </div>
        <div className={styles.barLegend}>
          <span>returned</span>
          <span className={styles.barLegendCost}>run cost {kilo(sum.cost)} a year</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <label className={styles.toggle}>
          <input type="checkbox" checked={halved} onChange={e => setHalved(e.target.checked)} />
          <span>Halve every saving</span>
        </label>
        <label className={styles.toggle}>
          <input type="checkbox" checked={loaded} onChange={e => setLoaded(e.target.checked)} />
          <span>Loaded cost (salary × 1.3)</span>
        </label>
        <button type="button" className={styles.reset} onClick={reset}>Reset to measured defaults</button>
      </div>

      {/* 3. The assumptions */}
      <ol className={styles.tools}>
        {tools.map(t => {
          const d = toolDollars(t, scale, loaded)
          const h = toolHours(t, scale)
          const share = sum.dollars > 0 ? (d / sum.dollars) * 100 : 0
          return (
            <li
              key={t.id}
              className={`${styles.tool} ${active === t.id ? styles.toolActive : ''}`}
              onMouseEnter={() => setActive(t.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div className={styles.toolHead}>
                <div>
                  <h3 className={styles.toolName}>{t.name}</h3>
                  <p className={styles.toolTask}>{t.task}</p>
                </div>
                <div className={styles.toolFig}>
                  <span className={styles.toolDollars}>{kilo(d)}</span>
                  <span className={styles.toolHours}>{int.format(h)} h a year</span>
                </div>
              </div>

              <div className={styles.toolBarTrack}><div className={styles.toolBarFill} style={{ width: `${share}%` }} /></div>

              <div className={styles.sliders}>
                <Slider label="Before" value={t.before} min={t.range.before[0]} max={t.range.before[1]} step={t.before < 5 ? 0.25 : 1}
                  format={minutes} onChange={v => update(t.id, 'before', v)} />
                <Slider label="After" value={t.after} min={t.range.after[0]} max={t.range.after[1]} step={0.25}
                  format={minutes} onChange={v => update(t.id, 'after', v)} />
                <Slider label="Times a year" value={t.perYear} min={t.range.perYear[0]} max={t.range.perYear[1]} step={t.range.perYear[1] > 5000 ? 250 : 10}
                  format={v => int.format(v)} hint={t.volumeNote} onChange={v => update(t.id, 'perYear', v)} />
              </div>

              <p className={styles.toolMeta}>
                {ROLES[t.role].label} time at {money0.format(hourly(t.role, loaded))} an hour
                {t.note ? <> · {t.note}</> : null}
              </p>
            </li>
          )
        })}
      </ol>

      {/* Quiet projection */}
      <div className={styles.next}>
        <h3 className={styles.nextTitle}>Not in the total: agent-driven Revit</h3>
        <p>
          A model-context bridge now lets an agent work inside the Revit model directly. In the pilot it already
          builds sheets and batch-generates reinforcement unattended; what still needs a person is complex geometry,
          where someone has to look at the model in 3D and fix the one thing the agent cannot. The design target is
          roughly three times the project load per operator. It stays out of the figure above until it is measured.
        </p>
      </div>

      {/* Method */}
      <div className={styles.method}>
        <h3 className={styles.methodTitle}>How these numbers were made</h3>
        <p>
          Measured unit cost times projected volume. Every row is one task that changed: how long one person spent
          on one occurrence before, how long now, and how often it happens across the firm in a 250-day year, priced
          at the loaded hourly cost of the role doing it (drafter {money0.format(ROLES.drafter.salary)}, engineer{' '}
          {money0.format(ROLES.engineer.salary)}, document admin {money0.format(ROLES.admin.salary)}). The before and
          after times came from the people doing the work; the volumes from the project load at the time.
        </p>
        <p>
          The run cost is real: {money2.format(RUN_COST.measuredFirstThreeWeeks)} of cloud spend in the first three
          weeks of production, a {money0.format(RUN_COST.monthlyBudget)}-a-month budget agreed with IT, and model
          tokens metered per call (a drawing-set check costs about thirty cents, an RFI about three). Since October
          2026 the platform also logs every search and every completed add-in job, so the volumes above are being
          replaced by counts.
        </p>
        <p>
          What the model leaves out on purpose: the author&rsquo;s own time, the cost of a missed markup that is
          caught too late, and the half-days lost waiting for another firm&rsquo;s model. Halve every saving and
          the conclusion does not change, which is the point.
        </p>
      </div>
    </section>
  )
}

function Slider({ label, value, min, max, step, format, hint, onChange }) {
  const id = React.useId()
  return (
    <div className={styles.slider}>
      <div className={styles.sliderHead}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        aria-valuetext={format(value)}
      />
      {hint ? <span className={styles.sliderHint}>{hint}</span> : null}
    </div>
  )
}
