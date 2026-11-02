"use client"
/**
 * ============================================================
 * 【 layout.js - 全局布局组件 】
 * ============================================================
 *
 * 文件概述：
 * Next.js App Router 的根布局文件，为所有页面提供共享的 UI 元素。
 *
 * 主要功能：
 * 1. 全局导航栏 - Logo（逐字滑入动画）+ About 按钮（下划线展开动效）
 * 2. 主题切换 - 首页白色主题，项目页黑色主题，自动过渡
 * 3. 响应式处理 - 移动端特定页面隐藏全局导航栏
 *
 * 导航栏显示逻辑：
 * - 桌面端：所有页面都显示全局导航栏
 * - 移动端首页(Ring)：显示全局导航栏
 * - 移动端项目详情页：隐藏全局导航栏，使用页面自带的导航栏（带 Back 按钮）
 * - 移动端 About 页：隐藏全局导航栏，使用页面自带的导航栏
 *
 * Logo 点击行为：
 * - 在首页点击：刷新页面（避免 Next.js 导航导致的黑屏闪烁）
 * - 在其他页面点击：导航回首页
 *
 * 作者：Ethan
 * 最后更新：2026-01
 * ============================================================
 */

import "./globals.css"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * 常量配置
 */
const LOGO_TEXT = "EthanDigital"  // Logo 文字，用于逐字动画
const MOBILE_BREAKPOINT = 768     // 移动端断点（px）

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const isHome = pathname === '/'
  const isProjectPage = pathname.startsWith('/project/')
  const isAboutPage = pathname === '/about'
  const isEngineeringPage = pathname === '/engineering'
  // 首页与 Engineering 页：导航栏占满宽度（非两栏布局）
  const isFullWidthNav = isHome || isEngineeringPage

  /**
   * 移动端检测
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 动态类名：控制颜色主题
  const themeClass = (isHome ? 'nav-home' : 'nav-project') + (isEngineeringPage ? ' nav-solid' : '')

  // 动态样式：控制宽度和 Padding
  const navStyle = {
    width: isFullWidthNav ? '100%' : '38.2vw',
    paddingLeft: isFullWidthNav ? '40px' : '2.5rem',
    paddingRight: isFullWidthNav ? '40px' : '2.5rem',
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <html lang="en"><body>{children}</body></html>

  /**
   * 判断是否隐藏全局导航栏
   * - 移动端项目详情页：使用页面自带的导航栏（带返回按钮）
   * - 移动端 About 页面：使用页面自带的导航栏
   */
  const shouldHideGlobalNav = isMobile && (isProjectPage || isAboutPage)

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning={true}>

        {/* 全局导航栏 - 移动端详情页时隐藏 */}
        {!shouldHideGlobalNav && (
          <nav className={`global-nav ${themeClass}`} style={navStyle}>
            <div className="nav-wrapper">
              {/* Logo 字母逐个动画 - 首页点击时刷新而非导航 */}
              <Link
                href="/"
                className="logo"
                onClick={(e) => {
                  if (isHome) {
                    e.preventDefault()
                    window.location.reload()
                  }
                }}
              >
                {LOGO_TEXT.split('').map((char, i) => (
                  <span
                    key={i}
                    className="logo-letter"
                    style={{
                      animationDelay: `${0.3 + i * 0.05}s`,
                      '--letter-index': i
                    }}
                  >
                    {char}
                  </span>
                ))}
              </Link>
              <div className="nav-links">
                {/* Engineering：面向工程 / FDE 岗位的快速浏览页
                    只在全宽导航（首页 / Engineering）显示：两栏页的导航只有 38.2vw 宽，放不下两个链接 */}
                {isFullWidthNav && (
                  <Link href="/engineering" className="about-btn" aria-current={isEngineeringPage ? 'page' : undefined}>
                    <span className="about-text">ENGINEERING</span>
                    <span className="about-underline"></span>
                  </Link>
                )}
                {/* About 按钮带下划线动效 */}
                <Link href="/about" className="about-btn" aria-current={isAboutPage ? 'page' : undefined}>
                  <span className="about-text">ABOUT</span>
                  <span className="about-underline"></span>
                </Link>
              </div>
            </div>
          </nav>
        )}

        {children}

        {/* ============================================================
            导航栏样式 - 包含字母动效和下划线动效
            ============================================================ */}
        <style jsx global>{`
          /* --- 导航栏基础样式 --- */
          .global-nav {
            position: fixed;
            top: 0;
            left: 0;
            height: 80px;
            z-index: 9999;
            pointer-events: none;
            padding-top: 45px;

            /* 平滑过渡：宽度、内边距、颜色 */
            transition:
              width 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              padding 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.5s ease;

            box-sizing: border-box;
          }

          /* --- 颜色主题 --- */
          .global-nav.nav-home {
            color: #ffffff;
          }
          .global-nav.nav-project {
            color: #000000;
          }
          /* Engineering 页是整页滚动：给导航一个半透明白底，避免压在正文上 */
          .global-nav.nav-solid {
            background: rgba(255, 255, 255, 0.86);
            -webkit-backdrop-filter: saturate(180%) blur(14px);
            backdrop-filter: saturate(180%) blur(14px);
            height: 110px;
          }

          .nav-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: inherit;
          }

          /* ============================================ */
          /* Logo 样式 - 字母逐个滑入动效 */
          /* ============================================ */
          .logo {
            font-weight: 900;
            font-size: 36px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            text-decoration: none;
            color: inherit;
            pointer-events: auto;
            white-space: nowrap;
            display: flex;
            overflow: hidden;
          }

          /* 单个字母样式 */
          .logo-letter {
            display: inline-block;
            opacity: 0;
            transform: translateY(100%);
            animation: letterSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* 字母滑入动画 */
          @keyframes letterSlideIn {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Logo hover 效果：字母依次扫描波动 */
          .logo:hover .logo-letter {
            animation: letterScan 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: calc(var(--letter-index, 0) * 0.03s);
          }

          @keyframes letterScan {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            30% {
              transform: translateY(-4px);
              opacity: 0.6;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          /* Logo 点击效果 */
          .logo:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }

          /* ============================================ */
          /* About 按钮样式 - 下划线展开动效 */
          /* ============================================ */
          .about-btn {
            font-weight: 600;
            font-size: 18px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            text-decoration: none;
            color: inherit;
            pointer-events: auto;
            white-space: nowrap;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            opacity: 0;
            animation: aboutFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.8s;
          }

          @keyframes aboutFadeIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .about-btn[aria-current='page'] .about-underline {
            width: 100%;
          }

          .about-text {
            transition: opacity 0.3s ease;
          }

          /* 下划线 */
          .about-underline {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: currentColor;
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          /* Hover 时下划线展开 */
          .about-btn:hover .about-underline {
            width: 100%;
          }

          .about-btn:hover .about-text {
            opacity: 0.8;
          }

          /* ============================================ */
          /* 移动端适配 */
          /* ============================================ */
          @media (max-width: 768px) {
            .global-nav {
              width: 100% !important;
              height: 10vh;
              padding: 0 20px !important;
              padding-top: 0 !important;
            }

            .logo {
              font-size: 20px;
              letter-spacing: 0.02em;
            }

            .about-btn {
              font-size: 12px;
            }

            .nav-links {
              gap: 1rem;
            }

            .global-nav.nav-solid {
              height: 10vh;
            }
          }
        `}</style>
      </body>
    </html>
  )
}