/**
 * AgentLoop — diagram for the "AI agent in production Revit models" case.
 * The repo behind it is private (client models), so this replaces a
 * screenshot: plan → approve → execute → log, with the rollback path.
 * Strokes draw in when the parent case row gets the `.shown` class
 * (see .agentLoop rules in engineering.module.css). Black hairlines on the
 * same light-gray stage as the screenshots; the human gate is the one
 * solid block.
 */
import React from 'react'

const NODES = [
  { x: 24, actor: 'AI agent', step: '01  PLAN', lines: ['drafts the script', 'and the edit list'] },
  { x: 178, actor: 'Engineer', step: '02  APPROVE', lines: ['reads the plan,', 'says yes or no'], gate: true },
  { x: 332, actor: 'Revit model', step: '03  EXECUTE', lines: ['every element', 'gets an AI- marker'] },
  { x: 486, actor: 'Shared log', step: '04  LOG', lines: ['before-state +', 'revert script'] },
]
const W = 130
const Y = 132
const H = 92

export default function AgentLoop({ className }) {
  return (
    <svg className={className} viewBox="0 0 640 400" role="img"
      aria-label="Approval-gated agent loop: the AI agent plans, an engineer approves, the edit runs in Revit with every element marked, and the before-state is logged so the task can be rolled back.">
      <text x="24" y="44" fontSize="11" fontWeight="900" letterSpacing="1.4" fill="#8a8a8a">APPROVAL-GATED AGENT LOOP</text>

      {NODES.map((n, i) => (
        <g key={n.step} data-seq={i}>
          <text x={n.x} y={Y - 14} fontSize="11" fontWeight="700" letterSpacing="0.6" fill="#6b6b6b">{n.actor.toUpperCase()}</text>
          <rect data-draw x={n.x} y={Y} width={W} height={H} fill={n.gate ? '#000' : 'none'} stroke="#000" strokeWidth="1.25" pathLength="1" />
          <text x={n.x + 12} y={Y + 26} fontSize="12" fontWeight="900" letterSpacing="0.8" fill={n.gate ? '#fff' : '#000'}>{n.step}</text>
          {n.lines.map((l, k) => (
            <text key={l} x={n.x + 12} y={Y + 52 + k * 17} fontSize="12" fill={n.gate ? '#e6e6e6' : '#333'}>{l}</text>
          ))}
          {i < NODES.length - 1 && (
            <path data-draw d={`M${n.x + W + 4} ${Y + H / 2} H${NODES[i + 1].x - 6}`} stroke="#000" strokeWidth="1.25" fill="none" pathLength="1" markerEnd="url(#al-arrow)" />
          )}
        </g>
      ))}

      {/* rollback: from LOG back under to EXECUTE */}
      <path data-draw data-seq="4" d={`M${486 + W / 2} ${Y + H + 4} V${Y + H + 54} H${332 + W / 2} V${Y + H + 10}`}
        stroke="#000" strokeWidth="1.25" strokeDasharray="4 4" fill="none" pathLength="1" markerEnd="url(#al-arrow)" />
      <text x={340} y={Y + H + 76} fontSize="11.5" fill="#333" data-seq="4">
        rollback: one filter on the “AI-” marker
      </text>

      {/* rejected plans never reach the model */}
      <path data-draw data-seq="1" d={`M${178 + W / 2} ${Y + H + 4} V${Y + H + 54} H${24 + W / 2} V${Y + H + 10}`}
        stroke="#9a9a9a" strokeWidth="1.25" fill="none" pathLength="1" markerEnd="url(#al-arrow-gray)" />
      <text x={24 + 4} y={Y + H + 76} fontSize="11.5" fill="#8a8a8a" data-seq="1">no → revise the plan</text>

      <text x="24" y="372" fontSize="11" fontWeight="900" letterSpacing="1" fill="#000" data-seq="4">34 PLANS APPROVED · EVERY WRITE REVERSIBLE</text>

      <defs>
        <marker id="al-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill="#000" />
        </marker>
        <marker id="al-arrow-gray" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill="#9a9a9a" />
        </marker>
      </defs>
    </svg>
  )
}
