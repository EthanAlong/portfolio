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

import React, { useEffect, useState } from 'react'
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

          {/* 核心宣言 */}
          <div className={`${styles.mobileBriefing} ${styles.mobileContentReveal}`}>
            <h2 className={styles.mobileSectionTitle}>MANIFESTO</h2>
            <p className={styles.mobileBriefingText}>
              I DECODE COMPLEX URBAN ORDINANCES THROUGH ALGORITHMIC PRECISION TO UNLOCK ARCHITECTURAL POTENTIAL.
            </p>
          </div>

          {/* Metadata Grid */}
          <div className={styles.mobileMetaGrid}>
            {[
              { label: "Contact", value: "ethan_along@outlook.com" },
              { label: "Focus", value: "Regulatory Innovation" },
              { label: "Tech Stack", value: "Python / GH / React" },
              { label: "LA Expertise", value: "CHIP / TOC / AB 1287" },
              { label: "Education", value: "UCLA Arch & UD" },
              { label: "Location", value: "Los Angeles, CA" }
            ].map((item, i) => (
              <div
                key={i}
                className={`${styles.mobileMetaItem} ${styles.mobileMetaReveal}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className={styles.mobileMetaLabel}>{item.label}</span>
                <span className={styles.mobileMetaValue}>{item.value}</span>
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

          {/* 社交链接 */}
          <div className={`${styles.mobileContentSection} ${styles.mobileContentReveal}`}>
            <h2 className={styles.mobileSectionTitle}>CONNECT</h2>
            <Link
              href="https://www.linkedin.com/in/yixiang-huang-08b70620a/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', width: '120px', height: '150px', position: 'relative' }}
            >
              <Image
                src="/qrcode-linkedin.png"
                alt="LinkedIn QR Code"
                fill
                style={{ objectFit: 'cover' }}
              />
            </Link>
          </div>

          {/* 底部留白 */}
          <div className={styles.mobileFooterSpace} />
        </div>
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
          {/* 核心宣言 */}
          <div className={`${styles.revealItem} ${styles.briefingText}`}>
            I DECODE COMPLEX URBAN ORDINANCES THROUGH ALGORITHMIC PRECISION TO UNLOCK ARCHITECTURAL POTENTIAL.
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
              <span className={styles.metaValue}>Python / Grasshopper</span>
              <span className={styles.metaValue}>UE5 / React / Three.js</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LA Expertise</span>
              <span className={styles.metaValue}>CHIP / TOC / AB 1287</span>
              <span className={styles.metaValue}>Ministerial Review</span>
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

          {/* 社交二维码链接模块 */}
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
                <div style={{ width: '150px', height: '186px', background: '#f0f0f0', position: 'relative', cursor: 'pointer' }}>
                  <Image
                    src="/qrcode-linkedin.png"
                    alt="LinkedIn QR Code"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
