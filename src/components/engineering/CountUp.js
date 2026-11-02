"use client"
/**
 * CountUp — animates the numeric part of a label like "1,000+", "<$100" or "6"
 * from 0 when it scrolls into view. Prefix/suffix and thousands separators are
 * kept. The final value is what renders on the server and for reduced motion,
 * so the number is never wrong if JS or the observer doesn't run.
 * Writes textContent directly (no React state per frame).
 */
import React, { useEffect, useRef } from 'react'

const DURATION = 1400 // ms

function parse(value) {
  const m = String(value).match(/^(\D*)([\d,.]+)(.*)$/)
  if (!m) return null
  const [, prefix, num, suffix] = m
  return { prefix, suffix, target: parseFloat(num.replace(/,/g, '')), comma: num.includes(',') }
}

export default function CountUp({ value, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const parsed = parse(value)
    if (!parsed || !el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const fmt = (n) =>
      parsed.prefix +
      (parsed.comma ? Math.round(n).toLocaleString('en-US') : Math.round(n)) +
      parsed.suffix

    // Only start from 0 if the number is still below the fold; if it's already
    // on screen at mount, animating would just flash.
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight * 0.9) return

    el.textContent = fmt(0)
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const k = Math.min(1, (now - start) / DURATION)
        el.textContent = k === 1 ? value : fmt(parsed.target * (1 - Math.pow(2, -10 * k)))
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      el.textContent = value
    }
  }, [value])

  return <span ref={ref} className={className}>{value}</span>
}
