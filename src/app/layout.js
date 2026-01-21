"use client"
import "./globals.css"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  const isHome = pathname === '/'
  
  // 1. 动态类名：用来控制颜色
  const themeClass = isHome ? 'nav-home' : 'nav-project'
  
  // 2. 动态样式：用来控制宽度和Padding
  const navStyle = {
    width: isHome ? '100%' : '38.2vw',
    paddingLeft: isHome ? '40px' : '2.5rem',
    paddingRight: isHome ? '40px' : '2.5rem',
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <html lang="en"><body>{children}</body></html>

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning={true}>
        
        {/* 把动态样式直接写在 style 属性里，把颜色控制交给 className */}
        <nav className={`global-nav ${themeClass}`} style={navStyle}>
          <div className="nav-wrapper">
            <Link href="/" className="logo">EthanDigital</Link>
            <Link href="/about" className="about-btn">ABOUT</Link>
          </div>
        </nav>

        {children}

        <style jsx global>{`
          .global-nav {
            position: fixed;
            top: 0;
            left: 0;
            height: 80px;
            z-index: 9999;
            pointer-events: none;
            padding-top: 45px;

            /* 让宽度和Padding的变化产生平滑动画 */
            transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                        padding 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                        color 0.5s ease; /* 颜色也加过渡 */

            /* 关键：防止padding把宽度撑爆 */
            box-sizing: border-box;
          }

          /* 移动端导航适配 */
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
          }

          /* --- 颜色控制核心 --- */
          .global-nav.nav-home {
            color: #ffffff;
          }
          .global-nav.nav-project {
            color: #000000;
          }

          .nav-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: inherit; /* 继承父级的颜色 */
          }

          .logo {
            font-weight: 900;
            font-size: 36px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            text-decoration: none;
            color: inherit;
            pointer-events: auto;
            white-space: nowrap;
            opacity: 0;
            animation: navFadeIn 0.8s ease forwards 0.3s;
          }

          .about-btn {
            font-weight: 600;
            font-size: 18px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            text-decoration: none;
            color: inherit;
            pointer-events: auto;
            opacity: 0;
            animation: navFadeIn 0.8s ease forwards 0.5s;
            transition: opacity 0.3s;
            white-space: nowrap;
          }

          .about-btn:hover {
            opacity: 0.6;
          }

          @keyframes navFadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </body>
    </html>
  )
}