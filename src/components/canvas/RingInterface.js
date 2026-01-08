"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

// 用于记录是否是第一次进入网站，避免返回首页时重复加载
let hasInitialized = false;

// --- 【严格恢复：你的设计师控制台】 ---
const CONFIG = {
  INTRO: {
    SPIN_KICK: Math.PI * 1.5, // 开场旋转总量 (弧度)
    TILT_ANGLE: 0.5,         // 开场时的倾斜角度 (弧度)
    CAMERA_START_Z: 60,      // 相机起始深度 (远近)
    FADE_DURATION: 1.5,      // 开场黑场渐显时间 (秒)
  },
  RING: {
    RADIUS: 17,          // 圆环半径
    IMAGE_W: 5,          // 圆环图片宽
    IMAGE_H: 4,          // 圆环图片高
    HOVER_OUT: 2,        // 悬停时向外偏移距离
    HOVER_UP: 1,         // 悬停时向上抬起高度
    INITIAL_OFFSET: 0.12, // 初始角度偏移 (防止第一张图正切相机)
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
    POSITION: [0, 15, 40], // 相机稳定位置 [X, Y, Z]
    FOV: 60,               // 相机视角
  },
  INTERACTION: {
    WHEEL_SPEED: 0.002,    // 滚轮灵敏度
    DRAG_SPEED: 0.005,     // 拖拽灵敏度
    DAMPING: 4,            // 惯性阻尼
  }
}

// 1. 单个项目图片组件
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
    ref.current.scale.set(
      THREE.MathUtils.lerp(ref.current.scale.x, CONFIG.RING.IMAGE_W * s, 0.1), 
      THREE.MathUtils.lerp(ref.current.scale.y, CONFIG.RING.IMAGE_H * s, 0.1), 
      1
    )
  })

  return (
    <Suspense fallback={null}>
      {item.ringImage && (
        <Image
          ref={ref}
          url={item.ringImage}
          transparent
          side={THREE.DoubleSide}
          toneMapped={false}
          rotation={[0, angle + Math.PI / 2, 0]}
          onPointerOver={(e) => { 
            e.stopPropagation(); 
            setHover(true); 
            setActiveProject(item); 
          }}
          onPointerOut={() => setHover(false)}
          onClick={(e) => { e.stopPropagation(); onNavigate(item.id); }}
        />
      )}
    </Suspense>
  )
}

// 2. 中间大图展示组件
function CentralDisplay({ activeProject, onNavigate, isTransitioning }) {
  const group = useRef()
  
  useFrame((state) => {
    if (!group.current) return
    group.current.lookAt(state.camera.position)
    
    // 平滑显示/隐藏
    const targetS = activeProject ? 1 : 0
    group.current.scale.lerp(new THREE.Vector3(targetS, targetS, targetS), 0.1)

    // 点击后的转场冲击动画
    if (isTransitioning && activeProject) {
      group.current.scale.lerp(new THREE.Vector3(12, 12, 12), 0.04)
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 25, 0.04)
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]} onClick={() => activeProject && onNavigate(activeProject.id)}>
      {/* raycast={null} 保证背景板不会拦截鼠标射线，解决闪烁问题 */}
      <mesh position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET - 0.1]} raycast={() => null}>
        <planeGeometry args={[CONFIG.CENTRAL.BG_WIDTH, CONFIG.CENTRAL.BG_HEIGHT]} />
        <meshBasicMaterial color="#000" transparent opacity={CONFIG.CENTRAL.BG_OPACITY} />
      </mesh>
      
      <Suspense fallback={null}>
        {activeProject?.mainImage && (
          <Image 
            url={activeProject.mainImage} 
            scale={[CONFIG.CENTRAL.IMAGE_W, CONFIG.CENTRAL.IMAGE_H]} 
            position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET]} 
            transparent 
            toneMapped={false} 
          />
        )}
      </Suspense>
      
      <Text position={[0, CONFIG.CENTRAL.Y_OFFSET - (CONFIG.CENTRAL.IMAGE_H / 2 + 1.5), CONFIG.CENTRAL.Z_OFFSET + 0.1]} fontSize={0.8} color="white">
        {activeProject?.title?.toUpperCase() || ""}
      </Text>
    </group>
  )
}

// 3. 3D 场景内容核心
function SceneContent({ targetRotation, setActiveProject, activeProject, onNavigate, isTransitioning, introActive }) {
  const rigRef = useRef()
  const scrollRotation = useRef(CONFIG.RING.INITIAL_OFFSET)

  useFrame((state, delta) => {
    // 进场插值逻辑
    if (introActive) {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, CONFIG.CAMERA.POSITION[2], 0.03)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, CONFIG.CAMERA.POSITION[1], 0.03)
      rigRef.current.rotation.x = THREE.MathUtils.lerp(rigRef.current.rotation.x, 0, 0.03)
    }

    // 转场加速旋转
    if (isTransitioning) {
      targetRotation.current += delta * 3.5
      state.camera.position.lerp(new THREE.Vector3(0, 5, 5), 0.04)
    }

    // 惯性旋转阻尼计算
    scrollRotation.current = THREE.MathUtils.damp(scrollRotation.current, targetRotation.current, CONFIG.INTERACTION.DAMPING, delta)
    if (rigRef.current) rigRef.current.rotation.y = scrollRotation.current
  })

  return (
    <>
      <group ref={rigRef} rotation={[CONFIG.INTRO.TILT_ANGLE, 0, 0]}>
        {projects.map((item, i) => (
          <ProjectItem 
            key={item.id} 
            index={i} 
            total={projects.length} 
            item={item} 
            setActiveProject={setActiveProject} 
            onNavigate={onNavigate} 
          />
        ))}
      </group>
      <CentralDisplay activeProject={activeProject} onNavigate={onNavigate} isTransitioning={isTransitioning} />
    </>
  )
}

// 4. 主渲染接口
export default function RingInterface() {
  const router = useRouter()
  const [activeProject, setActiveProject] = useState(null)
  const [isLoading, setIsLoading] = useState(!hasInitialized)
  const [introActive, setIntroActive] = useState(hasInitialized)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const targetRotation = useRef(CONFIG.RING.INITIAL_OFFSET)
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)

  useEffect(() => {
    if (!hasInitialized) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        setIntroActive(true)
        // 触发开场冲刺
        targetRotation.current = CONFIG.RING.INITIAL_OFFSET + CONFIG.INTRO.SPIN_KICK
        hasInitialized = true 
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      // 二次进入时直接执行冲刺
      targetRotation.current = CONFIG.RING.INITIAL_OFFSET + CONFIG.INTRO.SPIN_KICK
    }
  }, [])

  const handleNavigate = (id) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    // 为 CLOU 风格字母转场预留 2.2 秒时间
    setTimeout(() => { router.push(`/project/${id}`) }, 2200)
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
    <div style={{ width: '100vw', height: '100vh', background: 'black', cursor: 'grab', position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. 首次加载 UI */}
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'white', letterSpacing: '0.8em', fontSize: '10px', fontWeight: 900 }}>INITIALIZING ARCHIVE</div>
          <div style={{ width: '120px', height: '1px', background: 'rgba(255,255,255,0.1)', marginTop: '20px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'white', animation: 'load 2s infinite' }} />
          </div>
        </div>
      )}

      {/* 2. 开场淡入遮罩 */}
      {!isLoading && (
        <div style={{ 
          position: 'absolute', inset: 0, zIndex: 90, background: 'black', 
          pointerEvents: 'none', animation: `fadeOut ${CONFIG.INTRO.FADE_DURATION}s forwards` 
        }} />
      )}

      {/* 3. CLOU 风格：字母逐个浮现转场 */}
      {isTransitioning && (
        <div className="clou-loader-overlay">
           <div className="letter-wrapper">
             {activeProject?.title?.split('').map((char, i) => (
               <span 
                key={i} 
                className="stagger-letter" 
                style={{ animationDelay: `${i * 0.08}s` }}
               >
                 {char === ' ' ? '\u00A0' : char}
               </span>
             ))}
           </div>
           <div className="status-text">CONTENT LOADING...</div>
        </div>
      )}

      {/* 4. 3D 画布 */}
      <Canvas camera={{ 
          position: hasInitialized ? CONFIG.CAMERA.POSITION : [0, 15, CONFIG.INTRO.CAMERA_START_Z], 
          fov: CONFIG.CAMERA.FOV 
        }}>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={3} />
        <SceneContent 
          targetRotation={targetRotation} 
          setActiveProject={setActiveProject} 
          activeProject={activeProject} 
          onNavigate={handleNavigate}
          isTransitioning={isTransitioning}
          introActive={introActive}
        />
      </Canvas>

      {/* 5. 动画样式 */}
      <style jsx global>{`
        @keyframes load { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }

        .clou-loader-overlay {
          position: absolute; inset: 0; z-index: 200; background: #000;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .letter-wrapper { display: flex; overflow: hidden; margin-bottom: 2rem; }
        .stagger-letter {
          color: white; font-size: 5vw; font-weight: 900; text-transform: uppercase;
          letter-spacing: -0.05em; opacity: 0; transform: translateY(100%);
          animation: letterUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .status-text { color: #444; font-size: 10px; letter-spacing: 0.6em; font-weight: 900; }
        
        @keyframes letterUp {
          0% { opacity: 0; transform: translateY(100%); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}