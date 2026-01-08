"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

// --- 【严格保留：你的设计师控制台 - 包含你要求的 5-8度偏移】 ---
const CONFIG = {
  INTRO: {
    SPIN_KICK: Math.PI * 1.5, 
    TILT_ANGLE: 0.5,         
    CAMERA_START_Z: 60,      
    FADE_DURATION: 1.5,      
  },
  RING: {
    RADIUS: 17,          
    IMAGE_W: 5,          
    IMAGE_H: 4,          
    HOVER_OUT: 2,        
    HOVER_UP: 1,         
    // 初始偏移量：设为 0.12 弧度（约 7度），解决第一张图正切看不见的问题
    INITIAL_OFFSET: 0.12, 
  },
  CENTRAL: {
    IMAGE_W: 10,         
    IMAGE_H: 7.5,        
    Y_OFFSET: 1.5,       
    Z_OFFSET: -5.5,      
    BG_WIDTH: 15,        
    BG_HEIGHT: 24,       
    BG_OPACITY: 0.6,     
  },
  CAMERA: {
    POSITION: [0, 15, 40], 
    FOV: 60,               
  },
  INTERACTION: {
    WHEEL_SPEED: 0.002,    
    DRAG_SPEED: 0.005,     
    DAMPING: 4,            
  }
}

// 1. 单个项目图片：局部 Suspense 确保不阻塞全局
function ProjectItem({ item, index, total, setActiveProject, onNavigate }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const angle = (index / total) * Math.PI * 2
  const currentRadius = useRef(CONFIG.RING.RADIUS)

  useFrame((state, delta) => {
    if (!ref.current) return
    const targetRadius = hovered ? CONFIG.RING.RADIUS + CONFIG.RING.HOVER_OUT : CONFIG.RING.RADIUS
    currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, 0.1)
    ref.current.position.set(
      Math.sin(angle) * currentRadius.current, 
      THREE.MathUtils.lerp(ref.current.position.y, hovered ? CONFIG.RING.HOVER_UP : 0, 0.1), 
      Math.cos(angle) * currentRadius.current
    )
    const s = hovered ? 1.1 : 1
    ref.current.scale.set(THREE.MathUtils.lerp(ref.current.scale.x, CONFIG.RING.IMAGE_W * s, 0.1), THREE.MathUtils.lerp(ref.current.scale.y, CONFIG.RING.IMAGE_H * s, 0.1), 1)
  })

  return (
    /* 关键点：每个 Image 独立 Suspense，失败了只缺一张图，不塌陷整个环 */
    <Suspense fallback={<mesh><planeGeometry args={[CONFIG.RING.IMAGE_W, CONFIG.RING.IMAGE_H]} /><meshBasicMaterial color="#111" /></mesh>}>
      {item.ringImage && (
        <Image
          ref={ref}
          url={item.ringImage}
          transparent
          side={THREE.DoubleSide}
          toneMapped={false}
          rotation={[0, angle + Math.PI / 2, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); setActiveProject(item); }}
          onPointerOut={() => setHover(false)}
          onClick={(e) => { e.stopPropagation(); onNavigate(item.id); }}
        />
      )}
    </Suspense>
  )
}

// 2. 中心展示：移除 return null，改用 scale 隐藏，防止“第一次 Hover”时的挂载延迟
function CentralDisplay({ activeProject, onNavigate, isTransitioning }) {
  const group = useRef()
  
  useFrame((state) => {
    if (!group.current) return
    group.current.lookAt(state.camera.position)
    
    // 平滑缩放显示/隐藏
    const targetS = activeProject ? 1 : 0
    group.current.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.1)

    if (isTransitioning && activeProject) {
      group.current.scale.lerp(new THREE.Vector3(8, 8, 8), 0.05)
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 20, 0.05)
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]} onClick={() => activeProject && onNavigate(activeProject.id)}>
      {/* 物理屏蔽：raycast={null} 防止黑框干扰 hover 判定 */}
      <mesh position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET - 0.1]} raycast={() => null}>
        <planeGeometry args={[CONFIG.CENTRAL.BG_WIDTH, CONFIG.CENTRAL.BG_HEIGHT]} />
        <meshBasicMaterial color="#000" transparent opacity={CONFIG.CENTRAL.BG_OPACITY} />
      </mesh>
      
      <Suspense fallback={null}>
        {activeProject?.mainImage && (
          <Image url={activeProject.mainImage} scale={[CONFIG.CENTRAL.IMAGE_W, CONFIG.CENTRAL.IMAGE_H]} position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET]} transparent toneMapped={false} />
        )}
      </Suspense>
      
      <Text position={[0, CONFIG.CENTRAL.Y_OFFSET - (CONFIG.CENTRAL.IMAGE_H / 2 + 1.5), CONFIG.CENTRAL.Z_OFFSET + 0.1]} fontSize={0.8} color="white">
        {activeProject?.title?.toUpperCase() || ""}
      </Text>
    </group>
  )
}

// 3. 场景逻辑：移除外层 Suspense
function SceneContent({ targetRotation, setActiveProject, activeProject, onNavigate, isTransitioning, introActive }) {
  const rigRef = useRef()
  const scrollRotation = useRef(CONFIG.RING.INITIAL_OFFSET)

  useFrame((state, delta) => {
    if (introActive) {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, CONFIG.CAMERA.POSITION[2], 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, CONFIG.CAMERA.POSITION[1], 0.03)
      rigRef.current.rotation.x = THREE.MathUtils.lerp(rigRef.current.rotation.x, 0, 0.03)
    }

    if (isTransitioning) {
      targetRotation.current += delta * 2.5
      state.camera.position.lerp(new THREE.Vector3(0, 5, 10), 0.05)
    }

    scrollRotation.current = THREE.MathUtils.damp(scrollRotation.current, targetRotation.current, CONFIG.INTERACTION.DAMPING, delta)
    if (rigRef.current) rigRef.current.rotation.y = scrollRotation.current
  })

  return (
    <>
      <group ref={rigRef} rotation={[CONFIG.INTRO.TILT_ANGLE, 0, 0]}>
        {projects.map((item, i) => (
          <ProjectItem key={item.id} index={i} total={projects.length} item={item} setActiveProject={setActiveProject} onNavigate={onNavigate} />
        ))}
      </group>
      <CentralDisplay activeProject={activeProject} onNavigate={onNavigate} isTransitioning={isTransitioning} />
    </>
  )
}

export default function RingInterface() {
  const router = useRouter()
  const [activeProject, setActiveProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [introActive, setIntroActive] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const targetRotation = useRef(CONFIG.RING.INITIAL_OFFSET)
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIntroActive(true)
      targetRotation.current = CONFIG.RING.INITIAL_OFFSET + CONFIG.INTRO.SPIN_KICK
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleNavigate = (id) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => { router.push(`/project/${id}`) }, 1500)
  }

  useEffect(() => {
    const handleWheel = (e) => { targetRotation.current -= e.deltaY * CONFIG.INTERACTION.WHEEL_SPEED }
    const handleDown = (e) => { isDragging.current = true; lastMouseX.current = e.clientX }
    const handleMove = (e) => { 
      if (isDragging.current) { 
        targetRotation.current += (e.clientX - lastMouseX.current) * CONFIG.INTERACTION.DRAG_SPEED
        lastMouseX.current = e.clientX 
      } 
    }
    const handleUp = () => isDragging.current = false
    window.addEventListener('wheel', handleWheel); window.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', handleUp);
    return () => { 
      window.removeEventListener('wheel', handleWheel); window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); 
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', cursor: 'grab', position: 'relative' }}>
      
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'white', letterSpacing: '0.8em', fontSize: '10px', fontWeight: 900 }}>ARCHIVE INITIALIZING</div>
          <div style={{ width: '120px', height: '1px', background: 'rgba(255,255,255,0.1)', marginTop: '20px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'white', animation: 'load 2s infinite' }} />
          </div>
        </div>
      )}

      {/* 渐入黑遮罩 */}
      {!isLoading && (
        <div style={{ 
          position: 'absolute', inset: 0, zIndex: 90, background: 'black', 
          pointerEvents: 'none', animation: `fadeOut ${CONFIG.INTRO.FADE_DURATION}s forwards` 
        }} />
      )}

      {isTransitioning && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }} className="white-out">
           <div style={{ color: 'white', fontWeight: 900, fontSize: '4rem', letterSpacing: '-0.05em' }}>
             {activeProject?.title?.toUpperCase()}
           </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 15, CONFIG.INTRO.CAMERA_START_Z], fov: CONFIG.CAMERA.FOV }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={3} />
        
        {/* 这里不再包裹整体 SceneContent，防止阻塞 */}
        <SceneContent 
          targetRotation={targetRotation} 
          setActiveProject={setActiveProject} 
          activeProject={activeProject} 
          onNavigate={handleNavigate}
          isTransitioning={isTransitioning}
          introActive={introActive}
        />
      </Canvas>

      <style jsx global>{`
        @keyframes load { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .white-out { animation: whiteFade 1.5s forwards; }
        @keyframes whiteFade { 
          0% { background: rgba(255,255,255,0); backdrop-filter: blur(0px); } 
          100% { background: rgba(255,255,255,1); backdrop-filter: blur(20px); } 
        }
      `}</style>
    </div>
  )
}