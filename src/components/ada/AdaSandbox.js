"use client"
/**
 * AdaSandbox — a toilet room in plan with ADA clearances drawn on it.
 * Drag the 60" turning circle; change the room, the door and the toilet
 * position; every clearance turns green or red and the list explains why.
 * SVG + pointer events; checks in ./adaEngine.js.
 */
import React, { useRef, useState } from 'react'
import { DEFAULTS, plan } from './adaEngine'
import styles from './ada.module.css'

// ---------- UI TUNABLES ----------
const UI = {
  ok: 'rgba(52, 199, 89, 0.16)', okLine: '#248a3d',
  bad: 'rgba(255, 59, 48, 0.18)', badLine: '#d70015',
  wall: 6,          // wall thickness drawn, inches
  pad: 18,
}

const ftin = (n) => `${Math.floor(n / 12)}'-${n % 12}"`

export default function AdaSandbox() {
  const [width, setWidth] = useState(DEFAULTS.width)
  const [depth, setDepth] = useState(DEFAULTS.depth)
  const [doorClear, setDoorClear] = useState(DEFAULTS.doorClear)
  const [toiletCL, setToiletCL] = useState(DEFAULTS.toiletCL)
  const [circle, setCircle] = useState(DEFAULTS.circle)
  const svgRef = useRef(null)
  const drag = useRef(null)

  const r = plan({ width, depth, doorClear, toiletCL, circle })
  const by = Object.fromEntries(r.checks.map((c) => [c.id, c.pass]))
  const passed = r.checks.filter((c) => c.pass).length
  const tone = (ok) => (ok ? { fill: UI.ok, stroke: UI.okLine } : { fill: UI.bad, stroke: UI.badLine })

  const toPlan = (e) => {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(svg.getScreenCTM().inverse())
  }
  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toPlan(e)
    drag.current = { dx: p.x - circle.x, dy: p.y - circle.y }
  }
  const onMove = (e) => {
    if (!drag.current) return
    const p = toPlan(e)
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
    setCircle({
      x: Math.round(clamp(p.x - drag.current.dx, -10, width + 10)),
      y: Math.round(clamp(p.y - drag.current.dy, -10, depth + 10)),
    })
  }
  const onUp = () => { drag.current = null }
  const nudge = (e) => {
    const step = e.shiftKey ? 6 : 1
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (!d) return
    e.preventDefault()
    setCircle((c) => ({ x: c.x + d[0], y: c.y + d[1] }))
  }

  const W = UI.wall
  const { door, hinge, leaf } = r

  return (
    <div className={styles.sandbox} id="sandbox">
      <div className={styles.head}>
        <p className={styles.kicker}>Try it</p>
        <h3 className={styles.title}>Drag the wheelchair turn</h3>
        <p className={styles.lede}>
          A single-user toilet room with the clearances drawn in plan, the way the plugin draws them in the model.
          Move the 60&quot; turning circle, then squeeze the room: every check turns green or red, and says why.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.stage}>
          <svg ref={svgRef} className={styles.plan}
            viewBox={`${-UI.pad - W} ${-UI.pad - W} ${width + 2 * (UI.pad + W)} ${depth + 2 * (UI.pad + W) + 6}`}
            role="img" aria-label={`Toilet room ${ftin(width)} by ${ftin(depth)}: ${passed} of ${r.checks.length} checks pass`}>
            {/* walls with the door opening */}
            <path fillRule="evenodd" fill="#1d1d1f"
              d={`M${-W} ${-W} H${width + W} V${depth + W} H${door.x1} V${depth} H${width} V0 H0 V${depth} H${door.x0} V${depth + W} H${-W} Z`} />

            {/* clear floor spaces */}
            <rect x={r.toiletClear.x} y={r.toiletClear.y} width={r.toiletClear.w} height={r.toiletClear.h}
              {...tone(by['toilet-clear'])} strokeWidth="0.8" strokeDasharray="3 2" />
            <rect x={r.maneuver.x} y={r.maneuver.y} width={r.maneuver.w} height={r.maneuver.h}
              {...tone(by.maneuver)} strokeWidth="0.8" strokeDasharray="3 2" />

            {/* fixtures */}
            <rect x={r.lav.x} y={r.lav.y} width={r.lav.w} height={r.lav.h} rx="3" fill="#fff" stroke="#1d1d1f" strokeWidth="1" />
            <ellipse cx={r.lav.x + r.lav.w / 2} cy={r.lav.y + r.lav.h / 2 + 1} rx={r.lav.w / 2 - 5} ry={r.lav.h / 2 - 5} fill="none" stroke="#8e8e93" strokeWidth="0.8" />
            <rect x={r.toilet.x} y={0} width={r.toilet.w} height={8} fill="#fff" stroke="#1d1d1f" strokeWidth="1" />
            <ellipse cx={toiletCL} cy={18} rx={r.toilet.w / 2 - 1} ry={10} fill="#fff" stroke="#1d1d1f" strokeWidth="1" />
            <line x1={toiletCL} y1={-W} x2={toiletCL} y2={36} stroke={by['toilet-cl'] ? UI.okLine : UI.badLine} strokeWidth="0.7" strokeDasharray="2 2" />

            {/* door leaf + swing */}
            <line x1={hinge.x} y1={hinge.y} x2={hinge.x} y2={hinge.y - leaf} stroke="#1d1d1f" strokeWidth="1.6" />
            <path d={`M${hinge.x} ${hinge.y - leaf} A${leaf} ${leaf} 0 0 0 ${door.x0} ${hinge.y}`} fill="none"
              stroke={by.swing ? '#8e8e93' : UI.badLine} strokeWidth="0.8" strokeDasharray="2 2" />

            {/* turning circle (draggable) */}
            <g className={styles.handle} tabIndex={0} role="slider" aria-label="Turning circle position, use arrow keys"
              aria-valuetext={`${circle.x}, ${circle.y}`}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={nudge}>
              <circle cx={circle.x} cy={circle.y} r={30} {...tone(by.turning)} strokeWidth="1.2" />
              <circle cx={circle.x} cy={circle.y} r={2.2} fill={by.turning ? UI.okLine : UI.badLine} />
              <text x={circle.x} y={circle.y + 9} textAnchor="middle" fontSize="5" fontWeight="700" fill="#1d1d1f">60&quot; turn</text>
            </g>

            {/* dimensions */}
            <text x={width / 2} y={-W - 6} textAnchor="middle" fontSize="6" fill="#6e6e73">{ftin(width)}</text>
            <text x={width + W + 6} y={depth / 2} textAnchor="middle" fontSize="6" fill="#6e6e73"
              transform={`rotate(90 ${width + W + 6} ${depth / 2})`}>{ftin(depth)}</text>
          </svg>
        </div>

        <ol className={styles.checks} aria-live="polite">
          <li className={styles.summary}>
            <b>{passed}</b> / {r.checks.length} checks pass
          </li>
          {r.checks.map((c) => (
            <li key={c.id} className={c.pass ? styles.pass : styles.fail}>
              <i aria-hidden="true">{c.pass ? '✓' : '✕'}</i>
              <span className={styles.checkLabel}>{c.label}</span>
              <span className={styles.checkMeta}>§{c.ref} · {c.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.controls}>
        <label className={styles.slider}>
          <span>Room width <b>{ftin(width)}</b></span>
          <input type="range" min={72} max={132} step={1} value={width} onChange={(e) => setWidth(+e.target.value)} />
        </label>
        <label className={styles.slider}>
          <span>Room depth <b>{ftin(depth)}</b></span>
          <input type="range" min={84} max={132} step={1} value={depth} onChange={(e) => setDepth(+e.target.value)} />
        </label>
        <label className={styles.slider}>
          <span>Door clear width <b>{doorClear}&quot;</b></span>
          <input type="range" min={28} max={40} step={1} value={doorClear} onChange={(e) => setDoorClear(+e.target.value)} />
        </label>
        <label className={styles.slider}>
          <span>Toilet centerline <b>{toiletCL}&quot;</b></span>
          <input type="range" min={12} max={24} step={1} value={toiletCL} onChange={(e) => setToiletCL(+e.target.value)} />
        </label>
      </div>
      <p className={styles.note}>
        2010 ADA Standards, selected checks only. Like the plugin, a design-review aid rather than a compliance
        certification; grab bars, heights and reach ranges are not modelled here.
      </p>
    </div>
  )
}
