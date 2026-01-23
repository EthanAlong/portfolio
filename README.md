# EthanDigital Portfolio 2026

![Project Banner](public/og-image.png)

**An immersive, 3D interactive portfolio website.**

Combining the high-performance rendering capabilities of **React Three Fiber** with the server-side advantages of **Next.js**, this project delivers a digital experience characterized by spatial depth, parallax effects, and seamless cinematic transitions.

> **Documentation**: [中文文档](./DOCUMENTATION_CN.md)
> **Documentation**: [English Documentation](./DOCUMENTATION_ENG.md)

---

## ✨ Key Features

### 🌌 3D Ring Navigation System
- Custom circular layout algorithm based on trigonometric functions
- Physics-based inertial scrolling with mouse dragging and wheel interaction
- **Dynamic Mouse Parallax Tilt**: Simulates real-world depth within the 3D space
- **CLOU-style Mobile Experience**: Touch-swipe navigation with left-side popup selection

### 🕸️ Native Particle Data Network
- **Zero External Dependencies**: Custom implementation using native Three.js `BufferGeometry`
- **High-Performance Rendering**: 150+ particles with dynamic connections in a single draw call
- **Interactive Dynamics**: Slowly orbiting motion, breathing connection lines, and mouse-influence parallax

### 🚀 Seamless Cinematic Transitions
- **"Spin & Expand" Effect**: Ring accelerates and expands outward upon project selection
- **Staggered Letter Animation**: Project title appears letter-by-letter during transition
- **Smart Preloading**: Silently preloads project assets during transition phase

### 📱 Fully Responsive Design
- **Desktop**: Two-column layout with Lenis smooth scrolling
- **Mobile**: Single-column layout with native scrolling and touch-optimized interactions
- **Adaptive Navigation**: Context-aware navigation bar that adjusts per page/device

### 🎬 Rich Animation System
- **Loading Animation**: "INITIALIZING DATA" text wipe with independent progress bar (GPU-accelerated)
- **Scroll Reveal**: IntersectionObserver-based fade-in effects for content
- **Return Animation**: Ring spin animation when navigating back to home

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **3D Engine** | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) / [Three.js](https://threejs.org/) |
| **3D Utilities** | [@react-three/drei](https://github.com/pmndrs/drei) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + CSS Modules |
| **Smooth Scroll** | [Lenis](https://github.com/studio-freight/lenis) |
| **Animation** | R3F `useFrame` + CSS Keyframes + IntersectionObserver |

---

## ⚡️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio.git
cd portfolio

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── globals.css              # Global styles & CSS variables
│   ├── layout.js                # Root layout with global navigation
│   ├── page.js                  # Home page (Ring Interface)
│   ├── about/
│   │   └── page.js              # About page (responsive)
│   └── project/
│       └── [id]/
│           ├── page.js          # Project detail page (dynamic route)
│           └── project.module.css # Project & About page styles
├── components/
│   └── canvas/
│       └── RingInterface.js     # Core 3D component (1200+ lines)
└── data/
    └── projects.js              # Project data source
```

---

## 🎯 Core Components

### RingInterface.js
The heart of the portfolio - a 3D ring interface with:
- **RING_PARAMS**: Separated configuration for mobile/desktop
- **CONFIG**: Shared animation timing and breakpoints
- **DataNetwork**: Background particle system
- **ProjectItem**: Individual project cards on the ring
- **CentralDisplay**: Desktop hover preview
- **MobilePreview**: Mobile touch preview
- **SceneContent**: Core 3D scene logic

### layout.js
Global layout component managing:
- Navigation bar visibility per page/device
- Theme switching (white for home, black for project pages)
- Logo letter-by-letter animation
- About button with underline effect

### project/[id]/page.js
Dynamic project detail page with:
- Responsive two-column (desktop) / single-column (mobile) layout
- Lenis smooth scrolling (desktop only)
- Dynamic content blocks (text, images, videos, mixed grids)
- IntersectionObserver reveal animations

---

## 🎨 Design Philosophy

### Visual Language
- **Monochrome Aesthetic**: Grayscale images with hover color reveal
- **Typography**: Bold, uppercase headings with tight letter-spacing
- **Spacing**: Generous whitespace following the golden ratio (38.2% / 61.8%)

### Performance Optimization
- **GPU-Accelerated Animations**: Using `transform` and `will-change` for smooth animations
- **Decoupled Animations**: Loading text and progress bar run on separate GPU layers
- **Mobile Optimization**: Reduced particle count, disabled antialiasing, lower pixel ratio
- **Smart Preloading**: Project images preloaded during transition

---

## 📄 License

MIT © 2026 EthanDigital

---

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation (中文)**: [DOCUMENTATION_CN.md](./DOCUMENTATION_CN.md)
