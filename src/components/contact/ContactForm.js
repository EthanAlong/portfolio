"use client"
/**
 * ContactForm — name, email, company (optional), message → /api/contact.
 * If the route is not configured or fails, it says so and offers a mailto
 * link instead, so a visitor is never stuck.
 */
import React, { useEffect, useRef, useState } from 'react'
import styles from './contact.module.css'

const FALLBACK_EMAIL = 'Ethan_along@outlook.com'

export default function ContactForm({ compact = false }) {
  const [state, setState] = useState('idle') // idle | sending | sent | error | fallback
  const [error, setError] = useState('')
  const rendered = useRef(0)
  // when the form appeared; the route drops submissions faster than a person types
  useEffect(() => { rendered.current = Date.now() }, [])

  async function submit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body = Object.fromEntries(form.entries())
    body.t = rendered.current
    body.page = typeof window !== 'undefined' ? window.location.pathname : ''
    setState('sending')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) return setState('sent')
      const { error: code } = await res.json().catch(() => ({}))
      if (code === 'invalid') {
        setState('error')
        setError('Please add your name, a valid email and a message of a sentence or two.')
      } else if (code === 'rate_limited') {
        setState('error')
        setError('That is a few messages in a row. Please try again later, or email me directly.')
      } else {
        setState('fallback')
      }
    } catch {
      setState('fallback')
    }
  }

  if (state === 'sent') {
    return (
      <div className={styles.done} role="status">
        <span className={styles.dot} /> Thanks, it’s in my inbox. I usually reply within a day or two.
      </div>
    )
  }

  return (
    <form className={`${styles.form} ${compact ? styles.compact : ''}`} onSubmit={submit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label className={styles.field}>
        <span>Company <em>optional</em></span>
        <input name="company" autoComplete="organization" maxLength={160} />
      </label>
      <label className={styles.field}>
        <span>Message</span>
        <textarea name="message" rows={compact ? 4 : 5} required maxLength={5000}
          placeholder="What are you working on, and where does it hurt?" />
      </label>
      {/* honeypot: hidden from people, filled by bots */}
      <label className={styles.hp} aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.send} disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {state === 'error' && <p className={styles.error} role="alert">{error}</p>}
        {state === 'fallback' && (
          <p className={styles.error} role="alert">
            The form could not send right now. Please email{' '}
            <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
          </p>
        )}
      </div>
    </form>
  )
}
