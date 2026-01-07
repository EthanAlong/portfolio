// src/app/page.js
import RingInterface from '@/components/canvas/RingInterface'

export default function Home() {
  return (
    // 外层容器：强制占满整个浏览器窗口，不留死角
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0, // 强制拉伸到右边
      bottom: 0, // 强制拉伸到底部
      backgroundColor: 'black',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* Canvas 容器：确保它撑满外层 */}
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <RingInterface />
      </div>
      
      {/* 文字层 */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        color: 'white',
        zIndex: 10,
        pointerEvents: 'none',
        fontFamily: 'sans-serif',
        textTransform: 'uppercase'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, letterSpacing: '-2px', lineHeight: 1 }}>
          PORTFOLIO<br/>2026
        </h1>
      </div>
    </div>
  )
}