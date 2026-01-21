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
  // --- 【移动端配置】 ---
  MOBILE: {
    BREAKPOINT: 768,         // 移动端断点宽度
    CAMERA: {
      POSITION: [0, 20, 40], // 相机位置
      LOOK_AT: [-20, 0, 0],  // 【关键】相机看向左侧，让左半环居中显示
      FOV: 55,
    },
    RING: {
      RADIUS: 18,            // 稍小的半径
      IMAGE_W: 5,
      IMAGE_H: 3.5,
      INITIAL_OFFSET: Math.PI * 0.5, // 初始旋转让左侧项目面向相机
    },
    CENTRAL: {
      IMAGE_W: 9,
      IMAGE_H: 6,
      X_OFFSET: -24,         // 缩略图在左半环的左侧浮动
      Y_OFFSET: 0,
      Z_OFFSET: 10,          // 稍微靠前，避免被ring遮挡
      TEXT_Y: -5,
    },
    // 陀螺仪倾斜配置
    GYRO: {
      X_INTENSITY: 0.015,    // 前后倾斜强度
      Z_INTENSITY: 0.025,    // 左右倾斜强度
      SMOOTHING: 0.08,       // 平滑度
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
// 替代 Vanta/Sparkles。实现点与点之间的连线，以及整体公转。
function DataNetwork() {
  const groupRef = useRef()
  const linesRef = useRef()
  
  // 1. 生成静态粒子数据 (只计算一次)
  const { points, linesGeometry } = useMemo(() => {
    const particleCount = 150; // 粒子数量
    const radius = 160;         // 分布半径
    const connectionDist = 35; // 连线距离阈值

    const positions = new Float32Array(particleCount * 3);
    const particles = [];

    // 生成随机点
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * radius * 2;
      const y = (Math.random() - 0.5) * radius * 1.5;
      const z = (Math.random() - 0.5) * radius * 0.8; // 稍微扁一点
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      particles.push(new THREE.Vector3(x, y, z));
    }

    // 计算连线 (静态拓扑，性能极高)
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

    return { 
      points: positions, 
      linesGeometry: geometry 
    };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // 1. 集体公转：绝对不会自转，只是整体像星系一样转
      groupRef.current.rotation.y -= delta * 0.03; 
    }
    
    if (linesRef.current) {
      // 2. 线条呼吸效果：模拟数据传输的闪烁感
      // 利用正弦波让透明度在 0.05 到 0.25 之间波动
      const breath = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      linesRef.current.material.opacity = breath;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}> 
      {/* 粒子点 (Nodes) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}           // 点的大小
          color="#aaaaaa"      // 浅灰色节点
          transparent
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>

      {/* 连线 (Links) */}
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial
          color="#555555"      // 深灰色连线
          transparent
          opacity={0.45}       // 初始透明度 (会被 useFrame 覆盖)
          depthWrite={false}   // 关键：防止线条遮挡
        />
      </lineSegments>
    </group>
  )
}

// 1. 项目单体组件
function ProjectItem({ item, index, total, setActiveProject, onNavigate, isTransitioning, isMobile }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)
  const angle = (index / total) * Math.PI * 2

  const ringConfig = isMobile ? CONFIG.MOBILE.RING : CONFIG.RING
  const currentRadius = useRef(ringConfig.RADIUS)

  useFrame(() => {
    if (!ref.current) return
    const baseRadius = isMobile ? CONFIG.MOBILE.RING.RADIUS : CONFIG.RING.RADIUS
    const targetBaseRadius = hovered ? baseRadius + CONFIG.RING.HOVER_OUT : baseRadius
    currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetBaseRadius, 0.1)

    ref.current.position.set(
      Math.sin(angle) * currentRadius.current,
      THREE.MathUtils.lerp(ref.current.position.y, hovered ? CONFIG.RING.HOVER_UP : 0, 0.1),
      Math.cos(angle) * currentRadius.current
    )

    const imgW = isMobile ? CONFIG.MOBILE.RING.IMAGE_W : CONFIG.RING.IMAGE_W
    const imgH = isMobile ? CONFIG.MOBILE.RING.IMAGE_H : CONFIG.RING.IMAGE_H
    const s = hovered ? 1.05 : 1
    ref.current.scale.lerp(new THREE.Vector3(imgW * s, imgH * s, 1), 0.1)
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

// 2. 中间大图显示 (移动端在左侧浮动，始终面向相机)
function CentralDisplay({ activeProject, onNavigate, isTransitioning, isMobile }) {
  const group = useRef()
  const imageRef = useRef()
  const textRef = useRef()

  useFrame((state) => {
    if (!group.current) return
    const targetScale = (activeProject && !isTransitioning) ? 1 : 0
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    // 【关键】让图片和文字始终面向相机（Billboard效果）
    if (isMobile && imageRef.current) {
      imageRef.current.lookAt(state.camera.position)
    }
    if (isMobile && textRef.current) {
      textRef.current.lookAt(state.camera.position)
    }
  })

  const getTitleString = () => {
    if (!activeProject) return "";
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title;
  };

  // 根据设备选择配置
  const centralConfig = isMobile ? CONFIG.MOBILE.CENTRAL : CONFIG.CENTRAL
  const xOffset = isMobile ? CONFIG.MOBILE.CENTRAL.X_OFFSET : 0

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        {activeProject && (
          <>
            <Image
              ref={imageRef}
              url={activeProject.mainImage}
              scale={[centralConfig.IMAGE_W, centralConfig.IMAGE_H]}
              position={[xOffset, centralConfig.Y_OFFSET, centralConfig.Z_OFFSET]}
              transparent
              toneMapped={false}
              onClick={() => onNavigate(activeProject.id)}
            />
            <Text
              ref={textRef}
              position={[xOffset, centralConfig.TEXT_Y, centralConfig.Z_OFFSET + 0.2]}
              fontSize={isMobile ? 0.8 : 1.2}
              color="white"
              fontWeight={900}
              letterSpacing={-0.05}
              anchorY="middle"
              maxWidth={isMobile ? 8 : 20}
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
function SceneContent({ targetRotation, setActiveProject, activeProject, onNavigate, isTransitioning, introActive, mousePos, isMobile, gyroPos }) {
  const spinGroup = useRef()
  const tiltGroup = useRef()
  const bgGroup = useRef() // 新增背景容器 Ref

  const initialOffset = isMobile ? CONFIG.MOBILE.RING.INITIAL_OFFSET : CONFIG.RING.INITIAL_OFFSET
  const scrollRotation = useRef(initialOffset)
  const transitionRadiusScale = useRef(1.0)

  // 根据设备选择相机目标位置和lookAt目标
  const cameraTarget = isMobile ? CONFIG.MOBILE.CAMERA.POSITION : CONFIG.CAMERA.POSITION
  const lookAtTarget = isMobile ? CONFIG.MOBILE.CAMERA.LOOK_AT : CONFIG.CAMERA.LOOK_AT

  useFrame((state, delta) => {
    if (introActive) {
      state.camera.position.lerp(new THREE.Vector3(...cameraTarget), 0.03)
      // 【关键】移动端看向左侧，桌面端看向中心
      state.camera.lookAt(new THREE.Vector3(...lookAtTarget))
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

    // --- Ring 的视差倾斜 (前景) ---
    if (tiltGroup.current && !isTransitioning) {
      if (isMobile && gyroPos) {
        // 移动端：使用陀螺仪数据
        const tx = gyroPos.current.x * CONFIG.MOBILE.GYRO.X_INTENSITY
        const tz = -gyroPos.current.z * CONFIG.MOBILE.GYRO.Z_INTENSITY
        tiltGroup.current.rotation.x = THREE.MathUtils.lerp(tiltGroup.current.rotation.x, tx, CONFIG.MOBILE.GYRO.SMOOTHING)
        tiltGroup.current.rotation.z = THREE.MathUtils.lerp(tiltGroup.current.rotation.z, tz, CONFIG.MOBILE.GYRO.SMOOTHING)
      } else {
        // 桌面端：使用鼠标位置
        const tx = mousePos.current.y * CONFIG.MOUSE_TILT.X_INTENSITY
        const tz = -mousePos.current.x * CONFIG.MOUSE_TILT.Z_INTENSITY
        tiltGroup.current.rotation.x = THREE.MathUtils.lerp(tiltGroup.current.rotation.x, tx, CONFIG.MOUSE_TILT.SMOOTHING)
        tiltGroup.current.rotation.z = THREE.MathUtils.lerp(tiltGroup.current.rotation.z, tz, CONFIG.MOUSE_TILT.SMOOTHING)
      }
    }

    // --- 【背景的视差倾斜 (模拟引力)】 ---
    if (bgGroup.current && !isTransitioning) {
      if (isMobile && gyroPos) {
        // 移动端：背景也跟随陀螺仪，强度稍大
        const bgTx = gyroPos.current.x * 0.03
        const bgTz = -gyroPos.current.z * 0.05
        bgGroup.current.rotation.x = THREE.MathUtils.lerp(bgGroup.current.rotation.x, bgTx, 0.05)
        bgGroup.current.rotation.z = THREE.MathUtils.lerp(bgGroup.current.rotation.z, bgTz, 0.05)
      } else {
        // 桌面端：使用鼠标位置
        const bgTx = mousePos.current.y * 0.15
        const bgTz = -mousePos.current.x * 0.15
        bgGroup.current.rotation.x = THREE.MathUtils.lerp(bgGroup.current.rotation.x, bgTx, 0.03)
        bgGroup.current.rotation.z = THREE.MathUtils.lerp(bgGroup.current.rotation.z, bgTz, 0.03)
      }
    }
  })

  return (
    <>
      {/* --- 【背景层：放置 DataNetwork】 --- */}
      <group ref={bgGroup}>
        <DataNetwork />
      </group>

      {/* --- 前景层：Ring --- */}
      <group ref={tiltGroup}>
        <group ref={spinGroup}>
          {projects.map((item, i) => (
            <ProjectItem
              key={item.id} index={i} total={projects.length} item={item}
              setActiveProject={setActiveProject} onNavigate={onNavigate}
              isTransitioning={isTransitioning} isMobile={isMobile}
            />
          ))}
        </group>
        <CentralDisplay activeProject={activeProject} onNavigate={onNavigate} isTransitioning={isTransitioning} isMobile={isMobile} />
      </group>
    </>
  )
}

// 4. 主入口
export default function RingInterface() {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [canRenderCanvas, setCanRenderCanvas] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [isLoading, setIsLoading] = useState(!globalInitialized)
  const [isMobile, setIsMobile] = useState(false)

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const targetRotation = useRef(CONFIG.RING.INITIAL_OFFSET)
  const mousePos = useRef({ x: 0, y: 0 })
  const gyroPos = useRef({ x: 0, z: 0 })  // 陀螺仪数据
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)
  const lastTouchX = useRef(0)

  // 移动端检测
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < CONFIG.MOBILE.BREAKPOINT
      setIsMobile(mobile)
      // 更新初始旋转偏移
      if (mobile) {
        targetRotation.current = CONFIG.MOBILE.RING.INITIAL_OFFSET
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setHasMounted(true)
    const timer = setTimeout(() => {
      setCanRenderCanvas(true)
      if (!globalInitialized) {
        setTimeout(() => { setIsLoading(false); targetRotation.current += CONFIG.INTRO.SPIN_KICK; globalInitialized = true; }, 2500)
      } else {
        setTimeout(() => { targetRotation.current += CONFIG.INTRO.SPIN_KICK; }, 100)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    // --- 桌面端事件 ---
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
        // 移动端拖拽速度稍微调高一点
        targetRotation.current += (touchX - lastTouchX.current) * CONFIG.INTERACTION.DRAG_SPEED * 1.5
        lastTouchX.current = touchX
      }
    }
    const hTouchEnd = () => isDragging.current = false

    // 桌面端监听
    window.addEventListener('wheel', hWheel, { passive: true })
    window.addEventListener('mousedown', hDown)
    window.addEventListener('mousemove', hMove)
    window.addEventListener('mouseup', hUp)

    // 移动端监听
    window.addEventListener('touchstart', hTouchStart, { passive: true })
    window.addEventListener('touchmove', hTouchMove, { passive: true })
    window.addEventListener('touchend', hTouchEnd)

    return () => {
      window.removeEventListener('wheel', hWheel)
      window.removeEventListener('mousedown', hDown)
      window.removeEventListener('mousemove', hMove)
      window.removeEventListener('mouseup', hUp)
      window.removeEventListener('touchstart', hTouchStart)
      window.removeEventListener('touchmove', hTouchMove)
      window.removeEventListener('touchend', hTouchEnd)
    }
  }, [hasMounted, isTransitioning])

  // --- 移动端陀螺仪支持 ---
  useEffect(() => {
    if (!isMobile || !hasMounted) return

    const handleOrientation = (e) => {
      if (isTransitioning) return
      // beta: 前后倾斜 (-180 ~ 180), gamma: 左右倾斜 (-90 ~ 90)
      const beta = e.beta || 0
      const gamma = e.gamma || 0
      // 归一化到 -1 ~ 1 范围
      gyroPos.current.x = Math.max(-1, Math.min(1, beta / 45))   // 前后
      gyroPos.current.z = Math.max(-1, Math.min(1, gamma / 45))  // 左右
    }

    // iOS 13+ 需要请求权限
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } catch (err) {
          console.log('Gyroscope permission denied')
        }
      } else {
        // 非 iOS 或旧版本直接监听
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    // 首次触摸时请求权限（iOS要求用户交互后才能请求）
    const requestOnTouch = () => {
      requestPermission()
      window.removeEventListener('touchstart', requestOnTouch)
    }
    window.addEventListener('touchstart', requestOnTouch, { once: true })

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('touchstart', requestOnTouch)
    }
  }, [isMobile, hasMounted, isTransitioning])

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
    <div className={`main-wrapper ${isTransitioning ? 'is-blurring' : ''}`}>
      
      {isLoading && <div className="initial-loader"><div className="wipe-text">INITIALIZING DATA</div><div className="loading-bar-container"><div className="loading-bar-fill" /></div></div>}
      
      {showOverlay && <div className="clou-loader-overlay"><div className="letter-wrapper">{getLoaderTitle().split('').map((char, i) => <span key={i} className="stagger-letter" style={{ animationDelay: `${i * CONFIG.TRANSITION.LETTER_STAGGER}s`, animationDuration: CONFIG.TRANSITION.LETTER_ANIM_DURATION }}>{char === ' ' ? '\u00A0' : char}</span>)}</div></div>}
      
      {!isLoading && !isTransitioning && canRenderCanvas && (
        <div className="home-title-wrapper">
          <h1 className="home-title-text">PORTFOLIO 2026</h1>
        </div>
      )}

      {/* --- 3D Ring Canvas --- */}
      {canRenderCanvas && (
        <Canvas
          camera={{
            position: isMobile
              ? [CONFIG.MOBILE.CAMERA.POSITION[0], CONFIG.MOBILE.CAMERA.POSITION[1], globalInitialized ? CONFIG.MOBILE.CAMERA.POSITION[2] : CONFIG.INTRO.CAMERA_START_Z]
              : [0, 22, globalInitialized ? 45 : CONFIG.INTRO.CAMERA_START_Z],
            fov: isMobile ? CONFIG.MOBILE.CAMERA.FOV : CONFIG.CAMERA.FOV
          }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={3} />
          <SceneContent
            targetRotation={targetRotation} setActiveProject={setActiveProject}
            activeProject={activeProject} onNavigate={handleNavigate}
            isTransitioning={isTransitioning} introActive={!isLoading} mousePos={mousePos}
            isMobile={isMobile} gyroPos={gyroPos}
          />
        </Canvas>
      )}

      <style jsx global>{`
        .main-wrapper {
          width: 100vw; height: 100vh;
          background: transparent;
          cursor: grab; position: relative; overflow: hidden; font-family: -apple-system, sans-serif;
          touch-action: none; /* 防止移动端默认手势干扰 */
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

        /* --- 移动端样式 --- */
        @media (max-width: ${CONFIG.MOBILE.BREAKPOINT}px) {
          .home-title-wrapper {
            bottom: 24px;
            left: 20px;
            right: 20px;
          }
          .home-title-text {
            font-size: 1.8rem;
            letter-spacing: -1px;
          }
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