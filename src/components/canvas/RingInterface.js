"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

// --- 子组件：单个项目卡片 (实现滑出特效) ---
function ProjectItem({ item, index, total, setActiveProject }) {
  const router = useRouter()
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  
  // --- 【参数设置区】 ---
  const baseRadius = 18       // 基础圆环半径
  const hoverOffset = 3       // Hover 时向外滑出的距离
  const hoverLift = 1.5       // Hover 时向上抬起的高度
  const baseWidth = 4.5       // 图片基础宽度
  const baseHeight = 7        // 图片基础高度
  // --------------------

  const angle = (index / total) * Math.PI * 2
  // 用于平滑过渡的中间变量
  const currentRadius = useRef(baseRadius)

  useFrame((state, delta) => {
    if (!ref.current) return

    // 1. 计算目标半径：如果 hover，则基础半径 + 滑出距离
    const targetRadius = hovered ? baseRadius + hoverOffset : baseRadius
    // 使用 lerp 平滑过渡当前半径
    currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, 0.1)

    // 2. 计算目标高度：如果 hover，向上抬起
    const targetY = hovered ? hoverLift : 0
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.1)

    // 3. 根据新的半径计算 X 和 Z 坐标，实现沿半径方向滑出
    ref.current.position.x = Math.sin(angle) * currentRadius.current
    ref.current.position.z = Math.cos(angle) * currentRadius.current

    // 4. (可选) 保持轻微的缩放感，增加强调
    const s = hovered ? 1.05 : 1
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, baseWidth * s, 0.1)
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, baseHeight * s, 0.1)
  })

  return (
    // 【关键修复】Suspense 只包裹 Image，防止全局黑屏
    <Suspense fallback={null}>
      <Image
        ref={ref}
        url={item.ringImage}
        transparent
        side={THREE.DoubleSide}
        toneMapped={false}
        rotation={[0, angle + Math.PI / 2, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); setActiveProject(item); }}
        onPointerOut={() => setHover(false)}
        onClick={() => router.push(`/project/${item.id}`)}
      />
    </Suspense>
  )
}

// --- 子组件：中心大图预览 ---
function CentralDisplay({ activeProject }) {
  const group = useRef()
  useFrame((state) => { if (group.current) group.current.lookAt(state.camera.position) })
  if (!activeProject) return null
  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* 【关键修复】Suspense 只包裹 Image */}
      <Suspense fallback={null}>
        <Image url={activeProject.mainImage} scale={[14, 9.5]} position={[0, 2, -5.1]} transparent toneMapped={false} raycast={() => null} />
      </Suspense>
      <Text position={[0, -4.5, -5.0]} fontSize={1} color="white" raycast={() => null}>{activeProject.title.toUpperCase()}</Text>
    </group>
  )
}

// --- 主组件 ---
export default function RingInterface() {
  const [activeProject, setActiveProject] = useState(null)
  const rigRef = useRef()
  const scrollRotation = useRef(0)
  const targetRotation = useRef(0)
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)

  // 拖拽与滚动逻辑 (保持不变)
  useEffect(() => {
    const handleWheel = (e) => { targetRotation.current -= e.deltaY * 0.002 }
    const handleMouseDown = (e) => { isDragging.current = true; lastMouseX.current = e.clientX }
    const handleMouseMove = (e) => {
      if (!isDragging.current) return
      const deltaX = e.clientX - lastMouseX.current
      targetRotation.current += deltaX * 0.005
      lastMouseX.current = e.clientX
    }
    const handleMouseUp = () => { isDragging.current = false }
    
    const canvasEl = document.getElementById('gl-canvas') // 获取 canvas 元素绑定事件
    if (canvasEl) {
        canvasEl.addEventListener('wheel', handleWheel, { passive: true })
        canvasEl.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
        if (canvasEl) {
            canvasEl.removeEventListener('wheel', handleWheel)
            canvasEl.removeEventListener('mousedown', handleMouseDown)
        }
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  function AnimationLoop() {
    useFrame((state, delta) => {
      scrollRotation.current = THREE.MathUtils.damp(scrollRotation.current, targetRotation.current, 4, delta)
      if (rigRef.current) rigRef.current.rotation.y = scrollRotation.current
    })
    return null
  }

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <Canvas id="gl-canvas" camera={{ position: [0, 25, 45], fov: 50 }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={3} />
        <AnimationLoop />
        
        {/* 【关键修复】移除了最外层的 Suspense */}
        <group ref={rigRef}>
          {projects.map((item, i) => (
            <ProjectItem key={item.id} index={i} total={projects.length} item={item} setActiveProject={setActiveProject} />
          ))}
        </group>
        <CentralDisplay activeProject={activeProject} />
      </Canvas>
    </div>
  )
}