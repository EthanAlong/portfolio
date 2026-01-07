import RingInterface from '@/components/canvas/RingInterface'

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <RingInterface />
      
      {/* 确保 UI 不遮挡点击 */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        color: 'white',
        zIndex: 100,
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