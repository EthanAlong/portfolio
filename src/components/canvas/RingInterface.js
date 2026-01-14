"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

// 防止生产环境返回首页时重复运行 Initial Loading
let globalInitialized = false;

/**
 * ============================================================
 * 【 设计师控制台 - 3D 场景与转场核心参数 】
 * ============================================================
 */
const CONFIG = {
  INTRO: {
    SPIN_KICK: Math.PI * 0.9, // 开场旋转总量
    CAMERA_START_Z: 70,      // 开场相机起始深度
    FADE_DURATION: 1.5,      // 黑场渐显时间
  },
  RING: {
    RADIUS: 20,              // 基础圆环半径
    IMAGE_W: 6,              // 图片宽度
    IMAGE_H: 4,              // 图片高度
    HOVER_OUT: 2.2,          // 鼠标悬停时弹出的额外距离
    HOVER_UP: 1.2,           // 鼠标悬停时抬起的高度
    INITIAL_OFFSET: 0.12,    // 初始旋转偏角
  },
  CENTRAL: {
    IMAGE_W: 12,
    IMAGE_H: 9,
    Y_OFFSET: -0.5,
    Z_OFFSET: -5,
    TEXT_Y: -6.5,
  },
  CAMERA: {
    POSITION: [0, 22, 45],   // 俯视稳定视角 [X, Y, Z]
    FOV: 55,
  },
  INTERACTION: {
    WHEEL_SPEED: 0.002,      // 滚轮灵敏度
    DRAG_SPEED: 0.005,       // 鼠标拖拽灵敏度
    DAMPING: 4,              // 旋转惯性阻尼
  },
  MOUSE_TILT: {
    X_INTENSITY: 0.04,       // 俯仰倾斜强度
    Z_INTENSITY: 0.15,       // 左右倾斜强度
    SMOOTHING: 0.05,         // 倾斜跟随平滑度
  },
  // --- 【转场序列控制面板 - TRANSITION SEQUENCE】 ---
  TRANSITION: {
    SPIN_ACCEL: 5.0,        // [1] 点击瞬间：旋转加速度
    EXPAND_SCALE: 2.5,       // [1] 点击瞬间：半径扩张倍数
    EXPAND_SPEED: 0.005,     // [1] 点击瞬间：半径扩张的物理速度
    
    BLUR_STRENGTH: "30px",   // [1] 点击瞬间：同步开启的模糊强度
    
    OVERLAY_DELAY: 800,      // [2] 黑色遮罩层淡入的延迟时间 (毫秒)
    FADE_TIME: "0.4s",       // [2] 黑色遮罩层从透明到全黑的时间

    LETTER_ANIM_DURATION: "1s", // [3] 加载文字每个字母弹出的时长
    LETTER_STAGGER: 0.04,        // [3] 字母之间弹出的时间差
    
    NAVIGATE_DELAY: 2500,    // 正式切页延迟
  }
}

// 1. 项目单体组件
function ProjectItem({ item, index, total, setActiveProject, onNavigate, isTransitioning }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const angle = (index / total) * Math.PI * 2
  const currentRadius = useRef(CONFIG.RING.RADIUS)

  useFrame(() => {
    if (!ref.current) return
    const targetBaseRadius = hovered ? CONFIG.RING.RADIUS + CONFIG.RING.HOVER_OUT : CONFIG.RING.RADIUS
    currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetBaseRadius, 0.1)
    
    ref.current.position.set(
      Math.sin(angle) * currentRadius.current, 
      THREE.MathUtils.lerp(ref.current.position.y, hovered ? CONFIG.RING.HOVER_UP : 0, 0.1), 
      Math.cos(angle) * currentRadius.current
    )
    
    const s = hovered ? 1.05 : 1
    ref.current.scale.lerp(new THREE.Vector3(CONFIG.RING.IMAGE_W * s, CONFIG.RING.IMAGE_H * s, 1), 0.1)
  })

  return (
    <Suspense fallback={null}>
      <Image
        ref={ref}
        url={item.ringImage}
        transparent
        side={THREE.DoubleSide}
        rotation={[0, angle + Math.PI / 2, 0]}
        onPointerOver={(e) => { if(!isTransitioning) { e.stopPropagation(); setHover(true); setActiveProject(item); } }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); onNavigate(item.id); }}
      />
    </Suspense>
  )
}

// 2. 中间大图显示
function CentralDisplay({ activeProject, onNavigate, isTransitioning }) {
  const group = useRef()
  useFrame(() => {
    if (!group.current) return
    const targetScale = (activeProject && !isTransitioning) ? 1 : 0
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  const getTitleString = () => {
    if (!activeProject) return "";
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title;
  };

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        {activeProject && (
          <>
            <Image 
              url={activeProject.mainImage} 
              scale={[CONFIG.CENTRAL.IMAGE_W, CONFIG.CENTRAL.IMAGE_H]}
              position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET]}
              transparent
              toneMapped={false}
              onClick={() => onNavigate(activeProject.id)}
            />
            <Text 
              position={[0, CONFIG.CENTRAL.TEXT_Y, CONFIG.CENTRAL.Z_OFFSET + 0.2]} 
              fontSize={1.2} color="white" fontWeight={900} letterSpacing={-0.05} anchorY="middle"
            >
              {getTitleString().toUpperCase()}
            </Text>
          </>
        )}
      </Suspense>
    </group>
  )
}

// 3. 场景逻辑核心驱动
function SceneContent({ targetRotation, setActiveProject, activeProject, onNavigate, isTransitioning, introActive, mousePos }) {
  const spinGroup = useRef()
  const tiltGroup = useRef()
  const scrollRotation = useRef(CONFIG.RING.INITIAL_OFFSET)
  const transitionRadiusScale = useRef(1.0) 

  useFrame((state, delta) => {
    if (introActive) {
      state.camera.position.lerp(new THREE.Vector3(...CONFIG.CAMERA.POSITION), 0.03)
      state.camera.lookAt(0, 0, 0)
    }

    // --- 【物理炸裂序列】 ---
    if (isTransitioning) {
      targetRotation.current += delta * CONFIG.TRANSITION.SPIN_ACCEL; // 加速转动
      transitionRadiusScale.current = THREE.MathUtils.lerp( // 半径扩张
        transitionRadiusScale.current, 
        CONFIG.TRANSITION.EXPAND_SCALE, 
        CONFIG.TRANSITION.EXPAND_SPEED
      );
    }

    scrollRotation.current = THREE.MathUtils.damp(scrollRotation.current, targetRotation.current, CONFIG.INTERACTION.DAMPING, delta)
    
    if (spinGroup.current) {
      spinGroup.current.rotation.y = scrollRotation.current
      spinGroup.current.scale.setScalar(transitionRadiusScale.current)
    }

    if (tiltGroup.current && !isTransitioning) {
      const tx = mousePos.current.y * CONFIG.MOUSE_TILT.X_INTENSITY
      const tz = -mousePos.current.x * CONFIG.MOUSE_TILT.Z_INTENSITY
      tiltGroup.current.rotation.x = THREE.MathUtils.lerp(tiltGroup.current.rotation.x, tx, CONFIG.MOUSE_TILT.SMOOTHING)
      tiltGroup.current.rotation.z = THREE.MathUtils.lerp(tiltGroup.current.rotation.z, tz, CONFIG.MOUSE_TILT.SMOOTHING)
    }
  })

  return (
    <group ref={tiltGroup}>
      <group ref={spinGroup}>
        {projects.map((item, i) => (
          <ProjectItem 
            key={item.id} index={i} total={projects.length} item={item} 
            setActiveProject={setActiveProject} onNavigate={onNavigate} 
            isTransitioning={isTransitioning}
          />
        ))}
      </group>
      <CentralDisplay activeProject={activeProject} onNavigate={onNavigate} isTransitioning={isTransitioning} />
    </group>
  )
}

// 4. 主入口
export default function RingInterface() {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [isLoading, setIsLoading] = useState(!globalInitialized)
  
  // 分段状态控制
  const [isTransitioning, setIsTransitioning] = useState(false) // 开启物理效果
  const [showOverlay, setShowOverlay] = useState(false)         // 开启黑场+文字

  const targetRotation = useRef(CONFIG.RING.INITIAL_OFFSET)
  const mousePos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)

  useEffect(() => {
    setHasMounted(true)
    if (!globalInitialized) {
      setTimeout(() => {
        setIsLoading(false)
        targetRotation.current += CONFIG.INTRO.SPIN_KICK
        globalInitialized = true
      }, 2500)
    } else {
      targetRotation.current += CONFIG.INTRO.SPIN_KICK
    }
  }, [])

  useEffect(() => {
    if (!hasMounted) return
    const hMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1
      if (isDragging.current && !isTransitioning) { 
        targetRotation.current += (e.clientX - lastMouseX.current) * CONFIG.INTERACTION.DRAG_SPEED
        lastMouseX.current = e.clientX 
      }
    }
    const hWheel = (e) => { if(!isTransitioning) targetRotation.current -= e.deltaY * CONFIG.INTERACTION.WHEEL_SPEED }
    const hDown = (e) => { if(!isTransitioning) { isDragging.current = true; lastMouseX.current = e.clientX } }
    const hUp = () => isDragging.current = false
    window.addEventListener('wheel', hWheel, { passive: true }); window.addEventListener('mousedown', hDown);
    window.addEventListener('mousemove', hMove); window.addEventListener('mouseup', hUp)
    return () => {
      window.removeEventListener('wheel', hWheel); window.removeEventListener('mousedown', hDown);
      window.removeEventListener('mousemove', hMove); window.removeEventListener('mouseup', hUp)
    }
  }, [hasMounted, isTransitioning])

  if (!hasMounted) return <div className="bg-black w-screen h-screen" />

  // 【核心执行序列】
  const handleNavigate = (id) => {
    // 1. 立即：加速旋转 + 半径扩张 + CSS模糊开始
    setIsTransitioning(true)
    
    // 2. 延迟：进入黑场遮罩
    setTimeout(() => {
      setShowOverlay(true)
    }, CONFIG.TRANSITION.OVERLAY_DELAY)

    // 3. 最后：跳转页面
    setTimeout(() => {
      router.push(`/project/${id}`)
    }, CONFIG.TRANSITION.NAVIGATE_DELAY)
  }

  const getLoaderTitle = () => {
    if (!activeProject) return "";
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title;
  };

  return (
    <div className={`main-wrapper ${isTransitioning ? 'is-blurring' : ''}`}>
      {/* 初始加载界面 */}
      {isLoading && (
        <div className="initial-loader">
          <div className="wipe-text">INITIALIZING ARCHIVE</div>
          <div className="loading-bar-container"><div className="loading-bar-fill" /></div>
        </div>
      )}

      {/* 转场黑色遮罩与文字加载界面 */}
      {showOverlay && (
        <div className="clou-loader-overlay">
           <div className="letter-wrapper">
             {getLoaderTitle().split('').map((char, i) => (
               <span 
                 key={i} 
                 className="stagger-letter" 
                 style={{ 
                   animationDelay: `${i * CONFIG.TRANSITION.LETTER_STAGGER}s`,
                   animationDuration: CONFIG.TRANSITION.LETTER_ANIM_DURATION 
                 }}
               >
                 {char === ' ' ? '\u00A0' : char}
               </span>
             ))}
           </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 22, globalInitialized ? 45 : CONFIG.INTRO.CAMERA_START_Z], fov: CONFIG.CAMERA.FOV }}>
        <color attach="background" args={['#000']} /><ambientLight intensity={3} />
        <SceneContent 
          targetRotation={targetRotation} setActiveProject={setActiveProject} 
          activeProject={activeProject} onNavigate={handleNavigate}
          isTransitioning={isTransitioning} introActive={!isLoading} mousePos={mousePos}
        />
      </Canvas>

      <style jsx global>{`
        .main-wrapper { width: 100vw; height: 100vh; background: black; cursor: grab; position: relative; overflow: hidden; font-family: -apple-system, sans-serif; }
        
        /* 1. 点击时立即开始的模糊 */
        .is-blurring canvas {
          filter: blur(${CONFIG.TRANSITION.BLUR_STRENGTH});
          transition: filter 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* 2. 转场黑色加载界面 */
        .clou-loader-overlay { 
          position: absolute; inset: 0; z-index: 600; background: #000;
          display: flex; align-items: center; justify-content: center;
          animation: overlayFadeIn ${CONFIG.TRANSITION.FADE_TIME} ease forwards;
        }

        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* 3. 字母动画 */
        .stagger-letter { 
          color: white; font-size: 5vw; font-weight: 900; text-transform: uppercase; 
          display: inline-block; opacity: 0;
          animation: letterUp ease forwards; 
        }
        @keyframes letterUp { from { opacity: 0; transform: translateY(50%); } to { opacity: 1; transform: translateY(0); } }

        .initial-loader { position: absolute; inset: 0; z-index: 500; background: black; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .wipe-text { color: white; font-size: 10px; font-weight: 900; letter-spacing: 0.8em; clip-path: inset(0 100% 0 0); animation: textWipe 1.5s ease forwards 0.5s; }
        @keyframes textWipe { 0% { clip-path: inset(0 100% 0 0); } 100% { clip-path: inset(0 0 0 0); } }
        .loading-bar-container { width: 120px; height: 1px; background: rgba(255,255,255,0.1); margin-top: 24px; overflow: hidden; }
        .loading-bar-fill { width: 100%; height: 100%; background: white; animation: barSlide 2s infinite; }
      `}</style>
    </div>
  )
}