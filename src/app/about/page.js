"use client"
/**
 * ============================================================
 * 【 about/page.js - 个人介绍页面 】
 * ============================================================
 *
 * 文件概述：
 * 展示个人信息、技能和联系方式的页面。
 * 支持桌面端（左右两栏布局）和移动端（单列滚动布局）。
 *
 * 主要功能：
 * 1. 响应式布局 - 桌面端使用 project.module.css 的两栏布局
 * 2. 移动端适配 - 单列滚动，带有自定义导航栏
 * 3. 曝光动画 - 使用 IntersectionObserver 实现滚动触发的淡入效果
 * 4. 打字机效果 - Manifesto 文字逐字显示
 * 5. 技能标签光效 - 可控参数的闪烁效果
 *
 * 样式复用：
 * 复用 project/[id]/project.module.css 中的样式，保持与项目详情页一致的视觉风格
 *
 * 导航说明：
 * - 桌面端：使用全局导航栏（layout.js 提供）
 * - 移动端：使用页面自带的导航栏（Back 按钮 + Logo）
 *   全局导航栏在移动端 About 页面会被隐藏（见 layout.js 的 shouldHideGlobalNav）
 *
 * 作者：Ethan
 * 最后更新：2026-01
 * ============================================================
 */

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from '../project/[id]/project.module.css'

/**
 * 页面配置
 */
const PAGE_CONFIG = {
  BREAKPOINT: 768,  // 移动端断点（与全局保持一致）
}

/**
 * ============================================================
 * 【 特效参数配置 - 设计师控制台 】
 * ============================================================
 * 修改这些参数来调整特效表现
 */
const EFFECT_CONFIG = {
  // 打字机效果参数
  typewriter: {
    charDelay: 30,        // 每个字符的延迟（毫秒）
    startDelay: 500,      // 开始打字前的延迟（毫秒）
    cursorBlink: 530,     // 光标闪烁频率（毫秒）
    showCursor: true,     // 是否显示光标
  },
  // 技能标签光效参数
  glow: {
    enabled: true,        // 是否启用光效
    intensity: 0.6,       // 光效强度 (0-1)
    duration: 2,          // 一次闪烁周期（秒）
    delay: 0.15,          // 每个标签的延迟间隔（秒）
    color: 'rgba(0, 100, 255, 0.3)',  // 光效颜色
    hoverColor: 'rgba(0, 150, 255, 0.5)',  // hover 时的光效颜色
  }
}

/**
 * ============================================================
 * 【 打字机效果组件 】
 * ============================================================
 */
const Typewriter = ({ text, config = EFFECT_CONFIG.typewriter, onComplete }) => {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let charIndex = 0
    let timeout

    // 开始延迟
    const startTimeout = setTimeout(() => {
      const typeChar = () => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1))
          charIndex++
          timeout = setTimeout(typeChar, config.charDelay)
        } else {
          setIsComplete(true)
          onComplete && onComplete()
        }
      }
      typeChar()
    }, config.startDelay)

    return () => {
      clearTimeout(startTimeout)
      clearTimeout(timeout)
    }
  }, [text, config.charDelay, config.startDelay, onComplete])

  // 光标闪烁
  useEffect(() => {
    if (!config.showCursor) return

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, config.cursorBlink)

    return () => clearInterval(cursorInterval)
  }, [config.showCursor, config.cursorBlink])

  return (
    <span className="typewriter-text">
      {displayText}
      {config.showCursor && !isComplete && (
        <span
          className="typewriter-cursor"
          style={{ opacity: showCursor ? 1 : 0 }}
        >
          |
        </span>
      )}
    </span>
  )
}

/**
 * ============================================================
 * 【 带光效的技能标签组件 】
 * ============================================================
 */
const GlowLabel = ({ children, index = 0, config = EFFECT_CONFIG.glow }) => {
  if (!config.enabled) {
    return <span>{children}</span>
  }

  const animationDelay = index * config.delay

  return (
    <span
      className="glow-label"
      style={{
        '--glow-intensity': config.intensity,
        '--glow-duration': `${config.duration}s`,
        '--glow-delay': `${animationDelay}s`,
        '--glow-color': config.color,
        '--glow-hover-color': config.hoverColor,
      }}
    >
      {children}
    </span>
  )
}

/**
 * ============================================================
 * 【 LinkedIn 图标组件 】
 * ============================================================
 */
const LinkedInIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: 'block' }}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function AboutPage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 移动端检测
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < PAGE_CONFIG.BREAKPOINT)
    }
    checkMobile()
    setMounted(true)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 曝光动效监视（Intersection Observer）
  useEffect(() => {
    if (!mounted) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (isMobile) {
              entry.target.classList.add(styles.mobileVisible)
            } else {
              entry.target.classList.add(styles.visible)
            }
          }
        })
      },
      { threshold: 0.05 }
    )

    if (isMobile) {
      document.querySelectorAll(`.${styles.mobileReveal}, .${styles.mobileHeroReveal}, .${styles.mobileTitleReveal}, .${styles.mobileMetaReveal}, .${styles.mobileContentReveal}`).forEach(el => observer.observe(el))
    } else {
      document.querySelectorAll(`.${styles.revealItem}, .${styles.metaItem}`).forEach(el => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [mounted, isMobile])

  if (!mounted) return null

  /**
   * ============================================================
   * 【 移动端布局 】
   * ============================================================
   */
  if (isMobile) {
    return (
      <main className={styles.mobileTheme}>
        {/* 固定导航栏 */}
        <nav className={styles.mobileNav}>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            ← Back
          </button>
          <div className={styles.mobileNavRight}>
            <Link href="/" className={styles.mobileLogo}>
              EthanDigital
            </Link>
          </div>
        </nav>

        {/* 主内容区 */}
        <div className={styles.mobileContent}>
          {/* 标题区域 */}
          <div className={`${styles.mobileTitleSection} ${styles.mobileTitleReveal}`}>
            <h1 className={styles.mobileTitle}>
              I AM ETHAN
            </h1>
            <div className={styles.mobileSubtitle}>
              COMPUTATIONAL ARCHITECT / ZONING STRATEGIST
            </div>
          </div>

          {/* 核心宣言 - 打字机效果 */}
          <div className={`${styles.mobileBriefing} ${styles.mobileContentReveal}`}>
            <h2 className={styles.mobileSectionTitle}>MANIFESTO</h2>
            <p className={styles.mobileBriefingText}>
              <Typewriter
                text="I DECODE COMPLEX URBAN ORDINANCES THROUGH ALGORITHMIC PRECISION TO UNLOCK ARCHITECTURAL POTENTIAL."
                config={EFFECT_CONFIG.typewriter}
              />
            </p>
          </div>

          {/* Metadata Grid - 带光效的技能标签 */}
          <div className={styles.mobileMetaGrid}>
            {[
              { label: "Contact", value: "ethan_along@outlook.com", isSkill: false },
              { label: "Focus", value: "Regulatory Innovation", isSkill: false },
              { label: "Tech Stack", value: "Python / GH / React", isSkill: true },
              { label: "LA Expertise", value: "CHIP / TOC / AB 1287", isSkill: true },
              { label: "Education", value: "UCLA Arch & UD", isSkill: false },
              { label: "Location", value: "Los Angeles, CA", isSkill: false }
            ].map((item, i) => (
              <div
                key={i}
                className={`${styles.mobileMetaItem} ${styles.mobileMetaReveal}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className={styles.mobileMetaLabel}>{item.label}</span>
                <span className={styles.mobileMetaValue}>
                  {item.isSkill ? (
                    <GlowLabel index={i} config={EFFECT_CONFIG.glow}>
                      {item.value}
                    </GlowLabel>
                  ) : item.value}
                </span>
              </div>
            ))}
          </div>

          {/* 详细介绍 */}
          <div className={`${styles.mobileContentSection} ${styles.mobileContentReveal}`}>
            <h2 className={styles.mobileSectionTitle}>ABOUT ME</h2>
            <p className={styles.mobileText} style={{ marginBottom: '1.5rem' }}>
              My practice is built on the conviction that the most innovative architectural solutions lie in the
              <strong> fusion of computational logic and regulatory intelligence</strong>.
              I don't just design spaces; I build systems that navigate the intricate parameters of modern city codes.
            </p>
            <p className={styles.mobileText} style={{ marginBottom: '1.5rem' }}>
              At the start of 2026, I have pivoted my focus toward the <strong>Citywide Housing Incentive Program (CHIP)</strong>,
              using custom-built scripts to automate the feasibility analysis of high-density infill.
              By integrating <strong>AB 1287 stackable bonuses</strong> into my design workflows, I successfully transition projects
              from discretionary public hearings into streamlined <strong>Ministerial (By-right) paths</strong>.
            </p>
            <p className={styles.mobileText}>
              Whether I am programming 6-axis robotic arms at UCLA or coordinating structural corrections with LADWP on a
              150k+ SQFT construction site, my goal is to bridge the gap between high-fidelity digital narrative and the
              ground-level realities of urban development.
            </p>
          </div>

          {/* 社交链接 - 带 LinkedIn 图标 */}
          <div className={`${styles.mobileContentSection} ${styles.mobileContentReveal}`}>
            <h2 className={styles.mobileSectionTitle}>CONNECT</h2>
            <Link
              href="https://www.linkedin.com/in/yixiang-huang-08b70620a/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}
            >
              {/* LinkedIn 图标 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                color: '#0A66C2'
              }}>
                <LinkedInIcon size={18} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  LinkedIn
                </span>
              </div>
              {/* 二维码 */}
              <div style={{ width: '120px', height: '150px', position: 'relative' }}>
                <Image
                  src="/qrcode-linkedin.png"
                  alt="LinkedIn QR Code"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Link>
          </div>

          {/* 底部留白 */}
          <div className={styles.mobileFooterSpace} />
        </div>

        {/* 特效样式 */}
        <style jsx global>{`
          /* ============================================ */
          /* 打字机效果样式 */
          /* ============================================ */
          .typewriter-text {
            display: inline;
          }

          .typewriter-cursor {
            display: inline-block;
            margin-left: 2px;
            font-weight: 100;
            color: inherit;
            animation: cursorBlink 1s step-end infinite;
          }

          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          /* ============================================ */
          /* 技能标签光效样式 */
          /* ============================================ */
          .glow-label {
            display: inline-block;
            position: relative;
            transition: all 0.3s ease;
          }

          .glow-label::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -4px;
            right: -4px;
            bottom: -2px;
            background: var(--glow-color);
            border-radius: 4px;
            opacity: 0;
            z-index: -1;
            animation: glowPulse var(--glow-duration) ease-in-out infinite;
            animation-delay: var(--glow-delay);
          }

          .glow-label:hover::before {
            background: var(--glow-hover-color);
            opacity: var(--glow-intensity);
            animation: none;
          }

          .glow-label:hover {
            transform: translateY(-1px);
          }

          @keyframes glowPulse {
            0%, 100% {
              opacity: 0;
              transform: scale(0.95);
            }
            50% {
              opacity: var(--glow-intensity);
              transform: scale(1);
            }
          }
        `}</style>
      </main>
    )
  }

  /**
   * ============================================================
   * 【 桌面端布局 】
   * ============================================================
   */
  return (
    <main className={styles.projectTheme}>
      <aside className={styles.sidebar}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.projectTitle}>
            <span className={styles.titleLine}>I AM</span>
            <span className={styles.titleLine}>ETHAN</span>
          </h1>
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarMetadata}>COMPUTATIONAL ARCHITECT</div>
          <div className={styles.sidebarMetadata}>ZONING STRATEGIST</div>
        </div>
      </aside>

      <section className={styles.viewport}>
        <div className={styles.container}>
          {/* 核心宣言 - 打字机效果 */}
          <div className={`${styles.revealItem} ${styles.briefingText}`}>
            <Typewriter
              text="I DECODE COMPLEX URBAN ORDINANCES THROUGH ALGORITHMIC PRECISION TO UNLOCK ARCHITECTURAL POTENTIAL."
              config={EFFECT_CONFIG.typewriter}
            />
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Contact</span>
              <span className={styles.metaValue}>ethan_along@outlook.com</span>
              <span className={styles.metaValue}>ethanh@plusarchitects.com</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Focus</span>
              <span className={styles.metaValue}>Regulatory Innovation</span>
              <span className={styles.metaValue}>Digital Entitlement</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Tech Stack</span>
              <span className={styles.metaValue}>
                <GlowLabel index={0} config={EFFECT_CONFIG.glow}>Python / Grasshopper</GlowLabel>
              </span>
              <span className={styles.metaValue}>
                <GlowLabel index={1} config={EFFECT_CONFIG.glow}>UE5 / React / Three.js</GlowLabel>
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LA Expertise</span>
              <span className={styles.metaValue}>
                <GlowLabel index={2} config={EFFECT_CONFIG.glow}>CHIP / TOC / AB 1287</GlowLabel>
              </span>
              <span className={styles.metaValue}>
                <GlowLabel index={3} config={EFFECT_CONFIG.glow}>Ministerial Review</GlowLabel>
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Education</span>
              <span className={styles.metaValue}>UCLA Architecture & Urban Design</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Location</span>
              <span className={styles.metaValue}>Los Angeles, CA</span>
            </div>
          </div>

          {/* 第一人称详细文本 */}
          <div className={`${styles.revealItem} ${styles.moduleText}`}>
            <p style={{marginBottom: '2rem'}}>
              My practice is built on the conviction that the most innovative architectural solutions lie in the
              <strong> fusion of computational logic and regulatory intelligence</strong>.
              I don't just design spaces; I build systems that navigate the intricate parameters of modern city codes.
            </p>
            <p style={{marginBottom: '2rem'}}>
              At the start of 2026, I have pivoted my focus toward the <strong>Citywide Housing Incentive Program (CHIP)</strong>,
              using custom-built scripts to automate the feasibility analysis of high-density infill.
              By integrating <strong>AB 1287 stackable bonuses</strong> into my design workflows, I successfully transition projects
              from discretionary public hearings into streamlined <strong>Ministerial (By-right) paths</strong>,
              maximizing density while ensuring technical compliance.
            </p>
            <p>
              Whether I am programming 6-axis robotic arms at UCLA or coordinating structural corrections with LADWP on a
              150k+ SQFT construction site, my goal is to bridge the gap between high-fidelity digital narrative and the
              ground-level realities of urban development.
            </p>
          </div>

          {/* 社交二维码链接模块 - 带 LinkedIn 图标 */}
          <div className={styles.revealItem} style={{ marginTop: '4rem', paddingBottom: '4rem' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '900',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              color: '#000',
              opacity: 0.8
            }}>
              Connect
            </h3>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link href="https://www.linkedin.com/in/yixiang-huang-08b70620a/" target="_blank" rel="noopener noreferrer">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                  {/* LinkedIn 图标和标签 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    color: '#0A66C2',
                    transition: 'color 0.3s ease'
                  }}>
                    <LinkedInIcon size={22} />
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase'
                    }}>
                      LinkedIn
                    </span>
                  </div>
                  {/* 二维码 */}
                  <div style={{ width: '150px', height: '186px', background: '#f0f0f0', position: 'relative' }}>
                    <Image
                      src="/qrcode-linkedin.png"
                      alt="LinkedIn QR Code"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 特效样式 */}
      <style jsx global>{`
        /* ============================================ */
        /* 打字机效果样式 */
        /* ============================================ */
        .typewriter-text {
          display: inline;
        }

        .typewriter-cursor {
          display: inline-block;
          margin-left: 2px;
          font-weight: 100;
          color: inherit;
          animation: cursorBlink 1s step-end infinite;
        }

        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ============================================ */
        /* 技能标签光效样式 */
        /* ============================================ */
        .glow-label {
          display: inline-block;
          position: relative;
          transition: all 0.3s ease;
        }

        .glow-label::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -4px;
          right: -4px;
          bottom: -2px;
          background: var(--glow-color);
          border-radius: 4px;
          opacity: 0;
          z-index: -1;
          animation: glowPulse var(--glow-duration) ease-in-out infinite;
          animation-delay: var(--glow-delay);
        }

        .glow-label:hover::before {
          background: var(--glow-hover-color);
          opacity: var(--glow-intensity);
          animation: none;
        }

        .glow-label:hover {
          transform: translateY(-1px);
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0;
            transform: scale(0.95);
          }
          50% {
            opacity: var(--glow-intensity);
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  )
}
