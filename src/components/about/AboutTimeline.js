"use client"
/**
 * AboutTimeline — career and education as a vertical line that draws itself
 * when it scrolls into view, entries following one by one. The current role
 * gets the one blue dot (blue = live/data, as on /engineering). Static for
 * prefers-reduced-motion.
 */
import React, { useEffect, useRef, useState } from 'react'
import { aboutTimeline, aboutCredentials } from '@/data/about'
import styles from './about.module.css'

export default function AboutTimeline({ compact = false }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true)
        io.disconnect()
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${styles.timeline} ${compact ? styles.compact : ''} ${shown ? styles.shown : ''}`}>
      <ol className={styles.list}>
        {aboutTimeline.map((t, i) => (
          <li key={t.what + t.when} className={`${styles.item} ${t.current ? styles.current : ''} ${t.edu ? styles.edu : ''}`}
            style={{ '--i': i }}>
            <span className={styles.when}>{t.when}</span>
            <span className={styles.what}>{t.what}</span>
            <span className={styles.where}>{t.where}</span>
          </li>
        ))}
      </ol>
      <ul className={styles.creds} style={{ '--i': aboutTimeline.length }}>
        {aboutCredentials.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  )
}
