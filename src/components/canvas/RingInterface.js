"use client"
import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, ScrollControls, useScroll, Text, useTexture } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

// --- 【核心修复组件】强制修复视口大小 ---
// 这个组件专门解决“只显示一半，右边点不动”的问题
function ViewportFixer() {
  const { gl, camera } = useThree()
  useEffect(() => {
    // 给浏览器一点时间完成布局，然后强制刷新渲染器大小
    const timeout = setTimeout(() => {
      gl.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      console.log("Viewport forced resize applied.") // 打开控制台可以看到这句话
    }, 100)
    return () => clearTimeout(timeout)
  }, [gl, camera])
  return null
}

// 预加载所有图片，防止黑屏
projects.forEach(project => {
  useTexture.preload(project.ringImage)
  useTexture.preload(project.mainImage)
})

function ProjectItem({ item, index, total, setActiveProject }) {
  const router = useRouter()
  const ref = useRef()
  const [isHovered, setIsHovered] = useState(false)
  
  const radius = 14
  const angle = (index / total) * Math.PI * 2

  useFrame((state, delta) => {
    const targetScale = isHovered ? 1.15 : 1
    ref.current.scale.set(
      THREE.MathUtils.lerp(ref.current.scale.x, 4 * targetScale, 0.1),
      THREE.MathUtils.lerp(ref.current.scale.y, 6 * targetScale, 0.1),
      1
    )
    ref.current.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius)
  })

  return (
    <Image
      ref={ref}
      url={item.ringImage}
      transparent
      // 书页摆放角度
      rotation={[0, angle + Math.PI / 2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
        setActiveProject(item)
      }}
      onPointerOut={() => {
        setIsHovered(false)
      }}
      onClick={() => router.push(`/project/${item.id}`)}
    />
  )
}

// 简化的中心显示，确保稳定
function CentralDisplay({ activeProject }) {
  const group = useRef()
  useFrame((state) => {
    if (group.current) group.current.lookAt(state.camera.position)
  })

  if (!activeProject) return null

  return (
    // 向后推一点 Z 轴
    <group ref={group} position={[0, 1, -2]}>
      {/* 简单的半透明黑色背景 */}
      <mesh raycast={() => null}>
        <planeGeometry args={[12, 16]} />
        <meshBasicMaterial color="black" transparent opacity={0.6} />
      </mesh>
      
      <Image 
        url={activeProject.mainImage} 
        scale={[10, 7]} 
        position={[0, 1, 0.1]} 
        transparent 
        raycast={() => null}
      />
      
      <Text position={[0, -4, 0.2]} fontSize={0.8} color="white" raycast={() => null}>
        {activeProject.title}
      </Text>
    </group>
  )
}

function Rig({ children }) {
  const group = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -scroll.offset * Math.PI * 2, 4, delta)
  })
  return <group ref={group}>{children}</group>
}

export default function RingInterface() {
  const [activeProject, setActiveProject] = useState(null)

  return (
    // 强制 Canvas 占满父容器
    <Canvas 
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ position: [0, 20, 35], fov: 50 }}
      onPointerMissed={() => setActiveProject(null)}
      // 尝试更激进的 resize 策略
      resize={{ scroll: false, debounce: 0 }}
    >
      <color attach="background" args={['#000']} />
      <ambientLight intensity={1.5} />
      
      {/* 加入视口修复器 */}
      <ViewportFixer />

      {/* 使用 Suspense 包裹一切 */}
      <Suspense fallback={null}>
        <ScrollControls pages={5} damping={0.2}>
          <Rig>
            {projects.map((item, i) => (
              <ProjectItem 
                key={item.id} 
                index={i} 
                total={projects.length} 
                item={item} 
                setActiveProject={setActiveProject} 
              />
            ))}
          </Rig>
          <CentralDisplay activeProject={activeProject} />
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}