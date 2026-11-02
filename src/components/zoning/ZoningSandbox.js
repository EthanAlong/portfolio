"use client"
/**
 * ============================================================
 * 【 ZoningSandbox - 浏览器里的 Zoning Envelope 】
 * ============================================================
 *
 * A playable, simplified version of the ZoningEnvelope Rhino plugin: pick a
 * rule set, drag the lot size, and the buildable floor plates re-stack in 3D.
 * Plates inside the FAR budget are solid; plates the envelope allows but FAR
 * does not are outlines, so the governing rule is visible at a glance.
 *
 * - Engine: ./zoningEngine.js (pure, per-story, same method as the plugin).
 * - Plates ease to their new size every frame (no React state per frame).
 * - Drag to orbit; wheel zoom is off so the page scroll is never hijacked.
 * - Stops rendering off screen; no auto-rotate for reduced motion.
 * ============================================================
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { PRESETS, computeEnvelope } from './zoningEngine'
import styles from './zoning.module.css'

// ---------- UI TUNABLES ----------
const UI = {
  scale: 0.1,           // feet → scene units
  plateGap: 0.14,       // fraction of the story height left open between plates
  ease: 0.12,           // per-frame easing toward the target size
  built: '#f5f5f7',
  edge: '#1d1d1f',
  ghostEdge: '#a1a1a6',
  data: '#0071e3',
  lotFill: '#ececf0',
  fit: 12.5,            // the lot's diagonal (or 1.4 × height) maps to this many scene units
}

const fmt = (n) => Math.round(n).toLocaleString('en-US')

/** One floor plate that eases toward its target box. */
function Plate({ plate, lot, h }) {
  const ref = useRef()
  const s = UI.scale
  const target = useMemo(() => {
    const w = Math.max(0.01, (plate.x1 - plate.x0) * s)
    const d = Math.max(0.01, (plate.z1 - plate.z0) * s)
    const t = h * (1 - UI.plateGap) * s
    return {
      sx: w, sy: t, sz: d,
      x: ((plate.x0 + plate.x1) / 2 - lot.width / 2) * s,
      y: plate.y0 * s + t / 2,
      z: ((plate.z0 + plate.z1) / 2 - lot.depth / 2) * s,
    }
  }, [plate, lot.width, lot.depth, h, s])

  useFrame(() => {
    const m = ref.current
    if (!m) return
    const k = UI.ease
    m.scale.x += (target.sx - m.scale.x) * k
    m.scale.y += (target.sy - m.scale.y) * k
    m.scale.z += (target.sz - m.scale.z) * k
    m.position.x += (target.x - m.position.x) * k
    m.position.y += (target.y - m.position.y) * k
    m.position.z += (target.z - m.position.z) * k
  })

  const solid = plate.built > 0
  return (
    // start flat on its floor so new plates "grow" into place
    <mesh ref={ref} position={[target.x, plate.y0 * s, target.z]} scale={[target.sx, 0.001, target.sz]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={UI.built} transparent opacity={solid ? 1 : 0.06} depthWrite={solid} />
      <Edges color={solid ? UI.edge : UI.ghostEdge} threshold={15} />
    </mesh>
  )
}

/** Scales its children so the lot always fits the frame; eases on change. */
function FitGroup({ size, children }) {
  const ref = useRef()
  const target = UI.fit / size
  useFrame(() => {
    const g = ref.current
    if (g) g.scale.setScalar(g.scale.x + (target - g.scale.x) * UI.ease)
  })
  return <group ref={ref} scale={target}>{children}</group>
}

function Scene({ rule, lot, result, reduced }) {
  const s = UI.scale
  const W = lot.width * s
  const D = lot.depth * s
  const first = result.plates[0]
  const hx = W / 2
  const hz = D / 2

  // ground setback outline of the first floor plate
  const setback = first
    ? [
        [first.x0 * s - hx, 0.02, first.z0 * s - hz],
        [first.x1 * s - hx, 0.02, first.z0 * s - hz],
        [first.x1 * s - hx, 0.02, first.z1 * s - hz],
        [first.x0 * s - hx, 0.02, first.z1 * s - hz],
        [first.x0 * s - hx, 0.02, first.z0 * s - hz],
      ]
    : null

  // height limit drawn as a dashed rectangle over the lot
  const H = rule.maxHeight * s
  const cap = [[-hx, H, -hz], [hx, H, -hz], [hx, H, hz], [-hx, H, hz], [-hx, H, -hz]]

  // daylight plane (front), drawn from its start height up past the height limit
  let plane = null
  if (rule.plane) {
    const y0 = rule.plane.start * s
    const y1 = (rule.maxHeight + 6) * s
    const run = (y1 - y0) / Math.tan((rule.plane.angle * Math.PI) / 180)
    const z0 = rule.setbacks.front * s - hz
    plane = { y0, y1, z0, z1: z0 + run }
  }

  return (
    <>
      <ambientLight intensity={0.9} />
      <FitGroup size={Math.max(Math.hypot(W, D), H * 1.4)}>
      <directionalLight position={[6, 12, 8]} intensity={1.1} />

      {/* lot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshBasicMaterial color={UI.lotFill} />
      </mesh>
      <Line points={[[-hx, 0.01, -hz], [hx, 0.01, -hz], [hx, 0.01, hz], [-hx, 0.01, hz], [-hx, 0.01, -hz]]} color={UI.edge} lineWidth={1.2} />
      {/* street side marker */}
      <Line points={[[-hx, 0.01, -hz - 0.6], [hx, 0.01, -hz - 0.6]]} color={UI.ghostEdge} lineWidth={1} dashed dashSize={0.3} gapSize={0.2} />
      {setback && <Line points={setback} color={UI.data} lineWidth={1.4} dashed dashSize={0.25} gapSize={0.15} />}
      <Line points={cap} color={UI.ghostEdge} lineWidth={1} dashed dashSize={0.3} gapSize={0.25} />

      {plane && (
        <mesh position={[0, (plane.y0 + plane.y1) / 2, (plane.z0 + plane.z1) / 2]}
          rotation={[-(Math.PI / 2 - (rule.plane.angle * Math.PI) / 180), 0, 0]}>
          <planeGeometry args={[W, Math.hypot(plane.y1 - plane.y0, plane.z1 - plane.z0)]} />
          <meshBasicMaterial color={UI.data} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      {result.plates.map((p) => (
        <Plate key={p.story} plate={p} lot={lot} h={rule.storyHeight} />
      ))}

      </FitGroup>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reduced} autoRotateSpeed={0.6}
        minPolarAngle={0.35} maxPolarAngle={1.35} target={[0, 2.2, 0]} />
    </>
  )
}

export default function ZoningSandbox() {
  const [presetId, setPresetId] = useState('lamc-r3')
  const rule = PRESETS[presetId]
  const [width, setWidth] = useState(rule.lot.width)
  const [depth, setDepth] = useState(rule.lot.depth)
  const [adjacent, setAdjacent] = useState(true)
  const [visible, setVisible] = useState(true)
  const [reduced, setReduced] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => { mq.removeEventListener('change', onMq); io.disconnect() }
  }, [])

  const pick = (id) => {
    setPresetId(id)
    setWidth(PRESETS[id].lot.width)
    setDepth(PRESETS[id].lot.depth)
  }

  const lot = { width, depth, adjacentLowDensity: adjacent }
  const result = computeEnvelope(rule, lot)
  const t = result.totals
  const coverageOver = t.coverageAllowed && t.coverage > t.coverageAllowed + 0.05

  return (
    <div className={styles.sandbox} ref={wrap} id="sandbox">
      <div className={styles.head}>
        <p className={styles.kicker}>Try it</p>
        <h3 className={styles.title}>The envelope, in the browser</h3>
        <p className={styles.lede}>
          A simplified port of the plugin&apos;s per-story method. Solid floors fit the FAR budget; outlined floors fit the
          envelope but not the FAR. Drag to orbit.
        </p>
      </div>

      <div className={styles.stage}>
        <Canvas frameloop={visible ? 'always' : 'never'} dpr={[1, 2]} camera={{ position: [14, 11, 16], fov: 35 }}>
          <Scene rule={rule} lot={lot} result={result} reduced={reduced} />
        </Canvas>
        <div className={styles.legend} aria-hidden="true">
          <span><i className={styles.swSolid} /> within FAR</span>
          <span><i className={styles.swGhost} /> envelope only</span>
          <span><i className={styles.swLine} /> setbacks</span>
          {rule.plane && <span><i className={styles.swPlane} /> daylight plane</span>}
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.segmented} role="radiogroup" aria-label="Rule set">
          {Object.entries(PRESETS).map(([id, p]) => (
            <button key={id} type="button" role="radio" aria-checked={id === presetId}
              className={id === presetId ? styles.segOn : styles.seg} onClick={() => pick(id)}>
              {p.label}
            </button>
          ))}
        </div>

        <label className={styles.slider}>
          <span>Lot width <b>{width} ft</b></span>
          <input type="range" min={30} max={160} step={5} value={width} onChange={(e) => setWidth(+e.target.value)} />
        </label>
        <label className={styles.slider}>
          <span>Lot depth <b>{depth} ft</b></span>
          <input type="range" min={80} max={240} step={5} value={depth} onChange={(e) => setDepth(+e.target.value)} />
        </label>
        {rule.transitional && (
          <label className={styles.check}>
            <input type="checkbox" checked={adjacent} onChange={(e) => setAdjacent(e.target.checked)} />
            Low-density lot behind (transitional height)
          </label>
        )}
      </div>

      <dl className={styles.metrics}>
        <div><dt>Stories</dt><dd>{t.stories}</dd></div>
        <div><dt>Floor area</dt><dd>{fmt(t.builtArea)} <small>sf</small></dd></div>
        <div>
          <dt>FAR</dt>
          <dd>{t.far.toFixed(2)}{t.farAllowed != null && <small> / {t.farAllowed}</small>}</dd>
        </div>
        <div>
          {t.units != null ? (
            <><dt>Units by density</dt><dd>{t.units}</dd></>
          ) : (
            <><dt>Coverage</dt><dd className={coverageOver ? styles.warn : undefined}>{Math.round(t.coverage)}%{t.coverageAllowed && <small> / {t.coverageAllowed}%</small>}</dd></>
          )}
        </div>
      </dl>

      <p className={styles.governs}>
        <i className={styles.dot} /> Governing: <b>{t.governs}</b>
        {coverageOver && <span className={styles.warn}> · ground floor over the coverage limit</span>}
        <span className={styles.source}> · {rule.source}. Feasibility sketch, not a zoning determination.</span>
      </p>
    </div>
  )
}
