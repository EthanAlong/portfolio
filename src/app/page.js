// src/app/page.js
"use client"
import RingInterface from '@/components/canvas/RingInterface'

export default function Home() {
  return (
    <main style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <RingInterface />
    </main>
  )
}