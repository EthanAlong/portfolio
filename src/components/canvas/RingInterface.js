"use client"
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react'
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
    IMAGE_W: 18,
    IMAGE_H: 12,
    Y_OFFSET: -5.5,
    Z_OFFSET: -5,
    TEXT_Y: -12.5,
  },
  CAMERA: {
    POSITION: [0, 22, 45],   // 俯视稳定视角 [X, Y, Z]
    LOOK_AT: [0, 0, 0],      // 看向中心
    FOV: 60,
  },
  // ============================================================
  // 【 移动端控制台 - MOBILE CONFIG 】
  // ============================================================
  MOBILE: {
    BREAKPOINT: 768,         // 移动端断点宽度

    // --- 布局比例 ---
    LAYOUT: {
      HEADER_HEIGHT: '10vh',   // 顶部标题区域高度
      PREVIEW_HEIGHT: '35vh',  // 中间缩略图区域高度
      RING_HEIGHT: '55vh',     // 底部Ring区域高度
    },

    // --- 相机配置 ---
    CAMERA: {
      POSITION: [0, 10, 35],   // 相机位置 [X, Y, Z]
      LOOK_AT: [-15, -5, 0],   // 相机看向的点（负X=看向左边）
      FOV: 50,                 // 视野角度
    },

    // --- Ring配置 ---
    RING: {
      RADIUS: 16,              // Ring半径
      IMAGE_W: 6,              // 图片宽度
      IMAGE_H: 4,              // 图片高度
      INITIAL_OFFSET: Math.PI * 0.5,  // 初始旋转角度
      SELECTED_OUT: 0,         // 选中项向外弹出距离（0=不向外）
      SELECTED_UP: 1.5,        // 选中项抬起高度
      SELECTED_FORWARD: 8,     // 选中项向相机方向移动距离（正值=靠近相机）
      SELECTED_SCALE: 1.15,    // 选中项放大倍数
    },

    // --- 交互配置 ---
    INTERACTION: {
      DRAG_SPEED: 0.008,       // 滑动灵敏度
      DAMPING: 5,              // 阻尼感（值越大越快停下）
      SNAP_THRESHOLD: 0.15,    // 吸附阈值（弧度）
    },

    // --- 缩略图预览配置 ---
    PREVIEW: {
      MAX_WIDTH: 360,          // 最大宽度 (px)
      ASPECT_RATIO: '16/10',   // 宽高比
      BORDER_RADIUS: 8,        // 圆角 (px)
      TITLE_SIZE: '1rem',      // 标题字号
      TITLE_MARGIN: 12,        // 标题与图片间距 (px)
      PADDING: '10px 20px',    // 容器内边距
    },
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

// --- 【核心组件：数据网络 (DataNetwork)】 ---
function DataNetwork() {
  const groupRef = useRef()
  const linesRef = useRef()

  const { points, linesGeometry } = useMemo(() => {
    const particleCount = 150;
    const radius = 160;
    const connectionDist = 35;

    const positions = new Float32Array(particleCount * 3);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * radius * 2;
      const y = (Math.random() - 0.5) * radius * 1.5;
      const z = (Math.random() - 0.5) * radius * 0.8;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      particles.push(new THREE.Vector3(x, y, z));
    }

    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = particles[i].distanceTo(particles[j]);
        if (dist < connectionDist) {
          linePositions.push(
            particles[i].x, particles[i].y, particles[i].z,
            particles[j].x, particles[j].y, particles[j].z
          );
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    return { points: positions, linesGeometry: geometry };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.03;
    }
    if (linesRef.current) {
      const breath = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      linesRef.current.material.opacity = breath;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.5} color="#aaaaaa" transparent opacity={0.8} sizeAttenuation={true} />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial color="#555555" transparent opacity={0.45} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// --- 【项目单体组件】 ---
function ProjectItem({ item, index, total, setActiveProject, onNavigate, isTransitioning, isMobile, isSelected }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const angle = (index / total) * Math.PI * 2
  const currentRadius = useRef(isMobile ? CONFIG.MOBILE.RING.RADIUS : CONFIG.RING.RADIUS)

  useFrame(() => {
    if (!ref.current) return

    if (isMobile) {
      // 移动端：只有选中项弹出，不响应hover
      const baseRadius = CONFIG.MOBILE.RING.RADIUS
      const targetRadius = isSelected ? baseRadius + CONFIG.MOBILE.RING.SELECTED_OUT : baseRadius
      currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, 0.1)

      ref.current.position.set(
        Math.sin(angle) * currentRadius.current,
        THREE.MathUtils.lerp(ref.current.position.y, isSelected ? CONFIG.MOBILE.RING.SELECTED_UP : 0, 0.1),
        Math.cos(angle) * currentRadius.current
      )

      const imgW = CONFIG.MOBILE.RING.IMAGE_W
      const imgH = CONFIG.MOBILE.RING.IMAGE_H
      const s = isSelected ? 1.08 : 1
      ref.current.scale.lerp(new THREE.Vector3(imgW * s, imgH * s, 1), 0.1)
    } else {
      // 桌面端：hover弹出
      const baseRadius = CONFIG.RING.RADIUS
      const targetRadius = hovered ? baseRadius + CONFIG.RING.HOVER_OUT : baseRadius
      currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, 0.1)

      ref.current.position.set(
        Math.sin(angle) * currentRadius.current,
        THREE.MathUtils.lerp(ref.current.position.y, hovered ? CONFIG.RING.HOVER_UP : 0, 0.1),
        Math.cos(angle) * currentRadius.current
      )

      const s = hovered ? 1.05 : 1
      ref.current.scale.lerp(new THREE.Vector3(CONFIG.RING.IMAGE_W * s, CONFIG.RING.IMAGE_H * s, 1), 0.1)
    }
  })

  return (
    <Suspense fallback={null}>
      <Image
        ref={ref}
        url={item.ringImage}
        transparent
        side={THREE.DoubleSide}
        rotation={[0, angle + Math.PI / 2, 0]}
        onPointerOver={(e) => {
          if(!isTransitioning && !isMobile) {
            e.stopPropagation();
            setHover(true);
            setActiveProject(item);
          }
        }}
        onPointerOut={() => !isMobile && setHover(false)}
        onClick={(e) => { e.stopPropagation(); onNavigate(item.id); }}
      />
    </Suspense>
  )
}

// --- 【桌面端中间大图显示】 ---
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
              fontSize={1.2}
              color="white"
              fontWeight={900}
              letterSpacing={-0.05}
              anchorY="middle"
            >
              {getTitleString().toUpperCase()}
            </Text>
          </>
        )}
      </Suspense>
    </group>
  )
}

// --- 【场景逻辑核心驱动】 ---
function SceneContent({ targetRotation, setActiveProject, activeProject, onNavigate, isTransitioning, introActive, mousePos, isMobile, selectedIndex }) {
  const spinGroup = useRef()
  const tiltGroup = useRef()
  const bgGroup = useRef()

  const initialOffset = isMobile ? CONFIG.MOBILE.RING.INITIAL_OFFSET : CONFIG.RING.INITIAL_OFFSET
  const scrollRotation = useRef(initialOffset)
  const transitionRadiusScale = useRef(1.0)

  const cameraTarget = isMobile ? CONFIG.MOBILE.CAMERA.POSITION : CONFIG.CAMERA.POSITION
  const lookAtTarget = isMobile ? CONFIG.MOBILE.CAMERA.LOOK_AT : CONFIG.CAMERA.LOOK_AT
  const damping = isMobile ? CONFIG.MOBILE.INTERACTION.DAMPING : CONFIG.INTERACTION.DAMPING

  useFrame((state, delta) => {
    if (introActive) {
      state.camera.position.lerp(new THREE.Vector3(...cameraTarget), 0.03)
      state.camera.lookAt(new THREE.Vector3(...lookAtTarget))
    }

    if (isTransitioning) {
      targetRotation.current += delta * CONFIG.TRANSITION.SPIN_ACCEL;
      transitionRadiusScale.current = THREE.MathUtils.lerp(
        transitionRadiusScale.current,
        CONFIG.TRANSITION.EXPAND_SCALE,
        CONFIG.TRANSITION.EXPAND_SPEED
      );
    }

    scrollRotation.current = THREE.MathUtils.damp(scrollRotation.current, targetRotation.current, damping, delta)

    if (spinGroup.current) {
      spinGroup.current.rotation.y = scrollRotation.current
      spinGroup.current.scale.setScalar(transitionRadiusScale.current)
    }

    // 桌面端视差倾斜
    if (tiltGroup.current && !isTransitioning && !isMobile) {
      const tx = mousePos.current.y * CONFIG.MOUSE_TILT.X_INTENSITY
      const tz = -mousePos.current.x * CONFIG.MOUSE_TILT.Z_INTENSITY
      tiltGroup.current.rotation.x = THREE.MathUtils.lerp(tiltGroup.current.rotation.x, tx, CONFIG.MOUSE_TILT.SMOOTHING)
      tiltGroup.current.rotation.z = THREE.MathUtils.lerp(tiltGroup.current.rotation.z, tz, CONFIG.MOUSE_TILT.SMOOTHING)
    }

    // 桌面端背景视差
    if (bgGroup.current && !isTransitioning && !isMobile) {
      const bgTx = mousePos.current.y * 0.15
      const bgTz = -mousePos.current.x * 0.15
      bgGroup.current.rotation.x = THREE.MathUtils.lerp(bgGroup.current.rotation.x, bgTx, 0.03)
      bgGroup.current.rotation.z = THREE.MathUtils.lerp(bgGroup.current.rotation.z, bgTz, 0.03)
    }
  })

  return (
    <>
      <group ref={bgGroup}>
        <DataNetwork />
      </group>

      <group ref={tiltGroup}>
        <group ref={spinGroup}>
          {projects.map((item, i) => (
            <ProjectItem
              key={item.id} index={i} total={projects.length} item={item}
              setActiveProject={setActiveProject} onNavigate={onNavigate}
              isTransitioning={isTransitioning} isMobile={isMobile}
              isSelected={isMobile && selectedIndex === i}
            />
          ))}
        </group>
        {/* 桌面端才显示3D中央大图 */}
        {!isMobile && (
          <CentralDisplay activeProject={activeProject} onNavigate={onNavigate} isTransitioning={isTransitioning} />
        )}
      </group>
    </>
  )
}

// --- 【移动端HTML预览区域】 ---
function MobilePreview({ activeProject, onNavigate, isTransitioning }) {
  if (!activeProject || isTransitioning) return null

  const getTitleString = () => {
    if (!activeProject) return "";
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title;
  };

  return (
    <div className="mobile-preview" onClick={() => onNavigate(activeProject.id)}>
      <div className="mobile-preview-image">
        <img src={activeProject.mainImage} alt={getTitleString()} />
      </div>
      <div className="mobile-preview-title">{getTitleString().toUpperCase()}</div>
    </div>
  )
}

// --- 【主入口】 ---
export default function RingInterface() {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [canRenderCanvas, setCanRenderCanvas] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [isLoading, setIsLoading] = useState(!globalInitialized)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const targetRotation = useRef(CONFIG.RING.INITIAL_OFFSET)
  const mousePos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)
  const lastTouchX = useRef(0)

  // 移动端检测
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < CONFIG.MOBILE.BREAKPOINT
      setIsMobile(mobile)
      if (mobile) {
        targetRotation.current = CONFIG.MOBILE.RING.INITIAL_OFFSET
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 根据旋转角度计算当前选中的项目索引（移动端）
  useEffect(() => {
    if (!isMobile) return

    const interval = setInterval(() => {
      // 归一化旋转角度到 0 ~ 2π
      const normalizedRotation = ((targetRotation.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      // 计算当前指向左侧的项目索引（左侧 = -x 方向 = angle 接近 3π/2）
      const anglePerItem = (Math.PI * 2) / projects.length
      // 相机看向左边，所以需要找到在左边位置的项目
      const targetAngle = Math.PI * 1.5 // 左侧位置
      const adjustedRotation = (targetAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2)
      const index = Math.round(adjustedRotation / anglePerItem) % projects.length

      if (index !== selectedIndex) {
        setSelectedIndex(index)
        setActiveProject(projects[index])
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isMobile, selectedIndex])

  useEffect(() => {
    setHasMounted(true)
    const timer = setTimeout(() => {
      setCanRenderCanvas(true)
      if (!globalInitialized) {
        setTimeout(() => {
          setIsLoading(false);
          targetRotation.current += CONFIG.INTRO.SPIN_KICK;
          globalInitialized = true;
        }, 2500)
      } else {
        setTimeout(() => { targetRotation.current += CONFIG.INTRO.SPIN_KICK; }, 100)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    // --- 桌面端专用事件（移动端不需要） ---
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

    // --- 移动端触摸事件 ---
    const hTouchStart = (e) => {
      if (!isTransitioning && e.touches.length === 1) {
        isDragging.current = true
        lastTouchX.current = e.touches[0].clientX
      }
    }
    const hTouchMove = (e) => {
      if (isDragging.current && !isTransitioning && e.touches.length === 1) {
        const touchX = e.touches[0].clientX
        targetRotation.current += (touchX - lastTouchX.current) * CONFIG.MOBILE.INTERACTION.DRAG_SPEED
        lastTouchX.current = touchX
      }
    }
    const hTouchEnd = () => isDragging.current = false

    if (isMobile) {
      // 移动端只监听触摸事件
      window.addEventListener('touchstart', hTouchStart, { passive: true })
      window.addEventListener('touchmove', hTouchMove, { passive: true })
      window.addEventListener('touchend', hTouchEnd)
    } else {
      // 桌面端监听鼠标和滚轮事件
      window.addEventListener('wheel', hWheel, { passive: true })
      window.addEventListener('mousedown', hDown)
      window.addEventListener('mousemove', hMove)
      window.addEventListener('mouseup', hUp)
    }

    return () => {
      if (isMobile) {
        window.removeEventListener('touchstart', hTouchStart)
        window.removeEventListener('touchmove', hTouchMove)
        window.removeEventListener('touchend', hTouchEnd)
      } else {
        window.removeEventListener('wheel', hWheel)
        window.removeEventListener('mousedown', hDown)
        window.removeEventListener('mousemove', hMove)
        window.removeEventListener('mouseup', hUp)
      }
    }
  }, [hasMounted, isTransitioning, isMobile])

  if (!hasMounted) return <div className="bg-black w-screen h-screen" />

  const handleNavigate = (id) => {
    setIsTransitioning(true)
    const targetProject = projects.find(p => p.id === id);
    if (targetProject) {
      const imagesToPreload = [targetProject.mainImage];
      if (targetProject.content) {
        const contentImages = targetProject.content.filter(block => block.type === 'imageGrid').flatMap(block => block.images).slice(0, 4);
        imagesToPreload.push(...contentImages);
      }
      imagesToPreload.forEach(src => { const img = new window.Image(); img.src = src; });
    }
    setTimeout(() => setShowOverlay(true), CONFIG.TRANSITION.OVERLAY_DELAY)
    setTimeout(() => router.push(`/project/${id}`), CONFIG.TRANSITION.NAVIGATE_DELAY)
  }

  const getLoaderTitle = () => {
    if (!activeProject) return "";
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title;
  };

  return (
    <div className={`main-wrapper ${isTransitioning ? 'is-blurring' : ''} ${isMobile ? 'is-mobile' : ''}`}>

      {isLoading && <div className="initial-loader"><div className="wipe-text">INITIALIZING DATA</div><div className="loading-bar-container"><div className="loading-bar-fill" /></div></div>}

      {showOverlay && <div className="clou-loader-overlay"><div className="letter-wrapper">{getLoaderTitle().split('').map((char, i) => <span key={i} className="stagger-letter" style={{ animationDelay: `${i * CONFIG.TRANSITION.LETTER_STAGGER}s`, animationDuration: CONFIG.TRANSITION.LETTER_ANIM_DURATION }}>{char === ' ' ? '\u00A0' : char}</span>)}</div></div>}

      {/* 移动端缩略图预览区（导航栏由 layout.js 提供） */}
      {isMobile && !isLoading && !isTransitioning && canRenderCanvas && (
        <MobilePreview activeProject={activeProject} onNavigate={handleNavigate} isTransitioning={isTransitioning} />
      )}

      {/* 桌面端标题 */}
      {!isMobile && !isLoading && !isTransitioning && canRenderCanvas && (
        <div className="home-title-wrapper">
          <h1 className="home-title-text">PORTFOLIO 2026</h1>
        </div>
      )}

      {/* 3D Ring Canvas */}
      {canRenderCanvas && (
        <Canvas
          camera={{
            position: isMobile
              ? [CONFIG.MOBILE.CAMERA.POSITION[0], CONFIG.MOBILE.CAMERA.POSITION[1], globalInitialized ? CONFIG.MOBILE.CAMERA.POSITION[2] : CONFIG.INTRO.CAMERA_START_Z]
              : [0, 22, globalInitialized ? 45 : CONFIG.INTRO.CAMERA_START_Z],
            fov: isMobile ? CONFIG.MOBILE.CAMERA.FOV : CONFIG.CAMERA.FOV
          }}
          className="ring-canvas"
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={3} />
          <SceneContent
            targetRotation={targetRotation} setActiveProject={setActiveProject}
            activeProject={activeProject} onNavigate={handleNavigate}
            isTransitioning={isTransitioning} introActive={!isLoading} mousePos={mousePos}
            isMobile={isMobile} selectedIndex={selectedIndex}
          />
        </Canvas>
      )}

      <style jsx global>{`
        .main-wrapper {
          width: 100vw; height: 100vh;
          background: #000;
          cursor: grab; position: relative; overflow: hidden; font-family: -apple-system, sans-serif;
        }

        .main-wrapper.is-mobile {
          display: flex;
          flex-direction: column;
        }

        .ring-canvas {
          position: absolute !important;
          top: 0; left: 0; width: 100%; height: 100%;
        }

        /* 移动端Canvas只占底部 */
        .is-mobile .ring-canvas {
          top: auto !important;
          bottom: 0 !important;
          height: ${CONFIG.MOBILE.LAYOUT.RING_HEIGHT} !important;
        }

        .is-blurring canvas { filter: blur(${CONFIG.TRANSITION.BLUR_STRENGTH}); transition: filter 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .clou-loader-overlay { position: absolute; inset: 0; z-index: 600; background: #000; display: flex; align-items: center; justify-content: center; animation: overlayFadeIn ${CONFIG.TRANSITION.FADE_TIME} ease forwards; }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .stagger-letter { color: white; font-size: 5vw; font-weight: 900; text-transform: uppercase; display: inline-block; opacity: 0; animation: letterUp ease forwards; }
        @keyframes letterUp { from { opacity: 0; transform: translateY(50%); } to { opacity: 1; transform: translateY(0); } }
        .initial-loader { position: absolute; inset: 0; z-index: 500; background: black; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .wipe-text { color: white; font-size: 10px; font-weight: 900; letter-spacing: 0.8em; clip-path: inset(0 100% 0 0); animation: textWipe 1.5s ease forwards 0.5s; }
        @keyframes textWipe { 0% { clip-path: inset(0 100% 0 0); } 100% { clip-path: inset(0 0 0 0); } }
        .loading-bar-container { width: 120px; height: 1px; background: rgba(255,255,255,0.1); margin-top: 24px; overflow: hidden; }
        .loading-bar-fill { width: 100%; height: 100%; background: white; animation: barSlide 2s infinite; }

        /* 桌面端标题 */
        .home-title-wrapper {
          position: absolute; bottom: 40px; left: 40px; z-index: 10; pointer-events: none; color: white;
        }
        .home-title-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 3rem; font-weight: 900; margin: 0; letter-spacing: -2px; line-height: 1;
          opacity: 0;
          animation: revealTitle 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s;
        }
        @keyframes revealTitle {
          0% { opacity: 0; clip-path: inset(0 100% 0 0); transform: translateX(-20px); }
          100% { opacity: 1; clip-path: inset(0 0 0 0); transform: translateX(0); }
        }

        /* ============================================ */
        /* 移动端样式 */
        /* ============================================ */
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .mobile-preview {
          height: ${CONFIG.MOBILE.LAYOUT.PREVIEW_HEIGHT};
          padding: ${CONFIG.MOBILE.PREVIEW.PADDING};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          cursor: pointer;
          margin-top: ${CONFIG.MOBILE.LAYOUT.HEADER_HEIGHT};
        }

        .mobile-preview-image {
          width: 100%;
          max-width: ${CONFIG.MOBILE.PREVIEW.MAX_WIDTH}px;
          aspect-ratio: ${CONFIG.MOBILE.PREVIEW.ASPECT_RATIO};
          border-radius: ${CONFIG.MOBILE.PREVIEW.BORDER_RADIUS}px;
          overflow: hidden;
          opacity: 0;
          animation: scaleIn 0.5s ease forwards;
        }

        .mobile-preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mobile-preview-title {
          color: white;
          font-size: ${CONFIG.MOBILE.PREVIEW.TITLE_SIZE};
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-top: ${CONFIG.MOBILE.PREVIEW.TITLE_MARGIN}px;
          text-align: center;
          opacity: 0;
          animation: fadeIn 0.4s ease forwards 0.2s;
        }

        /* 移动端触摸区域 */
        .is-mobile {
          touch-action: pan-y;
          cursor: default;
        }

        .is-mobile .ring-canvas {
          touch-action: none;
        }

        @media (max-width: ${CONFIG.MOBILE.BREAKPOINT}px) {
          .stagger-letter {
            font-size: 8vw;
          }
          .wipe-text {
            font-size: 8px;
            letter-spacing: 0.5em;
          }
        }
      `}</style>
    </div>
  )
}
