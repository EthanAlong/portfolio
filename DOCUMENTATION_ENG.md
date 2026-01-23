# EthanDigital Portfolio 2026 - Project Documentation

> Last Updated: January 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [Directory Structure](#3-directory-structure)
4. [Core Components Detail](#4-core-components-detail)
5. [Configuration Parameters](#5-configuration-parameters)
6. [Page Routing](#6-page-routing)
7. [Styling System](#7-styling-system)
8. [Animation System](#8-animation-system)
9. [Responsive Design](#9-responsive-design)
10. [Performance Optimization](#10-performance-optimization)
11. [Development Guide](#11-development-guide)
12. [FAQ](#12-faq)

---

## 1. Project Overview

### 1.1 Introduction

EthanDigital Portfolio is an immersive 3D interactive portfolio website. The project uses a ring layout to showcase works, combined with particle backgrounds, parallax effects, and cinematic transition animations, providing visitors with a unique browsing experience.

### 1.2 Core Features

| Feature | Description |
|---------|-------------|
| 3D Ring Navigation | Ring layout based on trigonometric functions, supporting inertial scrolling |
| Particle Data Network | Dynamic particle background implemented with native Three.js |
| Cinematic Transitions | Rotation acceleration, expansion, and letter-by-letter title display effects when clicking projects |
| Fully Responsive | Different interaction modes for desktop and mobile |
| Reveal Animations | Scroll-based content fade-in effects |

### 1.3 Design Philosophy

- **Monochrome Aesthetic**: Grayscale images, displaying color on hover
- **Bold Typography**: Bold uppercase titles, tight letter spacing
- **Golden Ratio**: Left sidebar 38.2%, right content area 61.8%

---

## 2. Technical Architecture

### 2.1 Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Framework                     │
│                    Next.js 15 (App Router)              │
├─────────────────────────────────────────────────────────┤
│         3D Rendering               │      Styling System       │
│  React Three Fiber + Three.js     │  Tailwind + Modules │
├─────────────────────────────────────────────────────────┤
│                      Animation System                           │
│    R3F useFrame │ CSS Keyframes │ IntersectionObserver  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Dependencies

| Package | Version | Purpose |
|------|------|------|
| next | 15.x | React framework, provides routing and SSR |
| react | 19.x | UI Library |
| three | ^0.160 | 3D Rendering Engine |
| @react-three/fiber | ^8.x | React renderer for Three.js |
| @react-three/drei | ^9.x | R3F utility library (Image, Text, etc.) |
| lenis | ^1.x | Smooth scrolling library |
| tailwindcss | ^3.x | Atomic CSS framework |

---

## 3. Directory Structure

```
portfolio/
├── public/                    # Static Assets
│   ├── projects/             # Project Images
│   ├── qrcode-linkedin.png   # Social QR Code
│   └── og-image.png          # Open Graph Image
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Global styles and CSS variables
│   │   ├── layout.js         # Root layout (global navigation bar)
│   │   ├── page.js           # Home page (Ring interface entry point)
│   │   │
│   │   ├── about/
│   │   │   └── page.js       # About page (responsive)
│   │   │
│   │   └── project/
│   │       └── [id]/
│   │           ├── page.js           # Project detail page (dynamic routing)
│   │           └── project.module.css # Project page styles
│   │
│   ├── components/
│   │   └── canvas/
│   │       └── RingInterface.js  # Core 3D component (1300+ lines)
│   │
│   └── data/
│       └── projects.js       # Project data source
│
├── README.md                 # English documentation
├── DOCUMENTATION_CN.md       # Chinese documentation (this file)
└── package.json
```

---

## 4. Core Components Detail

### 4.1 RingInterface.js

This is the core component of the entire website, containing all the logic for the 3D ring interface.

#### File Structure

```javascript
// Global state variables
let globalInitialized = false;  // Prevent repeated loading animations
let lastSpinTimestamp = 0;      // Record rotation timestamp

// Configuration objects
const RING_PARAMS = { ... }     // Separate mobile/desktop configurations
const CONFIG = { ... }          // General configuration

// Subcomponents
function DataNetwork() { ... }   // Particle background
function ProjectItem() { ... }   // Single project item
function CentralDisplay() { ... } // Desktop central preview
function SceneContent() { ... }  // 3D scene logic
function MobilePreview() { ... } // Mobile preview

// Main component
export default function RingInterface() { ... }
```

#### Component Responsibilities

| Component | Responsibility |
|------|------|
| `DataNetwork` | Renders the background particle network, supports breathing light effect and slow rotation |
| `ProjectItem` | A single project image, handles scaling and displacement for hover/selected states |
| `CentralDisplay` | Desktop: Large image preview displayed in the center on hover |
| `SceneContent` | Core scene logic: camera control, ring rotation, CLOU-style selection algorithm |
| `MobilePreview` | Mobile: Preview image and title in the HTML layer |
| `RingInterface` | Main entry point: state management, event listeners, transition animations |

### 4.2 layout.js

Global layout component, manages the display of the navigation bar and theme switching.

#### Core Logic

```javascript
// Determine if the global navigation bar should be hidden
const shouldHideGlobalNav = isMobile && (isProjectPage || isAboutPage)

// Logo click behavior
onClick={(e) => {
  if (isHome) {
    e.preventDefault()
    window.location.reload()  // Refresh on homepage click
  }
}}
```

#### Theme Switching

| Page | Navigation Bar Color | Navigation Bar Width |
|------|------------|------------|
| Home (/) | White | 100% |
| Project Page (/project/*) | Black | 38.2vw |
| About Page (/about) | Black | 38.2vw |

### 4.3 project/[id]/page.js

Project detail page, supports dynamic routing and responsive layout.

#### Content Types

Project content is defined through the `project.content` array, supporting the following types:

```javascript
// Text Block
{ type: 'textBlock', title: 'Title', text: 'Content' }

// Image Grid
{ type: 'imageGrid', columns: 2, images: [...], labels: [...] }

// Video Embed
{ type: 'videoEmbed', src: '/path/to/video.mp4', columns: 1 }

// Mixed Grid
{ type: 'mixedGrid', items: [
  { type: 'image', src: '...' },
  { type: 'video', src: '...' }
]}
```

---

## 5. Configuration Parameters

### 5.1 RING_PARAMS (Ring Parameters)

Located in `RingInterface.js`, divided into `mobile` and `desktop` configurations.

#### Mobile Configuration

```javascript
mobile: {
  selection: {
    selectionOffset: 1.17,    // Popup position angle offset
    snapThreshold: 0.005,     // Trigger threshold (smaller is more precise)
    lerpSpeed: 0.12,          // Animation smoothing speed
  },
  visuals: {
    selectedScale: 1.25,      // Magnification on selection
    selectedTranslateY: 1.75, // Floating height on selection
    unselectedOpacity: 0.6,   // Opacity when not selected
  },
  ring: {
    radius: 16,               // Ring radius
    imageW: 6, imageH: 4,     // Image dimensions
    initialOffset: Math.PI * 0.5,  // Initial angle
  },
  camera: {
    position: [0, 10, 35],    // Camera position
    lookAt: [-15, -5, 0],     // Look at left side
    fov: 50,                  // Field of view
  },
  interaction: {
    dragSpeed: 0.028,         // Touch sensitivity
    damping: 5,               // Inertial damping
  },
  layout: {
    headerHeight: '10vh',     // Navigation bar height
    previewHeight: '35vh',    // Preview area height
    ringHeight: '55vh',       // Ring area height
  },
}
```

#### Desktop Configuration

```javascript
desktop: {
  ring: {
    radius: 20,               // Ring radius (larger than mobile)
    hoverOut: 2.2,            // Popup distance on hover
  },
  camera: {
    position: [0, 22, 45],    // Top-down view
    lookAt: [0, 0, 0],        // Look at center
    fov: 60,
  },
  mouseTilt: {
    xIntensity: 0.04,         // Pitch tilt intensity
    zIntensity: 0.15,         // Left-right tilt intensity
    smoothing: 0.05,          // Smoothing
  },
  central: {
    imageW: 18, imageH: 12,   // Central preview image dimensions
    yOffset: -5.5,            // Y offset
    zOffset: -5,              // Z offset
  },
}
```

### 5.2 CONFIG (General Configuration)

```javascript
const CONFIG = {
  INTRO: {
    SPIN_KICK: Math.PI * 0.9,   // Entry rotation amount
    CAMERA_START_Z: 70,         // Camera starting depth
    FADE_DURATION: 1.5,         // Fade-in time from black
  },
  BREAKPOINT: 768,              // Mobile breakpoint
  TRANSITION: {
    SPIN_ACCEL: 5.0,            // Transition rotation acceleration
    EXPAND_SCALE: 2.5,          // Transition expansion scale
    BLUR_STRENGTH: "30px",      // Transition blur strength
    OVERLAY_DELAY: 800,         // Overlay delay
    NAVIGATE_DELAY: 2500,       // Page navigation delay
    LETTER_ANIM_DURATION: "1s", // Letter animation duration
    LETTER_STAGGER: 0.04,       // Letter stagger
  },
}
```

---

## 6. Page Routing

### 6.1 Routing Table

| Path | Page | Description |
|------|------|------|
| `/` | Home | Ring Interface |
| `/about` | About | Personal Introduction |
| `/project/[id]` | Project Detail | Dynamic route, id is the project ID |

### 6.2 Navigation Flow

```
┌─────────┐     Click Project   ┌──────────────┐
│  Ring   │ ───────────────→ │ Transition Anim │
│  Home   │                   │ (2.5s)       │
└─────────┘                   └──────┬───────┘
     ↑                               │
     │                               ↓
     │   Click Logo/         ┌──────────────┐
     │   ALL PROJECTS        │ Project Detail Page │
     └────────────────────────│              │
                              └──────────────┘
```

---

## 7. Styling System

### 7.1 CSS Variables

Defined in `globals.css`:

```css
:root {
  /* Fonts */
  --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Colors */
  --color-bg: #ffffff;
  --color-fg: #000000;
  --color-accent: #666666;
  --color-border: #eeeeee;

  /* Navigation Bar */
  --nav-height: 80px;
  --nav-height-mobile: 50px;

  /* Breakpoints */
  --breakpoint-mobile: 768px;

  /* Animation */
  --transition-fast: 0.2s;
  --transition-normal: 0.4s;
  --transition-slow: 0.8s;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 7.2 CSS Modules

Project detail page styles located in `project.module.css`, main classes:

| Class Name | Purpose |
|------|------|
| `.projectTheme` | Desktop theme container |
| `.mobileTheme` | Mobile theme container |
| `.sidebar` | Left sidebar |
| `.viewport` | Right content area |
| `.revealItem` | Desktop reveal animation element |
| `.mobileReveal` | Mobile reveal animation element |
| `.visible` / `.mobileVisible` | Visible state |

---

## 8. Animation System

### 8.1 Animation Types

| Type | Technology | Purpose |
|------|------|------|
| 3D Animation | R3F `useFrame` | Ring rotation, project pop-out, camera movement |
| UI Animation | CSS Keyframes | Logo slide-in, transition overlay, letter pop-up |
| Reveal Animation | IntersectionObserver | Scroll-triggered content fade-in |
| Loading Animation | CSS Transform | Text wipe, progress bar slide (GPU accelerated) |

### 8.2 Key Animations

#### Loading Animation (Decoupled Design)

```css
/* Text Animation - Separate GPU Layer */
.wipe-text::after {
  will-change: transform;
  animation: textWipeMask 1.5s forwards;
}

/* Progress Bar Animation - Separate GPU Layer */
.loading-bar-fill {
  will-change: transform;
  animation: barSlideSmooth 1.5s infinite;
}
```

#### Reveal Animation

```css
/* Base State */
.mobileReveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s, transform 0.8s;
}

/* Revealed State */
.mobileReveal.mobileVisible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 9. Responsive Design

### 9.1 Breakpoint Strategy

```
┌──────────────────────────────────────────────────────┐
│                    768px                              │
│        Mobile           │          Desktop            │
│   - Single-column layout  │   - Two-column layout       │
│   - Touch interaction     │   - Mouse + scroll interaction │
│   - Native scrolling      │   - Lenis smooth scrolling  │
│   - CLOU-style selection  │   - Hover selection         │
│   - HTML preview area     │   - 3D central preview      │
└──────────────────────────────────────────────────────┘
```

### 9.2 Navigation Bar Adaptation

| Scenario | Navigation Bar Display |
|------|------------|
| All desktop pages | Show global navigation bar |
| Mobile homepage | Show global navigation bar |
| Mobile project page | Hide global navigation bar, show page navigation bar (with Back button) |
| Mobile About page | Hide global navigation bar, show page navigation bar |

---

## 10. Performance Optimization

### 10.1 3D Performance Optimization

```javascript
// Mobile optimization configuration
<Canvas
  gl={{
    antialias: !isMobile,      // Disable anti-aliasing on mobile
    powerPreference: "high-performance",
  }}
  dpr={isMobile ? [1, 1.5] : [1, 2]}  // Lower device pixel ratio on mobile
  performance={{ min: 0.5 }}
>
```

### 10.2 Particle System Optimization

```javascript
// Reduce particle count on mobile
const particleCount = isMobile ? 60 : 150
const connectionDist = isMobile ? 30 : 35
```

### 10.3 Animation Performance Optimization

- **Use `transform` instead of `left/top`**: GPU accelerated
- **Use `will-change`**: Hint the browser for optimization
- **Decoupled animations**: Loading text and progress bar on separate GPU layers

### 10.4 Preloading Strategy

```javascript
// Preload target project image during transition
const imagesToPreload = [targetProject.mainImage]
imagesToPreload.forEach(src => {
  const img = new window.Image()
  img.src = src
})
```

---

## 11. Development Guide

### 11.1 Adding a New Project

1. Add project images in `public/projects/`
2. Edit `src/data/projects.js`:

```javascript
{
  id: 'new-project',
  title: ['PROJECT', 'NAME'],  // Can be an array (multi-line) or a string
  ringImage: '/projects/new/ring.jpg',
  mainImage: '/projects/new/main.jpg',
  description: 'Project brief...',
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

### 11.2 Modifying Ring Parameters

Edit `RING_PARAMS` in `RingInterface.js`:

```javascript
// Adjust mobile pop-up position
mobile.selection.selectionOffset = 1.2  // Increase = move to the right

// Adjust desktop ring size
desktop.ring.radius = 25  // Increase = larger ring
```

### 11.3 Modifying Transition Times

Edit `CONFIG.TRANSITION` in `RingInterface.js`:

```javascript
OVERLAY_DELAY: 800,    // Overlay appearance delay
NAVIGATE_DELAY: 2500,  // Page navigation delay (total duration)
```

---

## 12. FAQ

### Q1: The Ring page is scrollable up and down on mobile?

**Reason**: Touch events are not correctly preventing default behavior.

**Solution**: Check the styles in `RingInterface.js`:
```css
.is-mobile {
  touch-action: none;
  overflow: hidden;
  position: fixed;
}
```

### Q2: The Ring doesn't rotate when returning to the homepage on desktop?

**Reason**: Next.js might be caching the component state.

**Solution**: Added `popstate` and `visibilitychange` listeners to ensure rotation is triggered.

### Q3: The loading animation is janky?

**Reason**: Text and progress bar animations might be on the same GPU layer.

**Solution**: Used `will-change` and `transform: translateZ(0)` to decouple animations to separate GPU layers.

### Q4: The project navigation button text is truncated?

**Reason**: When title is an array, only the first element was being taken.

**Solution**: Changed to `title.join(' ')` to display the full title.

---

## Appendix: Quick Reference

### File Entry Points

| Functionality | File Path |
|------|----------|
| 3D Ring Interface | `src/components/canvas/RingInterface.js` |
| Global Navigation Bar | `src/app/layout.js` |
| Project Detail Page | `src/app/project/[id]/page.js` |
| About Page | `src/app/about/page.js` |
| Project Data | `src/data/projects.js` |
| Global Styles | `src/app/globals.css` |
| Page Styles | `src/app/project/[id]/project.module.css` |

### Common Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Code linting
```

---

**End of Document**

MIT © 2026 EthanDigital
