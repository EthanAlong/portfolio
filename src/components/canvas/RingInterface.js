"use client"
/**
 * ============================================================
 * 【 RingInterface.js - 3D 项目展示环形界面 】
 * ============================================================
 *
 * 文件概述：
 * 这是 Portfolio 网站的核心交互组件，实现了一个 3D 环形项目展示界面。
 * 支持桌面端（鼠标悬停 + 滚轮旋转）和移动端（触摸滑动 + CLOU 风格弹出）。
 *
 * 主要功能：
 * 1. 3D 环形布局 - 项目图片围成一个可旋转的环
 * 2. 响应式设计 - 桌面端和移动端有不同的交互模式
 * 3. 入场动画 - 首次加载时显示 "INITIALIZING DATA" 加载动画
 * 4. 转场动画 - 点击项目时的模糊、旋转加速、标题逐字显示效果
 * 5. 返回动画 - 从项目页返回时的旋转动画
 *
 * 技术栈：
 * - React Three Fiber (R3F) - React 的 Three.js 渲染器
 * - @react-three/drei - R3F 的实用工具库
 * - Next.js App Router - 页面路由
 *
 * 文件结构：
 * - RING_PARAMS: 移动端/桌面端的分离式参数配置
 * - CONFIG: 通用配置（动画时间、断点等）
 * - DataNetwork: 背景粒子网络组件
 * - ProjectItem: 单个项目图片组件
 * - CentralDisplay: 桌面端中央大图预览
 * - SceneContent: 3D 场景核心逻辑
 * - MobilePreview: 移动端 HTML 预览区域
 * - RingInterface: 主入口组件
 *
 * 作者：Ethan
 * 最后更新：2026-01
 * ============================================================
 */

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { projects } from '@/data/projects'

/**
 * 全局状态变量（模块级别）
 * 这些变量在组件重新挂载时保持不变，用于跨导航的状态管理
 */
// 防止生产环境返回首页时重复运行 Initial Loading 动画
let globalInitialized = false;
// 记录最后一次旋转的时间戳，用于确保每次返回都会触发旋转动画
let lastSpinTimestamp = 0;

/**
 * ============================================================
 * 【 RING_PARAMS - 分离式配置控制台 】
 * ============================================================
 *
 * 设计原则：逻辑共用，参数分离
 * - mobile: 移动端专用参数（CLOU 风格左侧弹出）
 * - desktop: 桌面端专用参数（hover 居中弹出）
 *
 * 修改此对象即可分别调整两端表现，无需修改核心逻辑代码
 * ============================================================
 */
const RING_PARAMS = {
  /**
   * 移动端配置 - CLOU Style
   * 参考 CLOU Architects 官网：项目在屏幕最左侧位置触发弹出
   */
  mobile: {
    selection: {
      // 【核心参数】控制项目在哪个角度位置弹出
      // -1.57 ≈ -π/2 = -90度，对应屏幕左侧位置
      // 调试方法：如果项目在右边弹出，增减约 1.57 的偏移量
      selectionOffset: 1.17,

      // 触发范围阈值：数值越小，项目需要越靠近"左侧"才能弹出
      // 0.25 = 较宽松，0.1 = 非常精确
      snapThreshold: 0.005,

      // 动效平滑速度：控制弹出和收回的响应速度
      // 0.12 = 较柔和，0.2 = 较快速
      lerpSpeed: 0.12,
    },
    visuals: {
      selectedScale: 1.25,       // 弹出时的放大倍率
      selectedTranslateY: 1.75,   // 弹出时的纵向位移（上浮高度）
      unselectedOpacity: 0.6,    // 非选中项目的透明度（用于聚焦中心）
    },
    ring: {
      radius: 16,                // Ring 半径
      imageW: 6,                 // 图片宽度
      imageH: 4,                 // 图片高度
      initialOffset: Math.PI * 0.5,  // 初始旋转角度
    },
    camera: {
      position: [0, 10, 35],     // 相机位置 [X, Y, Z]
      lookAt: [-15, -5, 0],      // 相机看向的点（负X=看向左边）
      fov: 50,                   // 视野角度
    },
    interaction: {
      dragSpeed: 0.028,          // 触摸滑动灵敏度
      damping: 5,                // 阻尼感（值越大越快停下）
    },
    layout: {
      headerHeight: '10vh',      // 顶部导航区域高度
      previewHeight: '35vh',     // 中间预览区域高度
      ringHeight: '55vh',        // 底部 Ring 区域高度
    },
    preview: {
      maxWidth: 360,             // 预览图最大宽度 (px)
      aspectRatio: '16/10',      // 宽高比
      borderRadius: 8,           // 圆角 (px)
      titleSize: '1rem',         // 标题字号
      titleMargin: 12,           // 标题与图片间距 (px)
      padding: '10px 20px',      // 容器内边距
    },
  },

  /**
   * 桌面端配置 - Hover Style
   * 鼠标悬停时项目弹出，中央显示大图预览
   */
  desktop: {
    selection: {
      // 桌面端不使用角度选中，而是 hover 触发
      selectionOffset: 0,
      snapThreshold: 0.15,
      lerpSpeed: 0.1,
    },
    visuals: {
      selectedScale: 1.05,       // hover 时的放大倍率
      selectedTranslateY: 1.2,   // hover 时的上浮高度
      unselectedOpacity: 1.0,    // 非 hover 项目保持完全不透明
    },
    ring: {
      radius: 20,                // Ring 半径（比移动端大）
      imageW: 6,                 // 图片宽度
      imageH: 4,                 // 图片高度
      initialOffset: 0.12,       // 初始旋转偏角
      hoverOut: 2.2,             // 鼠标悬停时弹出的额外距离
    },
    camera: {
      position: [0, 22, 45],     // 俯视稳定视角 [X, Y, Z]
      lookAt: [0, 0, 0],         // 看向中心
      fov: 60,                   // 视野角度
    },
    interaction: {
      wheelSpeed: 0.002,         // 滚轮灵敏度
      dragSpeed: 0.005,          // 鼠标拖拽灵敏度
      damping: 4,                // 旋转惯性阻尼
    },
    mouseTilt: {
      xIntensity: 0.04,          // 俯仰倾斜强度
      zIntensity: 0.15,          // 左右倾斜强度
      smoothing: 0.05,           // 倾斜跟随平滑度
    },
    central: {
      imageW: 18,                // 中央大图宽度
      imageH: 12,                // 中央大图高度
      yOffset: -5.5,             // Y轴偏移
      zOffset: -5,               // Z轴偏移
      textY: -12.5,              // 标题文字Y位置
    },
  },
};

/**
 * ============================================================
 * 【 CONFIG - 通用配置（两端共享）】
 * ============================================================
 */
const CONFIG = {
  // --- 开场动画 ---
  INTRO: {
    SPIN_KICK: Math.PI * 0.9,    // 开场旋转总量
    CAMERA_START_Z: 70,          // 开场相机起始深度
    FADE_DURATION: 1.5,          // 黑场渐显时间
  },

  // --- 断点 ---
  BREAKPOINT: 768,               // 移动端断点宽度

  // --- 转场序列控制 ---
  TRANSITION: {
    SPIN_ACCEL: 5.0,             // [1] 点击瞬间：旋转加速度
    EXPAND_SCALE: 2.5,           // [1] 点击瞬间：半径扩张倍数
    EXPAND_SPEED: 0.005,         // [1] 点击瞬间：半径扩张的物理速度
    BLUR_STRENGTH: "30px",       // [1] 点击瞬间：同步开启的模糊强度

    OVERLAY_DELAY: 800,          // [2] 黑色遮罩层淡入的延迟时间 (毫秒)
    FADE_TIME: "0.4s",           // [2] 黑色遮罩层从透明到全黑的时间

    LETTER_ANIM_DURATION: "1s",  // [3] 加载文字每个字母弹出的时长
    LETTER_STAGGER: 0.04,        // [3] 字母之间弹出的时间差

    NAVIGATE_DELAY: 2500,        // 正式切页延迟
  },
}

/**
 * ============================================================
 * 【 核心组件：数据网络 (DataNetwork) 】
 * ============================================================
 *
 * 背景装饰性粒子网络
 * 移动端减少粒子数量以提升性能
 * ============================================================
 */
function DataNetwork({ isMobile = false }) {
  const groupRef = useRef()
  const linesRef = useRef()

  const { points, linesGeometry } = useMemo(() => {
    // 移动端减少粒子数量以提升性能
    const particleCount = isMobile ? 60 : 150
    const radius = isMobile ? 120 : 160
    const connectionDist = isMobile ? 30 : 35

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

    return { points: positions, linesGeometry: geometry }
  }, [isMobile])

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

/**
 * ============================================================
 * 【 项目单体组件 - ProjectItem 】
 * ============================================================
 *
 * 核心逻辑：
 * - 移动端 (isMobile): 使用 focusStrength 判断是否弹出（CLOU 风格）
 * - 桌面端 (!isMobile): 使用 hover 状态判断是否弹出
 *
 * @param {Object} item - 项目数据
 * @param {Number} index - 项目在环上的索引
 * @param {Number} total - 项目总数
 * @param {Number} focusStrength - 移动端专用：当前项目的激活强度 (0~1)
 * ============================================================
 */
function ProjectItem({ item, index, total, setActiveProject, onNavigate, isTransitioning, isMobile, focusStrength }) {
  const ref = useRef()
  const [hovered, setHover] = useState(false)

  // 计算项目在环上的静态角度位置
  const angle = (index / total) * Math.PI * 2

  // 获取当前设备的参数配置
  const params = isMobile ? RING_PARAMS.mobile : RING_PARAMS.desktop
  const { ring, visuals, selection } = params

  // 半径状态（用于平滑过渡）
  const currentRadius = useRef(ring.radius)

  useFrame(() => {
    if (!ref.current) return

    if (isMobile) {
      /**
       * 移动端 CLOU 风格弹出逻辑
       *
       * focusStrength 由父组件计算传入，范围 0~1
       * - 1 = 项目正好在"左侧弹出点"
       * - 0 = 项目在对侧位置
       *
       * 当 focusStrength 超过阈值时，执行弹出动效
       */
      const isSelected = focusStrength > (1 - selection.snapThreshold)
      const lerpSpeed = selection.lerpSpeed

      // 计算目标半径（选中时可微调，当前保持不变）
      const targetRadius = ring.radius
      currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, lerpSpeed)

      // 更新位置：选中项上浮
      ref.current.position.set(
        Math.sin(angle) * currentRadius.current,
        THREE.MathUtils.lerp(
          ref.current.position.y,
          isSelected ? visuals.selectedTranslateY : 0,
          lerpSpeed
        ),
        Math.cos(angle) * currentRadius.current
      )

      // 更新缩放：选中项放大
      const targetScale = isSelected ? visuals.selectedScale : 1
      ref.current.scale.lerp(
        new THREE.Vector3(ring.imageW * targetScale, ring.imageH * targetScale, 1),
        lerpSpeed
      )

      // 更新透明度：非选中项变淡（通过 material）
      if (ref.current.material) {
        const targetOpacity = isSelected ? 1 : visuals.unselectedOpacity
        ref.current.material.opacity = THREE.MathUtils.lerp(
          ref.current.material.opacity,
          targetOpacity,
          lerpSpeed
        )
      }
    } else {
      /**
       * 桌面端 Hover 弹出逻辑
       *
       * 鼠标悬停时项目向外弹出并上浮
       */
      const lerpSpeed = selection.lerpSpeed
      const baseRadius = ring.radius
      const targetRadius = hovered ? baseRadius + (ring.hoverOut || 0) : baseRadius
      currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, targetRadius, lerpSpeed)

      // 更新位置
      ref.current.position.set(
        Math.sin(angle) * currentRadius.current,
        THREE.MathUtils.lerp(
          ref.current.position.y,
          hovered ? visuals.selectedTranslateY : 0,
          lerpSpeed
        ),
        Math.cos(angle) * currentRadius.current
      )

      // 更新缩放
      const targetScale = hovered ? visuals.selectedScale : 1
      ref.current.scale.lerp(
        new THREE.Vector3(ring.imageW * targetScale, ring.imageH * targetScale, 1),
        lerpSpeed
      )
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
          // 桌面端：hover 触发选中
          if (!isTransitioning && !isMobile) {
            e.stopPropagation()
            setHover(true)
            setActiveProject(item)
          }
        }}
        onPointerOut={() => !isMobile && setHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          /**
           * 移动端禁用 Ring 上的点击
           * 只允许通过 HTML 预览区域点击进入详情页
           * 避免在滑动旋转时误触
           */
          if (!isMobile) {
            onNavigate(item.id)
          }
        }}
      />
    </Suspense>
  )
}

/**
 * ============================================================
 * 【 桌面端中央大图显示 - CentralDisplay 】
 * ============================================================
 *
 * 仅在桌面端使用，移动端使用 HTML 预览区域
 * ============================================================
 */
function CentralDisplay({ activeProject, onNavigate, isTransitioning }) {
  const group = useRef()
  const { central } = RING_PARAMS.desktop

  useFrame(() => {
    if (!group.current) return
    const targetScale = (activeProject && !isTransitioning) ? 1 : 0
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  const getTitleString = () => {
    if (!activeProject) return ""
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title
  }

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        {activeProject && (
          <>
            <Image
              url={activeProject.mainImage}
              scale={[central.imageW, central.imageH]}
              position={[0, central.yOffset, central.zOffset]}
              transparent
              toneMapped={false}
              onClick={() => onNavigate(activeProject.id)}
            />
            <Text
              position={[0, central.textY, central.zOffset + 0.2]}
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

/**
 * ============================================================
 * 【 场景逻辑核心驱动 - SceneContent 】
 * ============================================================
 *
 * 职责：
 * 1. 管理环形旋转动画
 * 2. 计算每个项目的 focusStrength（CLOU 风格激活强度）
 * 3. 处理相机动画和视差效果
 * 4. 协调转场动画
 *
 * CLOU 风格算法说明：
 * - 通过 selectionOffset 将"触发点"锁定在屏幕左侧
 * - 使用余弦函数计算每个项目与触发点的距离
 * - 余弦值趋近于 1 = 项目正好在目标位置
 * ============================================================
 */
function SceneContent({
  targetRotation,
  setActiveProject,
  activeProject,
  onNavigate,
  isTransitioning,
  introActive,
  mousePos,
  isMobile,
  onFocusUpdate,  // 新增：用于向父组件传递当前选中项目
}) {
  const spinGroup = useRef()
  const tiltGroup = useRef()
  const bgGroup = useRef()

  // 获取当前设备的参数配置
  const params = isMobile ? RING_PARAMS.mobile : RING_PARAMS.desktop

  // 初始旋转偏移
  const initialOffset = params.ring.initialOffset
  const scrollRotation = useRef(initialOffset)
  const transitionRadiusScale = useRef(1.0)

  // 存储每个项目的 focusStrength（移动端使用）
  const focusStrengths = useRef(projects.map(() => 0))

  // 相机和交互参数
  const cameraTarget = params.camera.position
  const lookAtTarget = params.camera.lookAt
  const damping = params.interaction.damping

  useFrame((state, delta) => {
    // --- 相机入场动画 ---
    if (introActive) {
      state.camera.position.lerp(new THREE.Vector3(...cameraTarget), 0.03)
      state.camera.lookAt(new THREE.Vector3(...lookAtTarget))
    }

    // --- 转场动画：加速旋转 + 半径扩张 ---
    if (isTransitioning) {
      targetRotation.current += delta * CONFIG.TRANSITION.SPIN_ACCEL
      transitionRadiusScale.current = THREE.MathUtils.lerp(
        transitionRadiusScale.current,
        CONFIG.TRANSITION.EXPAND_SCALE,
        CONFIG.TRANSITION.EXPAND_SPEED
      )
    }

    // --- 平滑插值旋转角度 ---
    scrollRotation.current = THREE.MathUtils.damp(
      scrollRotation.current,
      targetRotation.current,
      damping,
      delta
    )

    // --- 更新环形旋转 ---
    if (spinGroup.current) {
      spinGroup.current.rotation.y = scrollRotation.current
      spinGroup.current.scale.setScalar(transitionRadiusScale.current)
    }

    /**
     * ============================================================
     * 【 CLOU 风格选中逻辑 - 移动端专用 】
     * ============================================================
     *
     * 算法说明：
     * 1. 获取环形当前旋转角度 scrollRotation
     * 2. 加上预设的 selectionOffset，将触发点锁定在屏幕左侧
     * 3. 计算每个项目与触发点的余弦距离
     * 4. 余弦值最大（趋近于 1）的项目为当前激活项目
     */
    if (isMobile && !isTransitioning) {
      const { selectionOffset } = params.selection
      const anglePerItem = (Math.PI * 2) / projects.length

      let maxFocusIndex = 0
      let maxFocusStrength = -1

      projects.forEach((_, index) => {
        // 1. 计算项目在环上的静态角度
        const itemAngle = index * anglePerItem

        // 2. 计算当前实际位置
        //    currentAngle = 初始角度 + 环形旋转量 + 左侧偏移量
        //    此处 selectionOffset 用于模拟 CLOU 官网的最左侧弹出逻辑
        const currentAngle = itemAngle + scrollRotation.current + selectionOffset

        // 3. 计算激活强度：使用余弦函数
        //    余弦值范围 [-1, 1]，转换为 [0, 1]
        //    当余弦值趋近于 1 时，项目正好在"左侧弹出点"
        const rawFocus = Math.cos(currentAngle)
        const focusStrength = (rawFocus + 1) / 2  // 归一化到 0~1

        focusStrengths.current[index] = focusStrength

        // 4. 找出激活强度最大的项目
        if (focusStrength > maxFocusStrength) {
          maxFocusStrength = focusStrength
          maxFocusIndex = index
        }
      })

      // 通知父组件当前选中的项目（用于更新预览区域）
      if (onFocusUpdate) {
        onFocusUpdate(maxFocusIndex, projects[maxFocusIndex])
      }
    }

    // --- 桌面端视差倾斜 ---
    if (tiltGroup.current && !isTransitioning && !isMobile) {
      const { mouseTilt } = RING_PARAMS.desktop
      const tx = mousePos.current.y * mouseTilt.xIntensity
      const tz = -mousePos.current.x * mouseTilt.zIntensity
      tiltGroup.current.rotation.x = THREE.MathUtils.lerp(
        tiltGroup.current.rotation.x, tx, mouseTilt.smoothing
      )
      tiltGroup.current.rotation.z = THREE.MathUtils.lerp(
        tiltGroup.current.rotation.z, tz, mouseTilt.smoothing
      )
    }

    // --- 桌面端背景视差 ---
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
        <DataNetwork isMobile={isMobile} />
      </group>

      <group ref={tiltGroup}>
        <group ref={spinGroup}>
          {projects.map((item, i) => (
            <ProjectItem
              key={item.id}
              index={i}
              total={projects.length}
              item={item}
              setActiveProject={setActiveProject}
              onNavigate={onNavigate}
              isTransitioning={isTransitioning}
              isMobile={isMobile}
              // 传递 focusStrength 用于 CLOU 风格弹出判断
              focusStrength={focusStrengths.current[i]}
            />
          ))}
        </group>

        {/* 桌面端才显示 3D 中央大图 */}
        {!isMobile && (
          <CentralDisplay
            activeProject={activeProject}
            onNavigate={onNavigate}
            isTransitioning={isTransitioning}
          />
        )}
      </group>
    </>
  )
}

/**
 * ============================================================
 * 【 移动端 HTML 预览区域 - MobilePreview 】
 * ============================================================
 *
 * 显示当前选中项目的大图预览和标题
 * 点击后触发导航到项目详情页
 * ============================================================
 */
function MobilePreview({ activeProject, onNavigate, isTransitioning }) {
  if (!activeProject || isTransitioning) return null

  const getTitleString = () => {
    if (!activeProject) return ""
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title
  }

  return (
    <div className="mobile-preview" onClick={() => onNavigate(activeProject.id)}>
      <div className="mobile-preview-image">
        <img src={activeProject.mainImage} alt={getTitleString()} />
      </div>
      <div className="mobile-preview-title">{getTitleString().toUpperCase()}</div>
    </div>
  )
}

/**
 * ============================================================
 * 【 主入口组件 - RingInterface 】
 * ============================================================
 *
 * 整体架构：
 * - 移动端：预览区域 (HTML) + Ring Canvas (3D)
 * - 桌面端：中央大图 (3D) + Ring Canvas (3D)
 *
 * 状态管理：
 * - isMobile: 设备类型检测
 * - activeProject: 当前激活的项目
 * - isTransitioning: 转场动画状态
 * ============================================================
 */
export default function RingInterface() {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [canRenderCanvas, setCanRenderCanvas] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [isLoading, setIsLoading] = useState(!globalInitialized)
  const [isMobile, setIsMobile] = useState(false)

  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  // 移动端返回时的快速过渡状态
  const [isReturning, setIsReturning] = useState(globalInitialized)

  // 获取初始旋转偏移
  const getInitialOffset = (mobile) =>
    mobile ? RING_PARAMS.mobile.ring.initialOffset : RING_PARAMS.desktop.ring.initialOffset

  const targetRotation = useRef(getInitialOffset(false))
  const mousePos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)
  const lastTouchX = useRef(0)

  /**
   * 移动端检测
   * 根据屏幕宽度判断设备类型，并切换对应的参数配置
   */
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < CONFIG.BREAKPOINT
      setIsMobile(mobile)
      if (mobile) {
        targetRotation.current = RING_PARAMS.mobile.ring.initialOffset
        // 移动端禁止 body 滚动
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.height = '100%'
      } else {
        // 桌面端恢复正常
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.height = ''
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      // 清理：恢复 body 样式
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

  /**
   * 处理 CLOU 风格选中更新（从 SceneContent 回调）
   * 移动端使用：当焦点项目变化时更新预览区域
   */
  const handleFocusUpdate = (_index, project) => {
    if (project && project !== activeProject) {
      setActiveProject(project)
    }
  }

  /**
   * 初始化和入场动画
   */
  useEffect(() => {
    setHasMounted(true)

    const timer = setTimeout(() => {
      setCanRenderCanvas(true)
      if (!globalInitialized) {
        // 首次加载：显示加载动画后旋转
        setTimeout(() => {
          setIsLoading(false)
          targetRotation.current += CONFIG.INTRO.SPIN_KICK
          globalInitialized = true
          lastSpinTimestamp = Date.now()
        }, 2500)
      } else {
        // 返回页面：显示快速过渡后旋转
        setTimeout(() => {
          setIsReturning(false) // 隐藏返回过渡层
          targetRotation.current += CONFIG.INTRO.SPIN_KICK
          lastSpinTimestamp = Date.now()
        }, 400) // 400ms 的过渡时间
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  /**
   * 监听页面可见性变化 - 确保从其他页面返回时触发旋转
   * 这可以捕获浏览器后退/前进按钮的情况
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && globalInitialized) {
        const now = Date.now()
        // 如果距离上次旋转超过1秒，触发新的旋转
        if (now - lastSpinTimestamp > 1000) {
          targetRotation.current += CONFIG.INTRO.SPIN_KICK
          lastSpinTimestamp = now
        }
      }
    }

    // 监听 popstate 事件（浏览器后退/前进）
    const handlePopState = () => {
      if (globalInitialized) {
        const now = Date.now()
        if (now - lastSpinTimestamp > 500) {
          setTimeout(() => {
            targetRotation.current += CONFIG.INTRO.SPIN_KICK
            lastSpinTimestamp = Date.now()
          }, 200)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  /**
   * 事件监听器设置
   * - 移动端：触摸事件（滑动旋转）
   * - 桌面端：鼠标 + 滚轮事件
   */
  useEffect(() => {
    if (!hasMounted) return

    // 获取当前设备的交互参数
    const params = isMobile ? RING_PARAMS.mobile : RING_PARAMS.desktop

    // --- 桌面端专用事件 ---
    const hMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1
      if (isDragging.current && !isTransitioning) {
        targetRotation.current += (e.clientX - lastMouseX.current) * params.interaction.dragSpeed
        lastMouseX.current = e.clientX
      }
    }
    const hWheel = (e) => {
      if (!isTransitioning) {
        targetRotation.current -= e.deltaY * params.interaction.wheelSpeed
      }
    }
    const hDown = (e) => {
      if (!isTransitioning) {
        isDragging.current = true
        lastMouseX.current = e.clientX
      }
    }
    const hUp = () => {
      isDragging.current = false
    }

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
        targetRotation.current += (touchX - lastTouchX.current) * params.interaction.dragSpeed
        lastTouchX.current = touchX
      }
    }
    const hTouchEnd = () => {
      isDragging.current = false
    }

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

  /**
   * 导航处理：触发转场动画并跳转到项目详情页
   */
  const handleNavigate = (id) => {
    setIsTransitioning(true)

    // 预加载目标项目的图片资源
    const targetProject = projects.find(p => p.id === id)
    if (targetProject) {
      const imagesToPreload = [targetProject.mainImage]
      if (targetProject.content) {
        const contentImages = targetProject.content
          .filter(block => block.type === 'imageGrid')
          .flatMap(block => block.images)
          .slice(0, 4)
        imagesToPreload.push(...contentImages)
      }
      imagesToPreload.forEach(src => {
        const img = new window.Image()
        img.src = src
      })
    }

    setTimeout(() => setShowOverlay(true), CONFIG.TRANSITION.OVERLAY_DELAY)
    setTimeout(() => router.push(`/project/${id}`), CONFIG.TRANSITION.NAVIGATE_DELAY)
  }

  /**
   * 获取加载动画标题文字
   */
  const getLoaderTitle = () => {
    if (!activeProject) return ""
    return Array.isArray(activeProject.title) ? activeProject.title.join(' ') : activeProject.title
  }

  // 获取当前设备的参数配置
  const params = isMobile ? RING_PARAMS.mobile : RING_PARAMS.desktop

  return (
    <div className={`main-wrapper ${isTransitioning ? 'is-blurring' : ''} ${isMobile ? 'is-mobile' : ''}`}>

      {/* 初始加载动画 */}
      {isLoading && (
        <div className="initial-loader">
          <div className="wipe-text">INITIALIZING DATA</div>
          <div className="loading-bar-container">
            <div className="loading-bar-fill" />
          </div>
        </div>
      )}

      {/* 移动端返回时的快速过渡 */}
      {isReturning && !isLoading && (
        <div className="return-transition">
          <div className="return-loader" />
        </div>
      )}

      {/* 转场遮罩层：项目标题逐字动画 */}
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

      {/* 移动端预览区域（导航栏由 layout.js 提供） */}
      {isMobile && !isLoading && !isTransitioning && canRenderCanvas && (
        <MobilePreview
          activeProject={activeProject}
          onNavigate={handleNavigate}
          isTransitioning={isTransitioning}
        />
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
              ? [
                  params.camera.position[0],
                  params.camera.position[1],
                  globalInitialized ? params.camera.position[2] : CONFIG.INTRO.CAMERA_START_Z
                ]
              : [0, 22, globalInitialized ? 45 : CONFIG.INTRO.CAMERA_START_Z],
            fov: params.camera.fov
          }}
          className="ring-canvas"
          /**
           * WebGL 性能优化配置
           * - powerPreference: 优先使用高性能 GPU
           * - antialias: 移动端关闭抗锯齿以提升性能
           * - alpha: 禁用透明背景
           * - stencil: 禁用模板缓冲
           * - depth: 启用深度缓冲
           */
          gl={{
            powerPreference: "high-performance",
            antialias: !isMobile,  // 移动端关闭抗锯齿
            alpha: false,
            stencil: false,
            depth: true,
          }}
          // 移动端限制像素比以提升性能
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          // 性能模式
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={3} />
          <SceneContent
            targetRotation={targetRotation}
            setActiveProject={setActiveProject}
            activeProject={activeProject}
            onNavigate={handleNavigate}
            isTransitioning={isTransitioning}
            introActive={!isLoading}
            mousePos={mousePos}
            isMobile={isMobile}
            onFocusUpdate={handleFocusUpdate}
          />
        </Canvas>
      )}

      {/* ============================================================
          样式定义
          使用 RING_PARAMS 中的配置值确保一致性
          ============================================================ */}
      <style jsx global>{`
        /* ============================================ */
        /* 基础布局 */
        /* ============================================ */
        .main-wrapper {
          width: 100vw;
          height: 100vh;
          background: #000;
          cursor: grab;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, sans-serif;
        }

        .main-wrapper.is-mobile {
          display: flex;
          flex-direction: column;
        }

        .ring-canvas {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* 移动端 Canvas 只占底部区域 */
        .is-mobile .ring-canvas {
          top: auto !important;
          bottom: 0 !important;
          height: ${RING_PARAMS.mobile.layout.ringHeight} !important;
        }

        /* ============================================ */
        /* 转场动画样式 */
        /* ============================================ */
        .is-blurring canvas {
          filter: blur(${CONFIG.TRANSITION.BLUR_STRENGTH});
          transition: filter 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .clou-loader-overlay {
          position: absolute;
          inset: 0;
          z-index: 600;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: overlayFadeIn ${CONFIG.TRANSITION.FADE_TIME} ease forwards;
          /* 防止文字溢出 */
          padding: 20px;
          box-sizing: border-box;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* 字母容器 - 允许换行 */
        .letter-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          max-width: 90vw;
          text-align: center;
        }

        .stagger-letter {
          color: white;
          /* 使用 clamp 确保字体大小在合理范围内 */
          font-size: clamp(1.5rem, 5vw, 4rem);
          font-weight: 900;
          text-transform: uppercase;
          display: inline-block;
          opacity: 0;
          animation: letterUp ease forwards;
        }

        @keyframes letterUp {
          from { opacity: 0; transform: translateY(50%); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ============================================ */
        /* 初始加载动画 - 解耦文字和进度条 */
        /* ============================================ */
        .initial-loader {
          position: absolute;
          inset: 0;
          z-index: 500;
          background: black;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* 文字动画 - 使用 transform 实现 GPU 加速 */
        .wipe-text {
          color: white;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.8em;
          position: relative;
          overflow: hidden;
          /* GPU 加速层 */
          will-change: transform;
          transform: translateZ(0);
        }

        .wipe-text::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          /* 独立的 GPU 加速层 - 与进度条完全解耦 */
          will-change: transform;
          transform: translateX(0);
          animation: textWipeMask 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.5s;
        }

        @keyframes textWipeMask {
          0% { transform: translateX(0); }
          100% { transform: translateX(101%); }
        }

        /* 进度条容器 - 独立的动画层 */
        .loading-bar-container {
          width: 120px;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin-top: 24px;
          overflow: hidden;
          position: relative;
          /* 独立的 GPU 加速层 */
          will-change: transform;
          transform: translateZ(0);
        }

        /* 进度条填充 - 使用 transform 实现平滑动画 */
        .loading-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 100%;
          background: white;
          /* 独立的 GPU 加速层 - 与文字动画完全解耦 */
          will-change: transform;
          animation: barSlideSmooth 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes barSlideSmooth {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        /* ============================================ */
        /* 返回页面过渡动画 - 移动端优化 */
        /* ============================================ */
        .return-transition {
          position: absolute;
          inset: 0;
          z-index: 450;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: returnFadeOut 0.4s ease-out forwards;
        }

        .return-loader {
          width: 40px;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 1px;
          overflow: hidden;
          position: relative;
        }

        .return-loader::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: white;
          animation: returnLoaderSlide 0.6s ease-in-out infinite;
        }

        @keyframes returnFadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }

        @keyframes returnLoaderSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        /* ============================================ */
        /* 桌面端标题 */
        /* ============================================ */
        .home-title-wrapper {
          position: absolute;
          bottom: 40px;
          left: 40px;
          z-index: 10;
          pointer-events: none;
          color: white;
        }

        .home-title-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 3rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: -2px;
          line-height: 1;
          opacity: 0;
          animation: revealTitle 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s;
        }

        @keyframes revealTitle {
          0% { opacity: 0; clip-path: inset(0 100% 0 0); transform: translateX(-20px); }
          100% { opacity: 1; clip-path: inset(0 0 0 0); transform: translateX(0); }
        }

        /* ============================================ */
        /* 移动端预览区域样式 */
        /* ============================================ */
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .mobile-preview {
          height: ${RING_PARAMS.mobile.layout.previewHeight};
          padding: ${RING_PARAMS.mobile.preview.padding};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          cursor: pointer;
          margin-top: ${RING_PARAMS.mobile.layout.headerHeight};
        }

        .mobile-preview-image {
          width: 100%;
          max-width: ${RING_PARAMS.mobile.preview.maxWidth}px;
          aspect-ratio: ${RING_PARAMS.mobile.preview.aspectRatio};
          border-radius: ${RING_PARAMS.mobile.preview.borderRadius}px;
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
          font-size: ${RING_PARAMS.mobile.preview.titleSize};
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-top: ${RING_PARAMS.mobile.preview.titleMargin}px;
          text-align: center;
          opacity: 0;
          animation: fadeIn 0.4s ease forwards 0.2s;
        }

        /* 移动端触摸区域设置 - 禁止整页滚动 */
        .is-mobile {
          touch-action: none;  /* 禁止所有触摸滚动 */
          cursor: default;
          overflow: hidden;    /* 防止任何溢出滚动 */
          position: fixed;     /* 固定定位防止页面移动 */
          inset: 0;
        }

        .is-mobile .ring-canvas {
          touch-action: none;
        }

        /* 移动端预览区域也禁止滚动 */
        .is-mobile .mobile-preview {
          touch-action: none;
          overflow: hidden;
        }

        /* ============================================ */
        /* 响应式断点 */
        /* ============================================ */
        @media (max-width: ${CONFIG.BREAKPOINT}px) {
          .stagger-letter {
            /* 移动端使用更小的字体，确保长标题不溢出 */
            font-size: clamp(1rem, 6vw, 2rem);
          }
          .letter-wrapper {
            max-width: 95vw;
            line-height: 1.2;
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
