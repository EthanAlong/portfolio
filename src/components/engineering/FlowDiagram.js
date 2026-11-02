"use client"
/**
 * ============================================================
 * 【 FlowDiagram - 数据驱动的流程 / 架构图 】
 * ============================================================
 *
 * For cases whose repo is private (no public screenshot): boxes, edges that
 * draw in when the case row arrives, and blue packets running along the
 * edges (SMIL animateMotion, no JS per frame). Same visual language as
 * AgentLoop and DataFlow: black hairlines, one solid block for the step that
 * matters, blue only for data.
 *
 * spec = {
 *   id, title, footer,
 *   frames: [{ x, y, w, h, label }]                 dashed groups (e.g. Azure)
 *   nodes:  [{ id, x, y, w, h, title, lines, actor, solid, seq }]
 *   edges:  [{ from, to, d?, dashed, packets, seq, label, lx, ly }]
 * }
 * An edge without `d` runs straight from the right/bottom side of `from`
 * to the left/top side of `to`.
 *
 * Draw-in uses the .agentLoop rules in engineering.module.css
 * ([data-draw], [data-seq]); packets fade in after the strokes.
 * ============================================================
 */
import React, { useEffect, useRef } from 'react'

// ---------- UI TUNABLES ----------
const FD = {
  packetColor: '#0071e3',
  packetR: 3,
  duration: [2.2, 3.4], // seconds per trip, spread across edges
  stroke: '#1d1d1f',
  edge: '#a1a1a6',
  muted: '#6e6e73',
}

function anchor(n, side) {
  switch (side) {
    case 'r': return [n.x + n.w, n.y + n.h / 2]
    case 'l': return [n.x, n.y + n.h / 2]
    case 't': return [n.x + n.w / 2, n.y]
    case 'b': return [n.x + n.w / 2, n.y + n.h]
    default: return [n.x + n.w / 2, n.y + n.h / 2]
  }
}

/** Default edge: horizontal S-curve if the boxes sit side by side, vertical otherwise. */
function autoPath(a, b) {
  const horizontal = b.x >= a.x + a.w - 1 || a.x >= b.x + b.w - 1
  if (horizontal) {
    const [x1, y1] = anchor(a, b.x > a.x ? 'r' : 'l')
    const [x2, y2] = anchor(b, b.x > a.x ? 'l' : 'r')
    const mx = (x1 + x2) / 2
    return `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2 + (b.x > a.x ? -4 : 4)} ${y2}`
  }
  const [x1, y1] = anchor(a, b.y > a.y ? 'b' : 't')
  const [x2, y2] = anchor(b, b.y > a.y ? 't' : 'b')
  const my = (y1 + y2) / 2
  return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2 + (b.y > a.y ? -4 : 4)}`
}

export default function FlowDiagram({ spec, className }) {
  const svg = useRef(null)
  const byId = Object.fromEntries(spec.nodes.map((n) => [n.id, n]))
  const edges = spec.edges.map((e) => ({ ...e, d: e.d || autoPath(byId[e.from], byId[e.to]) }))
  const mk = `${spec.id}-arrow`

  // pause the SMIL clock off screen and for reduced motion
  useEffect(() => {
    const el = svg.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.pauseAnimations?.()
    if (reduced) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.unpauseAnimations?.()
      else el.pauseAnimations?.()
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const [d0, d1] = FD.duration

  return (
    <svg ref={svg} className={className} viewBox="0 0 640 400" role="img" aria-label={spec.aria}>
      {spec.title && (
        <text x="20" y="34" fontSize="11" fontWeight="900" letterSpacing="1.4" fill="#8a8a8a">{spec.title}</text>
      )}

      {(spec.frames || []).map((f) => (
        <g key={f.label} data-seq="0">
          <rect data-draw x={f.x} y={f.y} width={f.w} height={f.h} rx="12" fill="none"
            stroke={FD.packetColor} strokeOpacity="0.55" strokeWidth="1.1" strokeDasharray="5 4" pathLength="1" />
          <text x={f.x + 12} y={f.y + 18} fontSize="10" fontWeight="800" letterSpacing="1" fill={FD.packetColor}>
            {f.label}
          </text>
        </g>
      ))}

      {edges.map((e, i) => (
        <g key={`e${i}`} data-seq={e.seq ?? 1}>
          <path data-draw d={e.d} fill="none" stroke={FD.edge} strokeWidth="1.2"
            strokeDasharray={e.dashed ? '4 4' : undefined} pathLength="1" markerEnd={`url(#${mk})`} />
          {e.label && (
            <text x={e.lx} y={e.ly} fontSize="10" fill={FD.muted} textAnchor={e.anchor || 'start'}>{e.label}</text>
          )}
        </g>
      ))}

      {/* packets */}
      <g className="fd-packets">
        {edges.filter((e) => e.packets !== false).map((e, i) => {
          const dur = d0 + ((i * 7) % 10) / 10 * (d1 - d0)
          return (
            <circle key={`p${i}`} r={FD.packetR} fill={FD.packetColor}>
              <animateMotion dur={`${dur.toFixed(2)}s`} begin={`-${((i * 0.53) % dur).toFixed(2)}s`}
                repeatCount="indefinite" path={e.d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
            </circle>
          )
        })}
      </g>

      {spec.nodes.map((n) => (
        <g key={n.id} data-seq={n.seq ?? 0}>
          {n.actor && (
            <text x={n.x} y={n.y - 8} fontSize="10" fontWeight="700" letterSpacing="0.6" fill={FD.muted}>
              {n.actor.toUpperCase()}
            </text>
          )}
          <rect data-draw x={n.x} y={n.y} width={n.w} height={n.h} rx="10"
            fill={n.solid ? '#000' : '#fff'} stroke={FD.stroke} strokeWidth="1.2" pathLength="1" />
          <text x={n.x + 10} y={n.y + 20} fontSize="11.5" fontWeight="800" fill={n.solid ? '#fff' : '#000'}>{n.title}</text>
          {(n.lines || []).map((l, k) => (
            <text key={l} x={n.x + 10} y={n.y + 36 + k * 13} fontSize="10" fill={n.solid ? '#d2d2d7' : '#515154'}>{l}</text>
          ))}
        </g>
      ))}

      {spec.footer && (
        <text x="20" y="384" fontSize="10.5" fontWeight="900" letterSpacing="0.9" fill="#000" data-seq="4">{spec.footer}</text>
      )}

      <defs>
        <marker id={mk} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill={FD.edge} />
        </marker>
      </defs>
    </svg>
  )
}
