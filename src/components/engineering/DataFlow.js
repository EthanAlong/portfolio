"use client"
/**
 * ============================================================
 * 【 DataFlow - 数据流区块 】
 * ============================================================
 *
 * Sources → one platform → tools, with blue packets running along the
 * curves. Horizontal on desktop, vertical (short labels) on phones.
 *
 * - Curves draw in when the section scrolls into view (stroke-dash, CSS).
 * - Packets are SMIL <animateMotion> along the same paths: no JS per frame.
 *   The SVG's animation clock is paused while off screen and stays paused
 *   (packets hidden) for prefers-reduced-motion.
 * - Blue (#0071e3) is reserved for data, same as the hero frame.
 * ============================================================
 */
import React, { useEffect, useRef, useState } from 'react'

// ---------- UI TUNABLES ----------
const FLOW = {
  sources: [
    { label: 'Revit models', short: 'Revit' },
    { label: 'Rhino', short: 'Rhino' },
    { label: 'Drawing sets (PDF)', short: 'PDFs' },
    { label: 'Microsoft 365', short: 'M365' },
  ],
  core: {
    title: 'Platform',
    lines: ['ingest · embed · check', 'Azure · Postgres', 'LLM + vision models'],
    short: ['ingest · embed · check', 'Azure · Postgres'],
  },
  outputs: [
    { label: 'Detail search', short: 'Search' },
    { label: 'Drawing QA/QC', short: 'QA/QC' },
    { label: 'RFI agent', short: 'RFI' },
    { label: 'Revit add-ins', short: 'Add-ins' },
  ],
  packetsPerPath: 2,
  duration: [2.8, 4.2],   // seconds per trip (spread across paths)
  packetColor: '#0071e3',
}

const MOBILE_BREAKPOINT = 768

/** Geometry for one orientation. Returns nodes and curves in viewBox units. */
function layout(vertical) {
  if (!vertical) {
    const W = 1180, H = 500
    const pill = { w: 220, h: 54 }
    const ys = [70, 180, 290, 400]
    const src = ys.map((y, i) => ({ x: 0, y, w: pill.w, h: pill.h, label: FLOW.sources[i].label }))
    const out = ys.map((y, i) => ({ x: W - pill.w, y, w: pill.w, h: pill.h, label: FLOW.outputs[i].label }))
    const core = { x: W / 2 - 150, y: 70, w: 300, h: 384 }
    const cy = core.y + core.h / 2
    const inPaths = src.map((n, i) => {
      const x1 = n.x + n.w, y1 = n.y + n.h / 2
      const x2 = core.x, y2 = cy - 60 + i * 40
      const mx = (x1 + x2) / 2
      return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
    })
    const outPaths = out.map((n, i) => {
      const x1 = core.x + core.w, y1 = cy - 60 + i * 40
      const x2 = n.x, y2 = n.y + n.h / 2
      const mx = (x1 + x2) / 2
      return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`
    })
    return { W, H, src, out, core, inPaths, outPaths, coreLines: FLOW.core.lines, font: 16 }
  }
  const W = 360, H = 640
  const pill = { w: 80, h: 44 }
  const xs = [0, 93, 187, 280]
  const src = xs.map((x, i) => ({ x, y: 0, w: pill.w, h: pill.h, label: FLOW.sources[i].short }))
  const out = xs.map((x, i) => ({ x, y: H - pill.h, w: pill.w, h: pill.h, label: FLOW.outputs[i].short }))
  const core = { x: 40, y: 230, w: 280, h: 180 }
  const cx = core.x + core.w / 2
  const inPaths = src.map((n, i) => {
    const x1 = n.x + n.w / 2, y1 = n.y + n.h
    const x2 = cx - 60 + i * 40, y2 = core.y
    const my = (y1 + y2) / 2
    return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`
  })
  const outPaths = out.map((n, i) => {
    const x1 = cx - 60 + i * 40, y1 = core.y + core.h
    const x2 = n.x + n.w / 2, y2 = n.y
    const my = (y1 + y2) / 2
    return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`
  })
  return { W, H, src, out, core, inPaths, outPaths, coreLines: FLOW.core.short, font: 13 }
}

function Pill({ n, font }) {
  return (
    <g className="df-node">
      <rect x={n.x + 0.5} y={n.y + 0.5} width={n.w - 1} height={n.h - 1} rx={n.h / 2} fill="#fff" stroke="#d2d2d7" />
      <text x={n.x + n.w / 2} y={n.y + n.h / 2 + font * 0.35} textAnchor="middle" fontSize={font} fontWeight="600" fill="#1d1d1f">
        {n.label}
      </text>
    </g>
  )
}

export default function DataFlow({ className }) {
  const svg = useRef(null)
  const [vertical, setVertical] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const onMq = () => setVertical(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  useEffect(() => {
    const el = svg.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.pauseAnimations?.()
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true)
        if (!reduced) el.unpauseAnimations?.()
      } else {
        el.pauseAnimations?.()
      }
    }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [vertical])

  const L = layout(vertical)
  const paths = [...L.inPaths, ...L.outPaths]
  const [d0, d1] = FLOW.duration

  return (
    <svg
      ref={svg}
      key={vertical ? 'v' : 'h'}
      className={`${className || ''} ${shown ? 'df-shown' : ''}`}
      viewBox={`-4 -4 ${L.W + 8} ${L.H + 8}`}
      role="img"
      aria-label="Data flow: Revit models, Rhino, drawing sets and Microsoft 365 feed one platform that ingests, embeds and checks them on Azure and Postgres with language and vision models; it serves detail search, drawing QA/QC, an RFI agent and Revit add-ins."
    >
      {/* curves */}
      {paths.map((d, i) => (
        <path key={`c${i}`} className="df-curve" d={d} pathLength="1" fill="none" stroke="#c7c7cc" strokeWidth="1.25"
          style={{ transitionDelay: `${(i < 4 ? 0.1 : 0.9) + (i % 4) * 0.08}s` }} />
      ))}

      {/* packets */}
      <g className="df-packets">
        {paths.map((d, i) =>
          Array.from({ length: FLOW.packetsPerPath }, (_, k) => {
            const dur = d0 + ((i * 7 + k * 3) % 10) / 10 * (d1 - d0)
            const begin = -((k / FLOW.packetsPerPath) * dur + (i % 4) * 0.37)
            return (
              <circle key={`p${i}-${k}`} r={vertical ? 3 : 3.5} fill={FLOW.packetColor}>
                <animateMotion dur={`${dur.toFixed(2)}s`} begin={`${begin.toFixed(2)}s`} repeatCount="indefinite" path={d}
                  keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
              </circle>
            )
          })
        )}
      </g>

      {/* nodes */}
      {L.src.map((n) => <Pill key={n.label} n={n} font={L.font} />)}
      {L.out.map((n) => <Pill key={n.label} n={n} font={L.font} />)}

      <g className="df-node df-core">
        <rect x={L.core.x} y={L.core.y} width={L.core.w} height={L.core.h} rx="22" fill="#1d1d1f" />
        <text x={L.core.x + L.core.w / 2} y={L.core.y + L.core.h / 2 - (L.coreLines.length * L.font * 0.8) / 2 - 6}
          textAnchor="middle" fontSize={L.font * 1.5} fontWeight="700" fill="#fff">
          {FLOW.core.title}
        </text>
        {L.coreLines.map((line, i) => (
          <text key={line} x={L.core.x + L.core.w / 2}
            y={L.core.y + L.core.h / 2 - (L.coreLines.length * L.font * 0.8) / 2 + 26 + i * L.font * 1.45}
            textAnchor="middle" fontSize={L.font * 0.9} fill="#a1a1a6">
            {line}
          </text>
        ))}
      </g>
    </svg>
  )
}
