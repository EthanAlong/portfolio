# Mobile Version 重构计划文档 (v3.0 - Developer Optimized)

---

## 一、代码架构与维护策略 (Code Architecture)

为了方便后续维护并确保网页端（Desktop）与移动端（Mobile）互不干扰，我们将采取**"逻辑共用，参数分离"**的策略。

### 1.1 分离式配置对象

在 `RingInterface.js` 中，不再混合参数，而是通过一个嵌套对象清晰地区分两端配置。

```javascript
/**
 * 集中化配置控制台 (Code-only)
 * 修改此对象即可分别调整两端表现，无需修改核心逻辑代码
 */
const RING_PARAMS = {
  mobile: {
    selection: {
      selectionOffset: -1.57, // CLOU Style: 锁定左侧弹出
      snapThreshold: 0.25,
      lerpSpeed: 0.12,
    },
    visuals: {
      selectedScale: 1.15,
      selectedTranslateY: 1.2,
      unselectedOpacity: 0.3,
    }
  },
  desktop: {
    selection: {
      selectionOffset: 0,      // Web端通常保持居中或跟随鼠标
      snapThreshold: 0.15,
      lerpSpeed: 0.08,
    },
    visuals: {
      selectedScale: 1.08,
      selectedTranslateY: 0.5,
      unselectedOpacity: 1.0,
    }
  }
};
```

### 1.2 动态参数注入

利用自定义 Hook（如 `useDeviceType`）在运行时自动选择对应的参数集，避免在主逻辑中写大量的 `if/else`。

```javascript
// 示例：动态获取当前设备参数
const params = isMobile ? RING_PARAMS.mobile : RING_PARAMS.desktop;
const { selectionOffset, snapThreshold, lerpSpeed } = params.selection;
```

---

## 二、目标 1: CLOU 风格 Ring 逻辑重构

### 2.1 左侧弹出算法

针对移动端手势滚动的特性，通过弧度差值计算实现"始终在最左侧触发"。

**核心公式：**

设环形总旋转为 θ_total，项目索引角度为 θ_i，移动端偏移量为 offset_mob。

激活判断值 V_focus 计算如下：

```
V_focus = cos(θ_i + θ_total + offset_mob)
```

当 `V_focus → 1` 时，项目进入激活状态。

### 2.2 实现代码参考

```javascript
/**
 * 每一帧更新项目的弹出状态
 *
 * 算法说明：
 * 1. 计算每个项目在环上的静态角度位置
 * 2. 加上环形当前旋转量和预设的左侧偏移量
 * 3. 通过余弦值判断是否进入激活区域
 * 4. 余弦值趋近于 1 = 项目正好在"左侧弹出点"
 *
 * @param {Number} ringRotation - 环形当前的全局旋转角度
 * @param {Array} projects - 项目 Mesh 数组
 */
const updateProjectFocus = (ringRotation, projects) => {
  // 此处 selectionOffset 用于模拟 CLOU 官网的最左侧弹出逻辑
  const params = isMobile ? RING_PARAMS.mobile : RING_PARAMS.desktop;
  const { selectionOffset, snapThreshold, lerpSpeed } = params.selection;
  const { selectedScale, selectedTranslateY, unselectedOpacity } = params.visuals;

  const anglePerItem = (Math.PI * 2) / projects.length;

  projects.forEach((item, index) => {
    // 1. 计算项目在环上的静态角度
    const itemAngle = index * anglePerItem;

    // 2. 计算当前实际位置 = 初始角度 + 环形旋转量 + 左侧偏移量
    const currentAngle = (itemAngle + ringRotation + selectionOffset) % (Math.PI * 2);

    // 3. 计算激活强度：余弦值趋近 1 表示在目标位置
    const focusStrength = Math.cos(currentAngle);

    // 4. 判断是否激活弹出（阈值判断）
    const isFocused = focusStrength > (1 - snapThreshold);

    if (isFocused) {
      // 执行弹出逻辑：放大并上浮
      item.targetScale = selectedScale;
      item.targetY = selectedTranslateY;
    } else {
      // 恢复原始状态
      item.targetScale = 1.0;
      item.targetY = 0;
    }
  });
};
```

---

## 三、目标 2: 加载界面逻辑优化 (Loading Logic)

移动端用户对加载时间的容忍度较低，且硬件性能差异大。

### 3.1 分级加载策略

| 优化项 | 逻辑调整 | 目的 |
|--------|----------|------|
| 资产预加载 | 移动端仅预加载当前视口可见的前 5 个项目贴图 | 减少初始白屏时间 |
| 3D 实例化 | 移动端开启 `powerPreference: "high-performance"` | 提升顺滑度，减少掉帧 |
| 交互前置 | 允许用户在 3D 模型完全加载前看到标题层 | 降低流失率 |

### 3.2 移动端专用 Loading UI

**骨架屏 (Skeleton Screens)：**
- 在详情页内容加载时，使用灰度色块模拟 Metadata 两列布局
- 保持视觉稳定，减少布局抖动

**平滑过渡：**
- Loading 结束时，使用 `opacity` 渐变而非硬切
- 掩盖移动端资源渲染瞬间的卡顿

---

## 四、目标 3: Layout 导航栏动效

### 4.1 Logo 动效

| 触发时机 | 动效描述 |
|----------|----------|
| 页面加载 | 字母逐个从下方滑入 + 淡入（stagger: 0.05s） |
| 悬停 | 字母轻微波浪起伏效果 |
| 点击 | 整体轻微缩放反馈（scale: 0.95 → 1.0） |

### 4.2 About 按钮动效

| 触发时机 | 动效描述 |
|----------|----------|
| 页面加载 | 从右侧滑入 + 淡入（delay: 0.3s after logo） |
| 悬停 | 下划线从左向右展开 |
| 点击 | 文字颜色渐变反馈 |

### 4.3 技术方案

- 使用纯 CSS `@keyframes` 实现基础动画
- Logo 字母效果通过 `<span>` 包裹每个字符实现
- 保持轻量，不引入额外动画库

---

## 五、目标 4: Mobile 项目详情页布局重构

### 5.1 布局架构

**固定导航栏 (Sticky Header)：**
- 包含 **EthanDigital Logo** 和 **返回按钮（← Back）**
- 背景使用毛玻璃效果 (`backdrop-filter`)

**Hero Media 区域：**
- 宽度: `100vw`（全宽显示）
- 高度: `50vh` 或 `aspect-ratio: 16/10`

**Metadata 区域：**
- 2列 Grid 布局，紧凑专业

### 5.2 布局对比

**Web 端（保持不变）**
```
┌──────────────────┬───────────────────────────────────┐
│    SIDEBAR       │         VIEWPORT                  │
│    38.2vw        │         61.8vw                    │
│  - Project Title │    - Text Blocks                  │
│  - Metadata      │    - Image Grids                  │
│                  │    - Video Embeds                 │
└──────────────────┴───────────────────────────────────┘
```

**Mobile 端（新布局）**
```
┌─────────────────────────────────────┐
│  ← Back          EthanDigital       │  ← 固定导航栏
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │      Hero Image / Video     │   │  ← 100vw, 50vh
│  └─────────────────────────────┘   │
│  PROJECT TITLE                      │
│  ─────────────────────────────────  │
│  Year: 2024        Category: XXX   │  ← 2列 Grid
│  Location: XXX     Sector: XXX     │
│  ─────────────────────────────────  │
│  BRIEFING                           │
│  Lorem ipsum dolor sit amet...      │
│  ─────────────────────────────────  │
│  [Content Blocks...]                │
│  ─────────────────────────────────  │
│  ← Previous    Next →               │  ← 项目导航
└─────────────────────────────────────┘
        ↕ 整页自然滚动
```

---

## 六、CSS 与代码结构现代化 (Refactoring)

为了提高维护性，建议将零散的 `project.module.css` 逻辑向 **Tailwind CSS + CSS Variables** 转型。

### 6.1 全局变量 (Global CSS)

在 `globals.css` 中定义交互相关的变量，方便在 JS 配置和 CSS 中同步。

```css
:root {
  --ring-selected-up: 1.5rem;
  --ring-transition-speed: 300ms;
  --nav-height: 60px;
  --mobile-nav-height: 50px;
}

/* 移动端特定变量覆盖 */
@media (max-width: 768px) {
  :root {
    --ring-selected-up: 1.2rem;
    --nav-height: var(--mobile-nav-height);
  }
}
```

### 6.2 Tailwind 布局重写

利用 Tailwind 的响应式前缀（`md:`, `lg:`）重构详情页，彻底抛弃繁琐的媒体查询代码块。

```jsx
// 详情页 Metadata 部分重构示例
<div className="grid grid-cols-2 gap-4 p-4 border-t border-gray-200
               md:flex md:flex-col md:border-none">
  <div className="text-sm font-medium">Year: {project.year}</div>
  <div className="text-sm font-medium">Location: {project.location}</div>
  {/* ... */}
</div>
```

### 6.3 CSS 文件职责划分

| 文件 | 职责 | 维护频率 |
|------|------|----------|
| `globals.css` | CSS 变量、字体、基础 reset | 低 |
| Tailwind classes | 90% 布局与响应式 | 高（直接在 JSX 中修改） |
| `project.module.css` | 仅保留 3D 混合效果、复杂动画 | 中 |

---

## 七、验收标准 Checklist

### 目标 1: CLOU 风格 Ring 交互
- [ ] 项目仅在滚动至屏幕左侧指定区域时触发弹出
- [ ] 零 UI 侵入：一切通过修改 `RING_PARAMS` 实现
- [ ] 弹出/收回动效平滑自然
- [ ] 角度计算代码配有中文逻辑注释

### 目标 2: 加载优化
- [ ] 移动端加载资源体积控制在 Web 端的 60% 以内
- [ ] 骨架屏在详情页正常显示
- [ ] Loading 过渡平滑无硬切

### 目标 3: Layout 导航栏动效
- [ ] Logo 加载动画：字母逐个滑入
- [ ] About 按钮 hover 下划线展开
- [ ] 路由切换颜色过渡平滑

### 目标 4: Mobile 详情页
- [ ] 768px 以下转为单列布局
- [ ] Metadata 两列 Grid 显示正常
- [ ] Hero 区域全宽显示
- [ ] 返回按钮和项目导航功能正常

### 代码维护性
- [ ] `RING_PARAMS` 中 mobile/desktop 参数完全解耦
- [ ] 90% 布局使用 Tailwind 处理
- [ ] `project.module.css` 仅保留特殊效果

---

## 八、实施顺序

1. **第一阶段**: Ring CLOU 风格交互
   - 实现 `RING_PARAMS` 分离式配置
   - 实现角度匹配弹出逻辑
   - 调试 `selectionOffset` 至最佳位置

2. **第二阶段**: Mobile 项目详情页重构
   - Tailwind 布局重写
   - 单列垂直流式布局
   - 返回按钮与项目导航

3. **第三阶段**: 加载优化
   - 骨架屏实现
   - 分级资产加载

4. **第四阶段**: Layout 导航栏动效
   - Logo 字母动画
   - About 按钮交互

---

## 九、维护指南 (Quick Reference)

| 想要调整... | 修改位置 |
|-------------|----------|
| 移动端跳出位置 | `RING_PARAMS.mobile.selection.selectionOffset`（建议在 `-1.57` 附近微调） |
| 移动端放大倍数 | `RING_PARAMS.mobile.visuals.selectedScale` |
| 移动端详情页布局 | 直接修改 `page.js` 中的 Tailwind 类名 |
| 全局过渡速度 | `globals.css` 中的 `--ring-transition-speed` |
| 导航栏高度 | `globals.css` 中的 `--nav-height` |

---

## 十、涉及文件清单

| 文件路径 | 修改内容 |
|----------|----------|
| `src/components/canvas/RingInterface.js` | 新增 `RING_PARAMS`，重构选中逻辑 |
| `src/app/layout.js` | Logo/About 动效实现 |
| `src/app/globals.css` | CSS 变量定义 |
| `src/app/project/[id]/page.js` | Tailwind 布局重写，Mobile 条件渲染 |
| `src/app/project/[id]/project.module.css` | 精简为仅保留特殊效果 |

---

*文档版本: v3.0 - Developer Optimized*
*创建日期: 2026-01-22*
*分支: mobile-test*
