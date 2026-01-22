# EthanDigital Portfolio 2026 - 项目文档

> 最后更新：2026年1月

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [目录结构](#3-目录结构)
4. [核心组件详解](#4-核心组件详解)
5. [配置参数说明](#5-配置参数说明)
6. [页面路由](#6-页面路由)
7. [样式系统](#7-样式系统)
8. [动画系统](#8-动画系统)
9. [响应式设计](#9-响应式设计)
10. [性能优化](#10-性能优化)
11. [开发指南](#11-开发指南)
12. [常见问题](#12-常见问题)

---

## 1. 项目概述

### 1.1 项目简介

EthanDigital Portfolio 是一个沉浸式的 3D 交互作品集网站。项目采用环形布局展示作品，结合粒子背景、视差效果和电影级转场动画，为访客提供独特的浏览体验。

### 1.2 核心特性

| 特性 | 描述 |
|------|------|
| 3D 环形导航 | 基于三角函数的环形布局，支持惯性滚动 |
| 粒子数据网络 | 原生 Three.js 实现的动态粒子背景 |
| 电影级转场 | 点击项目时的旋转加速、扩张、标题逐字显示效果 |
| 完全响应式 | 桌面端和移动端有不同的交互模式 |
| 曝光动画 | 基于滚动的内容淡入效果 |

### 1.3 设计理念

- **单色美学**：灰度图片，悬停时显示彩色
- **大胆排版**：粗体大写标题，紧凑的字间距
- **黄金比例**：左侧边栏 38.2%，右侧内容区 61.8%

---

## 2. 技术架构

### 2.1 技术栈

```
┌─────────────────────────────────────────────────────────┐
│                      前端框架                            │
│                    Next.js 15 (App Router)              │
├─────────────────────────────────────────────────────────┤
│         3D 渲染                    │      样式系统       │
│  React Three Fiber + Three.js     │  Tailwind + Modules │
├─────────────────────────────────────────────────────────┤
│                      动画系统                            │
│    R3F useFrame │ CSS Keyframes │ IntersectionObserver  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 依赖说明

| 包名 | 版本 | 用途 |
|------|------|------|
| next | 15.x | React 框架，提供路由和 SSR |
| react | 19.x | UI 库 |
| three | ^0.160 | 3D 渲染引擎 |
| @react-three/fiber | ^8.x | Three.js 的 React 渲染器 |
| @react-three/drei | ^9.x | R3F 工具库（Image, Text 等） |
| lenis | ^1.x | 平滑滚动库 |
| tailwindcss | ^3.x | 原子化 CSS 框架 |

---

## 3. 目录结构

```
portfolio/
├── public/                    # 静态资源
│   ├── projects/             # 项目图片
│   ├── qrcode-linkedin.png   # 社交二维码
│   └── og-image.png          # Open Graph 图片
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # 全局样式和 CSS 变量
│   │   ├── layout.js         # 根布局（全局导航栏）
│   │   ├── page.js           # 首页（Ring 界面入口）
│   │   │
│   │   ├── about/
│   │   │   └── page.js       # About 页面（响应式）
│   │   │
│   │   └── project/
│   │       └── [id]/
│   │           ├── page.js           # 项目详情页（动态路由）
│   │           └── project.module.css # 项目页样式
│   │
│   ├── components/
│   │   └── canvas/
│   │       └── RingInterface.js  # 核心 3D 组件（1300+ 行）
│   │
│   └── data/
│       └── projects.js       # 项目数据源
│
├── README.md                 # 英文说明
├── DOCUMENTATION_CN.md       # 中文文档（本文件）
└── package.json
```

---

## 4. 核心组件详解

### 4.1 RingInterface.js

这是整个网站的核心组件，包含 3D 环形界面的所有逻辑。

#### 文件结构

```javascript
// 全局状态变量
let globalInitialized = false;  // 防止重复加载动画
let lastSpinTimestamp = 0;      // 记录旋转时间戳

// 配置对象
const RING_PARAMS = { ... }     // 移动端/桌面端分离配置
const CONFIG = { ... }          // 通用配置

// 子组件
function DataNetwork() { ... }   // 粒子背景
function ProjectItem() { ... }   // 单个项目
function CentralDisplay() { ... } // 桌面端中央预览
function SceneContent() { ... }  // 3D 场景逻辑
function MobilePreview() { ... } // 移动端预览

// 主组件
export default function RingInterface() { ... }
```

#### 组件职责

| 组件 | 职责 |
|------|------|
| `DataNetwork` | 渲染背景粒子网络，支持呼吸灯效果和缓慢旋转 |
| `ProjectItem` | 单个项目图片，处理悬停/选中状态的缩放和位移 |
| `CentralDisplay` | 桌面端：悬停时在中央显示的大图预览 |
| `SceneContent` | 核心场景逻辑：相机控制、环形旋转、CLOU 风格选中算法 |
| `MobilePreview` | 移动端：HTML 层的预览图和标题 |
| `RingInterface` | 主入口：状态管理、事件监听、转场动画 |

### 4.2 layout.js

全局布局组件，管理导航栏的显示和主题切换。

#### 核心逻辑

```javascript
// 判断是否隐藏全局导航栏
const shouldHideGlobalNav = isMobile && (isProjectPage || isAboutPage)

// Logo 点击行为
onClick={(e) => {
  if (isHome) {
    e.preventDefault()
    window.location.reload()  // 首页点击刷新
  }
}}
```

#### 主题切换

| 页面 | 导航栏颜色 | 导航栏宽度 |
|------|------------|------------|
| 首页 (/) | 白色 | 100% |
| 项目页 (/project/*) | 黑色 | 38.2vw |
| About 页 (/about) | 黑色 | 38.2vw |

### 4.3 project/[id]/page.js

项目详情页，支持动态路由和响应式布局。

#### 内容类型

项目内容通过 `project.content` 数组定义，支持以下类型：

```javascript
// 文字模块
{ type: 'textBlock', title: '标题', text: '内容' }

// 图片网格
{ type: 'imageGrid', columns: 2, images: [...], labels: [...] }

// 视频嵌入
{ type: 'videoEmbed', src: '/path/to/video.mp4', columns: 1 }

// 混合网格
{ type: 'mixedGrid', items: [
  { type: 'image', src: '...' },
  { type: 'video', src: '...' }
]}
```

---

## 5. 配置参数说明

### 5.1 RING_PARAMS（环形参数）

位于 `RingInterface.js`，分为 `mobile` 和 `desktop` 两套配置。

#### 移动端配置

```javascript
mobile: {
  selection: {
    selectionOffset: 1.17,    // 弹出位置角度偏移
    snapThreshold: 0.005,     // 触发阈值（越小越精确）
    lerpSpeed: 0.12,          // 动画平滑速度
  },
  visuals: {
    selectedScale: 1.25,      // 选中时放大倍率
    selectedTranslateY: 1.75, // 选中时上浮高度
    unselectedOpacity: 0.6,   // 未选中透明度
  },
  ring: {
    radius: 16,               // 环形半径
    imageW: 6, imageH: 4,     // 图片尺寸
    initialOffset: Math.PI * 0.5,  // 初始角度
  },
  camera: {
    position: [0, 10, 35],    // 相机位置
    lookAt: [-15, -5, 0],     // 看向左侧
    fov: 50,                  // 视野角度
  },
  interaction: {
    dragSpeed: 0.028,         // 触摸灵敏度
    damping: 5,               // 惯性阻尼
  },
  layout: {
    headerHeight: '10vh',     // 导航栏高度
    previewHeight: '35vh',    // 预览区高度
    ringHeight: '55vh',       // Ring 区域高度
  },
}
```

#### 桌面端配置

```javascript
desktop: {
  ring: {
    radius: 20,               // 环形半径（比移动端大）
    hoverOut: 2.2,            // 悬停时弹出距离
  },
  camera: {
    position: [0, 22, 45],    // 俯视视角
    lookAt: [0, 0, 0],        // 看向中心
    fov: 60,
  },
  mouseTilt: {
    xIntensity: 0.04,         // 俯仰倾斜强度
    zIntensity: 0.15,         // 左右倾斜强度
    smoothing: 0.05,          // 平滑度
  },
  central: {
    imageW: 18, imageH: 12,   // 中央预览图尺寸
    yOffset: -5.5,            // Y 偏移
    zOffset: -5,              // Z 偏移
  },
}
```

### 5.2 CONFIG（通用配置）

```javascript
const CONFIG = {
  INTRO: {
    SPIN_KICK: Math.PI * 0.9,   // 入场旋转量
    CAMERA_START_Z: 70,         // 相机起始深度
    FADE_DURATION: 1.5,         // 黑场渐显时间
  },
  BREAKPOINT: 768,              // 移动端断点
  TRANSITION: {
    SPIN_ACCEL: 5.0,            // 转场旋转加速度
    EXPAND_SCALE: 2.5,          // 转场扩张倍数
    BLUR_STRENGTH: "30px",      // 转场模糊强度
    OVERLAY_DELAY: 800,         // 遮罩层延迟
    NAVIGATE_DELAY: 2500,       // 页面跳转延迟
    LETTER_ANIM_DURATION: "1s", // 字母动画时长
    LETTER_STAGGER: 0.04,       // 字母间隔
  },
}
```

---

## 6. 页面路由

### 6.1 路由表

| 路径 | 页面 | 描述 |
|------|------|------|
| `/` | 首页 | Ring 界面 |
| `/about` | About | 个人介绍 |
| `/project/[id]` | 项目详情 | 动态路由，id 为项目 ID |

### 6.2 导航流程

```
┌─────────┐     点击项目      ┌──────────────┐
│  Ring   │ ───────────────→ │ 转场动画     │
│  首页   │                   │ (2.5秒)      │
└─────────┘                   └──────┬───────┘
     ↑                               │
     │                               ↓
     │      点击 Logo/        ┌──────────────┐
     │      ALL PROJECTS      │ 项目详情页   │
     └────────────────────────│              │
                              └──────────────┘
```

---

## 7. 样式系统

### 7.1 CSS 变量

定义在 `globals.css`：

```css
:root {
  /* 字体 */
  --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* 颜色 */
  --color-bg: #ffffff;
  --color-fg: #000000;
  --color-accent: #666666;
  --color-border: #eeeeee;

  /* 导航栏 */
  --nav-height: 80px;
  --nav-height-mobile: 50px;

  /* 断点 */
  --breakpoint-mobile: 768px;

  /* 动画 */
  --transition-fast: 0.2s;
  --transition-normal: 0.4s;
  --transition-slow: 0.8s;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 7.2 CSS Modules

项目详情页样式位于 `project.module.css`，主要类：

| 类名 | 用途 |
|------|------|
| `.projectTheme` | 桌面端主题容器 |
| `.mobileTheme` | 移动端主题容器 |
| `.sidebar` | 左侧边栏 |
| `.viewport` | 右侧内容区 |
| `.revealItem` | 桌面端曝光动画元素 |
| `.mobileReveal` | 移动端曝光动画元素 |
| `.visible` / `.mobileVisible` | 已曝光状态 |

---

## 8. 动画系统

### 8.1 动画类型

| 类型 | 技术 | 用途 |
|------|------|------|
| 3D 动画 | R3F `useFrame` | 环形旋转、项目弹出、相机移动 |
| UI 动画 | CSS Keyframes | Logo 滑入、转场遮罩、字母弹出 |
| 曝光动画 | IntersectionObserver | 滚动触发的内容淡入 |
| 加载动画 | CSS Transform | 文字擦除、进度条滑动（GPU 加速） |

### 8.2 关键动画

#### 加载动画（解耦设计）

```css
/* 文字动画 - 独立 GPU 层 */
.wipe-text::after {
  will-change: transform;
  animation: textWipeMask 1.5s forwards;
}

/* 进度条动画 - 独立 GPU 层 */
.loading-bar-fill {
  will-change: transform;
  animation: barSlideSmooth 1.5s infinite;
}
```

#### 曝光动画

```css
/* 基础状态 */
.mobileReveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s, transform 0.8s;
}

/* 曝光后状态 */
.mobileReveal.mobileVisible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 9. 响应式设计

### 9.1 断点策略

```
┌──────────────────────────────────────────────────────┐
│                    768px                              │
│        移动端         │          桌面端               │
│   - 单列布局          │   - 两栏布局                  │
│   - 触摸交互          │   - 鼠标 + 滚轮交互           │
│   - 原生滚动          │   - Lenis 平滑滚动            │
│   - CLOU 风格选中     │   - Hover 选中               │
│   - HTML 预览区       │   - 3D 中央预览              │
└──────────────────────────────────────────────────────┘
```

### 9.2 导航栏适配

| 场景 | 导航栏显示 |
|------|------------|
| 桌面端所有页面 | 显示全局导航栏 |
| 移动端首页 | 显示全局导航栏 |
| 移动端项目页 | 隐藏全局导航栏，显示页面导航栏（带 Back 按钮） |
| 移动端 About 页 | 隐藏全局导航栏，显示页面导航栏 |

---

## 10. 性能优化

### 10.1 3D 性能优化

```javascript
// 移动端优化配置
<Canvas
  gl={{
    antialias: !isMobile,      // 移动端关闭抗锯齿
    powerPreference: "high-performance",
  }}
  dpr={isMobile ? [1, 1.5] : [1, 2]}  // 移动端降低像素比
  performance={{ min: 0.5 }}
>
```

### 10.2 粒子系统优化

```javascript
// 移动端减少粒子数量
const particleCount = isMobile ? 60 : 150
const connectionDist = isMobile ? 30 : 35
```

### 10.3 动画性能优化

- **使用 `transform` 而非 `left/top`**：GPU 加速
- **使用 `will-change`**：提示浏览器优化
- **解耦动画**：加载文字和进度条在独立 GPU 层

### 10.4 预加载策略

```javascript
// 转场时预加载目标项目图片
const imagesToPreload = [targetProject.mainImage]
imagesToPreload.forEach(src => {
  const img = new window.Image()
  img.src = src
})
```

---

## 11. 开发指南

### 11.1 添加新项目

1. 在 `public/projects/` 添加项目图片
2. 编辑 `src/data/projects.js`：

```javascript
{
  id: 'new-project',
  title: ['PROJECT', 'NAME'],  // 可以是数组（多行）或字符串
  ringImage: '/projects/new/ring.jpg',
  mainImage: '/projects/new/main.jpg',
  description: '项目简介...',
  year: '2026',
  category: 'Architecture',
  location: 'Los Angeles',
  sector: 'Residential',
  status: 'Completed',
  scale: '50,000 SQFT',
  architect: 'Studio Name',
  contribution: 'Lead Designer',
  content: [
    { type: 'textBlock', title: 'CONCEPT', text: '...' },
    { type: 'imageGrid', columns: 2, images: [...] },
  ]
}
```

### 11.2 修改环形参数

编辑 `RingInterface.js` 中的 `RING_PARAMS`：

```javascript
// 调整移动端弹出位置
mobile.selection.selectionOffset = 1.2  // 增加 = 向右移动

// 调整桌面端环形大小
desktop.ring.radius = 25  // 增加 = 环更大
```

### 11.3 修改转场时间

编辑 `RingInterface.js` 中的 `CONFIG.TRANSITION`：

```javascript
OVERLAY_DELAY: 800,    // 遮罩出现延迟
NAVIGATE_DELAY: 2500,  // 页面跳转延迟（总时长）
```

---

## 12. 常见问题

### Q1: 移动端 Ring 页面可以上下滚动？

**原因**：触摸事件没有正确阻止默认行为。

**解决**：检查 `RingInterface.js` 中的样式：
```css
.is-mobile {
  touch-action: none;
  overflow: hidden;
  position: fixed;
}
```

### Q2: 桌面端返回首页时 Ring 不旋转？

**原因**：Next.js 可能缓存了组件状态。

**解决**：已添加 `popstate` 和 `visibilitychange` 监听器来确保旋转触发。

### Q3: 加载动画卡顿？

**原因**：文字和进度条动画可能在同一 GPU 层。

**解决**：已使用 `will-change` 和 `transform: translateZ(0)` 将动画解耦到独立 GPU 层。

### Q4: 项目导航按钮文字被截断？

**原因**：`title` 是数组时只取了第一个元素。

**解决**：已修改为 `title.join(' ')` 显示完整标题。

---

## 附录：快速参考

### 文件入口

| 功能 | 文件路径 |
|------|----------|
| 3D 环形界面 | `src/components/canvas/RingInterface.js` |
| 全局导航栏 | `src/app/layout.js` |
| 项目详情页 | `src/app/project/[id]/page.js` |
| About 页面 | `src/app/about/page.js` |
| 项目数据 | `src/data/projects.js` |
| 全局样式 | `src/app/globals.css` |
| 页面样式 | `src/app/project/[id]/project.module.css` |

### 常用命令

```bash
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # 代码检查
```

---

**文档结束**

MIT © 2026 EthanDigital
