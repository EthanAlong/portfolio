"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

// 全局变量：记录网站是否已初次加载，防止返回首页时重复 Loading
let globalInitialized = false;

/**
 * ============================================================
 * 【 设计师控制台 - DESIGNER CONFIG 】
 * ============================================================
 */
const CONFIG = {
  INTRO: {
    SPIN_KICK: Math.PI * 1.5, // 开场旋转总量 (弧度)
    CAMERA_START_Z: 75,      // 开场相机起始位置 (越远越有拉近感)
    FADE_DURATION: 1.5,      // 开场黑场渐显时间 (秒)
  },
  RING: {
    RADIUS: 17,              // 圆环半径
    IMAGE_W: 5,              // 圆环图片宽
    IMAGE_H: 4,              // 圆环图片高
    HOVER_OUT: 2.2,          // 悬停时向外弹出的距离
    HOVER_UP: 1.2,           // 悬停时向上抬起的高度
    INITIAL_OFFSET: 0.12,    // 初始角度偏移
  },
  CENTRAL: {
    IMAGE_W: 10,             // 中间大图宽
    IMAGE_H: 7.5,            // 中间大图高
    Y_OFFSET: 1.5,           // 大图垂直位置
    Z_OFFSET: -5,            // 大图深度位置
    TEXT_Y: -4.5,            // 标题文字位置
  },
  CAMERA: {
    POSITION: [0, 22, 45],   // 【俯视逻辑】Y 轴越高，俯感越强 (目前 22)
    FOV: 55,                 // 视角广度
  },
  INTERACTION: {
    WHEEL_SPEED: 0.002,      // 滚轮灵敏度
    DRAG_SPEED: 0.005,       // 鼠标拖拽灵敏度
    DAMPING: 4,              // 旋转阻尼系数 (惯性感)
  },
  MOUSE_TILT: {
    X_INTENSITY: 0.12,       // 鼠标上下移动带动圆环倾斜的强度
    Z_INTENSITY: 0.15,       // 鼠标左右移动带动圆环歪斜的强度
    SMOOTHING: 0.05,         // 倾斜跟随的丝滑度
  }
}

// 1. 项目单体组件
function ProjectItem({ item, index, total, setActiveProject, onNavigate }) {
  const ref = useRef(); const [hovered, setHover] = useState(false);
  const angle = (index / total) * Math.PI * 2;
  const currentRadius = useRef(CONFIG.RING.RADIUS);

  useFrame(() => {
    if (!ref.current) return;
    const targetRadius = hovered ? CONFIG.RING.RADIUS + CONFIG.RING.HOVER_OUT : CONFIG.RING.RADIUS;
    currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, 0.1);
    ref.current.position.set(Math.sin(angle) * currentRadius.current, hovered ? CONFIG.RING.HOVER_UP : 0, Math.cos(angle) * currentRadius.current);
    const s = hovered ? 1.05 : 1;
    ref.current.scale.lerp(new THREE.Vector3(CONFIG.RING.IMAGE_W * s, CONFIG.RING.IMAGE_H * s, 1), 0.1);
  });

  return (
    <Suspense fallback={null}>
      <Image ref={ref} url={item.ringImage} transparent side={THREE.DoubleSide} rotation={[0, angle + Math.PI / 2, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); setActiveProject(item); }}
        onPointerOut={() => setHover(false)} onClick={(e) => { e.stopPropagation(); onNavigate(item.id); }} />
    </Suspense>
  )
}

// 2. 固定中置显示组件
function CentralDisplay({ activeProject, onNavigate }) {
  const group = useRef();
  useFrame(() => { if (group.current) group.current.scale.lerp(new THREE.Vector3(activeProject ? 1 : 0, activeProject ? 1 : 0, activeProject ? 1 : 0), 0.1); });
  
  // 核心修复：合并数组标题，处理 toUpperCase
  const getTitleString = () => {
    if (!activeProject) return "";
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title;
  };

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        {activeProject && (
          <>
            <Image url={activeProject.mainImage} scale={[CONFIG.CENTRAL.IMAGE_W, CONFIG.CENTRAL.IMAGE_H]} position={[0, CONFIG.CENTRAL.Y_OFFSET, CONFIG.CENTRAL.Z_OFFSET]} transparent toneMapped={false} onClick={() => onNavigate(activeProject.id)} />
            <Text position={[0, CONFIG.CENTRAL.TEXT_Y, CONFIG.CENTRAL.Z_OFFSET + 0.2]} fontSize={1.2} color="white" fontWeight={900} letterSpacing={-0.05} anchorY="middle">
              {getTitleString().toUpperCase()}
            </Text>
          </>
        )}
      </Suspense>
    </group>
  )
}

// 3. 场景内容驱动核心
function SceneContent({ targetRotation, setActiveProject, activeProject, onNavigate, isTransitioning, introActive, mousePos }) {
  const spinGroup = useRef(); const tiltGroup = useRef(); const scrollRotation = useRef(CONFIG.RING.INITIAL_OFFSET);

  useFrame((state, delta) => {
    // 相机俯视角度锁定
    if (introActive) { state.camera.position.lerp(new THREE.Vector3(...CONFIG.CAMERA.POSITION), 0.03); state.camera.lookAt(0, 0, 0); }
    // 旋转逻辑
    scrollRotation.current = THREE.MathUtils.damp(scrollRotation.current, targetRotation.current, CONFIG.INTERACTION.DAMPING, delta);
    if (spinGroup.current) spinGroup.current.rotation.y = scrollRotation.current;
    // 随鼠标倾斜
    if (tiltGroup.current) {
      tiltGroup.current.rotation.x = THREE.MathUtils.lerp(tiltGroup.current.rotation.x, mousePos.current.y * CONFIG.MOUSE_TILT.X_INTENSITY, CONFIG.MOUSE_TILT.SMOOTHING);
      tiltGroup.current.rotation.z = THREE.MathUtils.lerp(tiltGroup.current.rotation.z, -mousePos.current.x * CONFIG.MOUSE_TILT.Z_INTENSITY, CONFIG.MOUSE_TILT.SMOOTHING);
    }
    // 点击转场冲击
    if (isTransitioning) { targetRotation.current += delta * 4; state.camera.position.lerp(new THREE.Vector3(0, 5, 5), 0.05); }
  });

  return (
    <group ref={tiltGroup}>
      <group ref={spinGroup}>
        {projects.map((item, i) => <ProjectItem key={item.id} index={i} total={projects.length} item={item} setActiveProject={setActiveProject} onNavigate={onNavigate} />)}
      </group>
      <CentralDisplay activeProject={activeProject} onNavigate={onNavigate} />
    </group>
  )
}

export default function RingInterface() {
  const router = useRouter(); const [hasMounted, setHasMounted] = useState(false);
  const [activeProject, setActiveProject] = useState(null); const [isLoading, setIsLoading] = useState(!globalInitialized);
  const [isTransitioning, setIsTransitioning] = useState(false); const targetRotation = useRef(CONFIG.RING.INITIAL_OFFSET);
  const mousePos = useRef({ x: 0, y: 0 }); const isDragging = useRef(false); const lastMouseX = useRef(0);

  useEffect(() => {
    setHasMounted(true);
    if (!globalInitialized) {
      setTimeout(() => { setIsLoading(false); targetRotation.current += CONFIG.INTRO.SPIN_KICK; globalInitialized = true; }, 2500);
    } else { targetRotation.current += CONFIG.INTRO.SPIN_KICK; }
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const hMove = (e) => { 
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1; mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (isDragging.current) { targetRotation.current += (e.clientX - lastMouseX.current) * CONFIG.INTERACTION.DRAG_SPEED; lastMouseX.current = e.clientX; }
    };
    const hWheel = (e) => { targetRotation.current -= e.deltaY * CONFIG.INTERACTION.WHEEL_SPEED; };
    const hDown = (e) => { isDragging.current = true; lastMouseX.current = e.clientX; };
    const hUp = () => isDragging.current = false;
    window.addEventListener('wheel', hWheel, { passive: true }); window.addEventListener('mousedown', hDown);
    window.addEventListener('mousemove', hMove); window.addEventListener('mouseup', hUp);
    return () => { window.removeEventListener('wheel', hWheel); window.removeEventListener('mousedown', hDown); window.removeEventListener('mousemove', hMove); window.removeEventListener('mouseup', hUp); };
  }, [hasMounted]);

  if (!hasMounted) return <div style={{background:'black', width:'100vw', height:'100vh'}} />;

  const displayTitleString = activeProject 
    ? (Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title)
    : "";

  return (
    <div className="main-wrapper">
      {isLoading && <div className="initial-loader"><div className="wipe-text">INITIALIZING ARCHIVE</div><div className="loading-bar-container"><div className="loading-bar-fill" /></div></div>}
      {isTransitioning && (
        <div className="clou-loader-overlay">
          <div className="letter-wrapper">
            {displayTitleString.split('').map((char, i) => (
              <span key={i} className="stagger-letter" style={{ animationDelay: `${i * 0.05}s` }}>{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </div>
        </div>
      )}
      <Canvas camera={{ position: [0, 22, globalInitialized ? 45 : CONFIG.INTRO.CAMERA_START_Z], fov: CONFIG.CAMERA.FOV }}>
        <color attach="background" args={['#000']} /><ambientLight intensity={3} />
        <SceneContent targetRotation={targetRotation} setActiveProject={setActiveProject} activeProject={activeProject} onNavigate={(id) => { setIsTransitioning(true); setTimeout(() => router.push(`/project/${id}`), 2000); }} isTransitioning={isTransitioning} introActive={!isLoading} mousePos={mousePos} />
      </Canvas>
      <style jsx global>{`
        .main-wrapper { width: 100vw; height: 100vh; background: black; cursor: grab; position: relative; overflow: hidden; font-family: -apple-system, sans-serif; }
        .initial-loader { position: absolute; inset: 0; z-index: 500; background: black; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .wipe-text { color: white; font-size: 10px; font-weight: 900; letter-spacing: 0.8em; clip-path: inset(0 100% 0 0); animation: textWipe 1.5s ease forwards 0.5s; }
        @keyframes textWipe { 0% { clip-path: inset(0 100% 0 0); } 100% { clip-path: inset(0 0 0 0); } }
        .loading-bar-container { width: 120px; height: 1px; background: rgba(255,255,255,0.1); margin-top: 24px; overflow: hidden; }
        .loading-bar-fill { width: 100%; height: 100%; background: white; animation: barSlide 2s infinite; }
        .clou-loader-overlay { position: absolute; inset: 0; z-index: 600; background: #000; display: flex; align-items: center; justify-content: center; }
        .stagger-letter { color: white; font-size: 5vw; font-weight: 900; text-transform: uppercase; display: inline-block; animation: letterUp 0.8s ease forwards; }
        @keyframes letterUp { from { opacity: 0; transform: translateY(50%); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}