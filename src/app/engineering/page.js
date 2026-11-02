"use client"
/**
 * ============================================================
 * 【 engineering/page.js - Engineering / FDE view 】
 * ============================================================
 *
 * The skimmable, recruiter-first page for engineering and forward-deployed
 * roles. It does NOT replace the ring: it is a separate editorial page reached
 * from the ENGINEERING link in the global nav. Case studies render as
 * full-width rows (problem → built → outcome), not a card grid.
 *
 * Content lives in src/data/engineering.js.
 * ============================================================
 */

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import styles from './engineering.module.css'
import CountUp from '@/components/engineering/CountUp'
import AgentLoop from '@/components/engineering/AgentLoop'

// WebGL only on the client; the hero reads fine before it arrives.
const StructureFrame = dynamic(() => import('@/components/engineering/StructureFrame'), { ssr: false })
import {
  engineeringIntro,
  proofPoints,
  workingMethod,
  caseStudies,
  toolbox,
  contact,
} from '@/data/engineering'

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(`.${styles.reveal}`)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add(styles.shown))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.shown)
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/** Thin bar under the nav that tracks scroll position. */
function ScrollProgress() {
  const bar = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const k = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${k})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={bar} className={styles.progress} aria-hidden="true" />
}

function CaseLink({ link }) {
  if (link.external) {
    return (
      <a className={styles.link} href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label} <span aria-hidden="true">↗</span>
      </a>
    )
  }
  return (
    <Link className={styles.link} href={link.href}>
      {link.label} <span aria-hidden="true">→</span>
    </Link>
  )
}

function CaseRow({ study, index }) {
  return (
    <article className={`${styles.case} ${styles.reveal}`} id={study.id}>
      <div className={styles.caseHead}>
        <span className={styles.caseIndex}>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3 className={styles.caseTitle}>{study.title}</h3>
          <p className={styles.caseContext}>{study.context}</p>
        </div>
      </div>

      <div className={styles.caseBody}>
        <dl className={styles.caseFacts}>
          <div>
            <dt>Problem</dt>
            <dd>{study.problem}</dd>
          </div>
          <div>
            <dt>Built</dt>
            <dd>{study.built}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{study.outcome}</dd>
          </div>
        </dl>

        <div className={styles.caseSide}>
          {study.image ? (
            <div className={`${styles.caseImage} ${styles.caseImageReveal}`}>
              <Image
                src={study.image}
                alt={`${study.title} screenshot`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : study.diagram === 'agent-loop' ? (
            <div className={`${styles.caseImage} ${styles.caseDiagram}`}>
              <AgentLoop className={styles.agentLoop} />
            </div>
          ) : study.stat ? (
            <div className={`${styles.caseImage} ${styles.caseStat}`}>
              <span className={styles.caseStatValue}>{study.stat.value}</span>
              <span className={styles.caseStatLabel}>{study.stat.label}</span>
            </div>
          ) : null}
          <ul className={styles.stack} aria-label="Stack">
            {study.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {study.links.length > 0 && (
            <div className={styles.links}>
              {study.links.map((l) => (
                <CaseLink key={l.href} link={l} />
              ))}
            </div>
          )}
          {study.note && <p className={styles.caseNote}>{study.note}</p>}
        </div>
      </div>
    </article>
  )
}

export default function EngineeringPage() {
  useReveal()

  return (
    <main className={styles.page}>
      <ScrollProgress />

      {/* --- Hero --- */}
      <header className={styles.hero}>
        <StructureFrame className={styles.heroCanvas} />
        <p className={styles.eyebrow}>{engineeringIntro.eyebrow}</p>
        <h1 className={styles.headline}>
          {engineeringIntro.headline.map((line, i) => (
            <span key={line} className={styles.headlineMask}>
              <span className={styles.headlineLine} style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className={styles.lede}>{engineeringIntro.lede}</p>
        <nav className={styles.heroLinks} aria-label="Jump to">
          <a href="#work">Selected work</a>
          <a href="#method">How I work</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* --- Proof points --- */}
      <section className={`${styles.proof} ${styles.reveal}`} aria-label="In production">
        {proofPoints.map((p) => (
          <div key={p.label} className={styles.proofItem}>
            <CountUp className={styles.proofValue} value={p.value} />
            <span className={styles.proofLabel}>{p.label}</span>
          </div>
        ))}
      </section>

      {/* --- Method --- */}
      <section className={styles.section} id="method">
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>How I work</h2>
        <ol className={`${styles.method} ${styles.reveal}`}>
          {workingMethod.map((m, i) => (
            <li key={m.step} className={styles.methodItem} style={{ '--i': i }}>
              <span className={styles.methodIndex}>{i + 1}</span>
              <h3 className={styles.methodStep}>{m.step}</h3>
              <p className={styles.methodText}>{m.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* --- Case studies --- */}
      <section className={styles.section} id="work">
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Selected work</h2>
        {caseStudies.map((s, i) => (
          <CaseRow key={s.id} study={s} index={i} />
        ))}
      </section>

      {/* --- Toolbox --- */}
      <section className={styles.section}>
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Toolbox</h2>
        <div className={styles.toolbox}>
          {toolbox.map((g) => (
            <div key={g.group} className={`${styles.toolGroup} ${styles.reveal}`}>
              <h3 className={styles.toolGroupTitle}>{g.group}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* --- Contact --- */}
      <footer className={`${styles.contact} ${styles.reveal}`} id="contact">
        <h2 className={styles.contactHeading}>Have a workflow that eats hours?</h2>
        <div className={styles.contactLinks}>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <Link href="/">Full portfolio →</Link>
        </div>
      </footer>
    </main>
  )
}
