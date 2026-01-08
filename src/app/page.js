// src/app/page.js
import RingInterface from '@/components/canvas/RingInterface'

export default function Home() {
  return (
    /* 使用 fixed 覆盖全屏，并在这里单独写 overflow: hidden */
    <main style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden', 
      background: '#000' 
    }}>
      <RingInterface />
      
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        color: 'white',
        zIndex: 10,
        pointerEvents: 'none',
        fontFamily: 'sans-serif'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, letterSpacing: '-2px' }}>
          PORTFOLIO 2026
        </h1>
      </div>
    </main>
  )
}