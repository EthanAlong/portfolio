"use client"
/**
 * ============================================================
 * 【 StructureFrame - Engineering 首屏 3D 结构框架 】
 * ============================================================
 *
 * A procedurally generated steel frame (columns, beams, X-braces, joints)
 * that "prints" itself floor by floor, then turns slowly with a light mouse
 * parallax while a translucent analysis plane sweeps the height.
 *
 * Restrained on purpose (docs/visual-direction.md): black hairlines on white,
 * no glow, motion that explains "built structure" rather than decorates.
 *
 * - One BufferGeometry for all lines, ordered floor by floor, revealed with
 *   setDrawRange → one draw call, no per-frame allocation.
 * - Stops rendering when scrolled off screen (frameloop="never").
 * - prefers-reduced-motion: drawn complete, no rotation, no sweep.
 *
 * Tune everything in FRAME_PARAMS.
 * ============================================================
 */

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const FRAME_PARAMS = {
  bays: [4, 3],          // 开间数 X / Z
  bay: 1.0,              // 开间尺寸
  floors: 9,             // 层数
  floorHeight: 0.42,     // 层高
  setbackFrom: 6,        // 从第几层开始退台（上部少一个 X 开间）
  braceBays: [[0, 'x'], [3, 'x'], [1, 'z']], // 带斜撑的开间：[index, 面]
  buildSeconds: 3.4,     // 整栋"打印"完的时间
  buildDelay: 0.35,
  spinSpeed: 0.07,       // 自转速度 rad/s
  parallax: 0.22,        // 鼠标倾斜幅度
  lineOpacity: 0.42,
  braceOpacity: 0.2,
  sweepPeriod: 7,        // 扫描面往返周期（秒）
}

/** Build all segments, sorted by floor so drawRange reveals bottom → top. */
function buildFrame() {
  const { bays, bay, floors, floorHeight, setbackFrom, braceBays } = FRAME_PARAMS
  const [bx, bz] = bays
  const ox = (bx * bay) / 2
  const oz = (bz * bay) / 2
  const H = floors * floorHeight

  const lines = []   // [x1,y1,z1,x2,y2,z2]
  const braces = []
  const joints = []

  const nx = (f) => (f >= setbackFrom ? bx - 1 : bx) // 退台后的 X 开间数

  for (let f = 0; f < floors; f++) {
    const y0 = f * floorHeight - H / 2
    const y1 = y0 + floorHeight
    const cx = nx(f)

    // columns of this storey
    for (let i = 0; i <= cx; i++) {
      for (let k = 0; k <= bz; k++) {
        const x = i * bay - ox
        const z = k * bay - oz
        lines.push([x, y0, z, x, y1, z])
      }
    }
    // beams at the top of this storey
    for (let i = 0; i <= cx; i++) {
      for (let k = 0; k <= bz; k++) {
        const x = i * bay - ox
        const z = k * bay - oz
        if (i < cx) lines.push([x, y1, z, x + bay, y1, z])
        if (k < bz) lines.push([x, y1, z, x, y1, z + bay])
        joints.push([x, y1, z])
      }
    }
    // X-braces on chosen bays (front face for 'x', side face for 'z')
    braceBays.forEach(([idx, face]) => {
      if (face === 'x' && idx < cx) {
        const x = idx * bay - ox
        const z = -oz
        braces.push([x, y0, z, x + bay, y1, z], [x + bay, y0, z, x, y1, z])
      }
      if (face === 'z' && idx < bz) {
        const x = cx * bay - ox
        const z = idx * bay - oz
        braces.push([x, y0, z, x, y1, z + bay], [x, y0, z + bay, x, y1, z])
      }
    })
    lines.push(null) // floor marker
    braces.push(null)
    joints.push(null)
  }

  // Flatten and remember how many vertices each floor ends at
  const flatten = (arr, stride) => {
    const out = []
    const ends = []
    arr.forEach((s) => {
      if (s === null) ends.push(out.length / 3)
      else out.push(...s)
    })
    return { positions: new Float32Array(out), ends, stride }
  }

  return { lines: flatten(lines), braces: flatten(braces), joints: flatten(joints), H }
}

/** Vertex count to draw for a build progress p (0–1), interpolating inside a floor. */
function countAt(ends, p) {
  const floors = ends.length
  const fp = p * floors
  const f = Math.min(floors - 1, Math.floor(fp))
  const start = f === 0 ? 0 : ends[f - 1]
  const end = ends[f]
  const within = fp >= floors ? 1 : fp - f
  // keep counts even for LineSegments (pairs of vertices)
  const n = start + (end - start) * within
  return Math.floor(n / 2) * 2
}

function Frame({ reduced }) {
  const data = useMemo(() => buildFrame(), [])
  const group = useRef()
  const linesGeo = useRef()
  const bracesGeo = useRef()
  const jointsGeo = useRef()
  const sweep = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const t0 = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    if (t0.current === null) t0.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - t0.current
    const { buildSeconds, buildDelay, spinSpeed, parallax, sweepPeriod } = FRAME_PARAMS

    // build progress with ease-out
    const raw = reduced ? 1 : Math.min(1, Math.max(0, (t - buildDelay) / buildSeconds))
    const p = 1 - Math.pow(1 - raw, 2.2)
    linesGeo.current.setDrawRange(0, countAt(data.lines.ends, p))
    // braces trail the frame slightly
    bracesGeo.current.setDrawRange(0, countAt(data.braces.ends, Math.max(0, p - 0.06)))
    // joints: one vertex each, so no pairing
    const jEnds = data.joints.ends
    const jf = Math.min(jEnds.length, Math.floor(p * jEnds.length))
    jointsGeo.current.setDrawRange(0, jf === 0 ? 0 : jEnds[jf - 1])

    if (reduced) return

    // slow spin + parallax tilt (lerped)
    const g = group.current
    g.rotation.y += delta * spinSpeed
    g.rotation.x += ((mouse.current.y * parallax * 0.5 + 0.12) - g.rotation.x) * 0.05
    g.position.x += ((mouse.current.x * parallax * 0.6) - g.position.x) * 0.05

    // analysis sweep, only once the frame is up
    if (sweep.current) {
      const s = sweep.current
      const visible = raw >= 1
      const phase = (t / sweepPeriod) * Math.PI * 2
      s.position.y = Math.sin(phase) * (data.H / 2) * 0.92
      s.material.opacity += ((visible ? 0.05 : 0) - s.material.opacity) * 0.04
    }
  })

  const { bays, bay } = FRAME_PARAMS
  const w = bays[0] * bay + 0.6
  const d = bays[1] * bay + 0.6

  return (
    <group ref={group} rotation={[0.12, -0.7, 0]}>
      <lineSegments>
        <bufferGeometry ref={linesGeo}>
          <bufferAttribute attach="attributes-position" args={[data.lines.positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" transparent opacity={FRAME_PARAMS.lineOpacity} />
      </lineSegments>

      <lineSegments>
        <bufferGeometry ref={bracesGeo}>
          <bufferAttribute attach="attributes-position" args={[data.braces.positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#000000" transparent opacity={FRAME_PARAMS.braceOpacity} />
      </lineSegments>

      <points>
        <bufferGeometry ref={jointsGeo}>
          <bufferAttribute attach="attributes-position" args={[data.joints.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#000000" size={3} sizeAttenuation={false} transparent opacity={0.6} />
      </points>

      {/* analysis plane */}
      <mesh ref={sweep} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color="#000000" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function StructureFrame({ className }) {
  const wrap = useRef(null)
  const [visible, setVisible] = useState(true)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)

    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (wrap.current) io.observe(wrap.current)
    return () => {
      mq.removeEventListener('change', update)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <Canvas
        frameloop={!visible ? 'never' : reduced ? 'demand' : 'always'}
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 9.6], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Frame reduced={reduced} />
      </Canvas>
    </div>
  )
}
