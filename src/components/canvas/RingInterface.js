"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

// --- 【恢复：设计师控制台】 ---
const CONFIG = {
  RING: {
    RADIUS: 17,          // 圆环半径
    IMAGE_W: 5,          // 圆环图片宽
    IMAGE_H: 4,          // 圆环图片高
    HOVER_OUT: 2,        // 悬停时向外偏移距离
    HOVER_UP: 1,         // 悬停时向上抬起高度
  },
  CENTRAL: {
    IMAGE_W: 10,         // 中间大图宽
    IMAGE_H: 7.5,        // 中间大图高
    Y_OFFSET: 1.5,       // 中间大图垂直位置 (1.5即中心点偏上)
    Z_OFFSET: -5.5,      // 中间大图深度位置
    BG_WIDTH: 15,        // 背景黑框宽
    BG_HEIGHT: 24,       // 背景黑框高
    BG_OPACITY: 0.6,     // 背景黑框透明度
  },
  CAMERA: {
    POSITION: [0, 15, 40], // 相机位置 [X, Y, Z]
    FOV: 60,               // 相机视角
  },
  INTERACTION: {
    WHEEL_SPEED: 0.002,    // 滚轮灵敏度
    DRAG_SPEED: 0.005,     // 拖拽灵敏度
    DAMPING: 4,            // 惯性阻尼
  }
}

function ProjectItem({ item, index, total, setActiveProject }) {
  const router = useRouter()
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const angle = (index / total) * Math.PI * 2
  const currentRadius = useRef(CONFIG.RING.RADIUS)

  useFrame((state, delta) => {
    if (!ref.current) return
    const targetRadius = hovered ? CONFIG.RING.RADIUS + CONFIG.RING.HOVER_OUT : CONFIG.RING.RADIUS
    currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, 0.1)
    ref.current.position.set(Math.sin(angle) * currentRadius.current, THREE.MathUtils.lerp(ref.current.position.y, hovered ? CONFIG.RING.HOVER_UP : 0, 0.1), Math.cos(angle) * currentRadius.current)
    const s = hovered ? 1.1 : 1
    ref.current.scale.set(THREE.MathUtils.lerp(ref.current.scale.x, CONFIG.RING.IMAGE_W * s, 0.1), THREE.MathUtils.lerp(ref.current.scale.y, CONFIG.RING.IMAGE_H * s, 0.1), 1)
  })

  return (
    <Suspense fallback={null}>
      {item.ringImage && (
        <Image
          ref={ref}
          url={item.ringImage}
          transparent
          side={THREE.DoubleSide}
          rotation={[0, angle + Math.PI / 2, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); setActiveProject(item); }}
          onPointerOut={() => setHover(false)}
          onClick={() => router.push(`/project/${item.id}`)}
        />
      )}
    </Suspense>
  )
}

function CentralDisplay({ activeProject }) {
  const router = useRouter()
  const group = useRef()
  const [isExpanding, setIsExpanding] = useState(false)

  useFrame((state) => {
    if (!group.current) return
    group.current.lookAt(state.camera.position)
    if (isExpanding) {
      group.current.scale.lerp(new THREE.Vector3(5, 5, 5), 0.15)
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 20, 0.15)
    }
  })

  if (!activeProject) return null

  return (
    <group ref={group} position={[0, 0, 0]} onClick={() => { setIsExpanding(true); setTimeout(() => router.push(`/project/${activeProject.id}`), 300) }}>
      {/* 黑色背景框 */}
      <mesh position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET - 0.1]}>
        <planeGeometry args={[CONFIG.CENTRAL.BG_WIDTH, CONFIG.CENTRAL.BG_HEIGHT]} />
        <meshBasicMaterial color="#000" transparent opacity={CONFIG.CENTRAL.BG_OPACITY} />
      </mesh>
      {/* 修正：增加 URL 判断防止崩溃 */}
      <Suspense fallback={null}>
        {activeProject.mainImage && (
          <Image url={activeProject.mainImage} scale={[CONFIG.CENTRAL.IMAGE_W, CONFIG.CENTRAL.IMAGE_H]} position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET]} transparent />
        )}
      </Suspense>
      <Text position={[0, CONFIG.CENTRAL.Y_OFFSET - (CONFIG.CENTRAL.IMAGE_H / 2 + 1.5), CONFIG.CENTRAL.Z_OFFSET + 0.1]} fontSize={0.8} color="white">
        {activeProject.title.toUpperCase()}
      </Text>
    </group>
  )
}

function SceneContent({ targetRotation, setActiveProject, activeProject }) {
  const rigRef = useRef()
  const scrollRotation = useRef(0)
  useFrame((state, delta) => {
    scrollRotation.current = THREE.MathUtils.damp(scrollRotation.current, targetRotation.current, CONFIG.INTERACTION.DAMPING, delta)
    if (rigRef.current) rigRef.current.rotation.y = scrollRotation.current
  })
  return (
    <>
      <group ref={rigRef}>
        {projects.map((item, i) => (
          <ProjectItem key={item.id} index={i} total={projects.length} item={item} setActiveProject={setActiveProject} />
        ))}
      </group>
      <CentralDisplay activeProject={activeProject} />
    </>
  )
}

export default function RingInterface() {
  const [activeProject, setActiveProject] = useState(null)
  const targetRotation = useRef(0)
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)

  useEffect(() => {
    const handleWheel = (e) => { targetRotation.current -= e.deltaY * CONFIG.INTERACTION.WHEEL_SPEED }
    const handleDown = (e) => { isDragging.current = true; lastMouseX.current = e.clientX }
    const handleMove = (e) => { if (isDragging.current) { targetRotation.current += (e.clientX - lastMouseX.current) * CONFIG.INTERACTION.DRAG_SPEED; lastMouseX.current = e.clientX } }
    const handleUp = () => isDragging.current = false
    window.addEventListener('wheel', handleWheel); window.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('wheel', handleWheel); window.removeEventListener('mousedown', handleDown); window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', cursor: 'grab' }}>
      <Canvas camera={{ position: CONFIG.CAMERA.POSITION, fov: CONFIG.CAMERA.FOV }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={3} />
        <SceneContent targetRotation={targetRotation} setActiveProject={setActiveProject} activeProject={activeProject} />
      </Canvas>
    </div>
  )
}