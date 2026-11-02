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
import DataFlow from '@/components/engineering/DataFlow'
import FlowDiagram from '@/components/engineering/FlowDiagram'
import ContactForm from '@/components/contact/ContactForm'
import { rfiFlow, azureMap, mailMcp } from '@/data/diagrams'

// WebGL only on the client; the hero reads fine before it arrives.
const StructureFrame = dynamic(() => import('@/components/engineering/StructureFrame'), { ssr: false })
import {
  engineeringIntro,
  proofPoints,
  workingMethod,
  dataFlow,
  certification,
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
      // hero scroll link: 0 at the top → 1 after one viewport (Apple-style fade/scale)
      const hk = Math.min(1, window.scrollY / window.innerHeight)
      document.documentElement.style.setProperty('--hero-k', hk.toFixed(4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      document.documentElement.style.removeProperty('--hero-k')
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

function CaseMedia({ study }) {
  if (study.diagram === 'agent-loop') {
    return (
      <div className={styles.caseMedia} style={{ maxWidth: 880 }}>
        <div className={`${styles.caseImage} ${styles.caseDiagram}`}>
          <AgentLoop className={styles.agentLoop} />
        </div>
      </div>
    )
  }
  const spec = { rfi: rfiFlow, azure: azureMap, mail: mailMcp }[study.diagram] || null
  if (spec) {
    return (
      <div className={styles.caseMedia} style={{ maxWidth: 960 }}>
        <div className={`${styles.caseImage} ${styles.caseDiagram}`}>
          <FlowDiagram spec={spec} className={styles.agentLoop} />
        </div>
      </div>
    )
  }
  if (!study.image) return null
  const [w, h] = study.imageSize || [1600, 900]
  return (
    <div className={styles.caseMedia} style={study.mediaWidth ? { maxWidth: study.mediaWidth } : undefined}>
      <div className={`${styles.caseFrame} ${styles.caseImageReveal}`}>
        {/* unoptimized: serve the original file. Re-encoding these UI
            screenshots at q75 is what made the text mushy. */}
        <Image
          src={study.image}
          alt={study.imageAlt || `${study.title} screenshot`}
          width={w}
          height={h}
          unoptimized
          className={styles.caseImg}
        />
      </div>
    </div>
  )
}

function CaseRow({ study, index }) {
  return (
    <article className={`${styles.case} ${styles.reveal}`} id={study.id}>
      <div className={styles.caseHead}>
        <span className={styles.caseIndex}>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3 className={styles.caseTitle}>{study.title}</h3>
          {study.tagline && <p className={styles.caseTagline}>{study.tagline}</p>}
          <p className={styles.caseContext}>{study.context}</p>
        </div>
      </div>

      <CaseMedia study={study} />

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

      {study.spotlight && (
        <div className={styles.spotlight}>
          <p className={styles.spotlightLabel}>{study.spotlight.label}</p>
          <h4 className={styles.spotlightTitle}>{study.spotlight.title}</h4>
          <p className={styles.spotlightText}>{study.spotlight.text}</p>
        </div>
      )}

      {study.tools && (
        <table className={styles.toolTable}>
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Task</th>
              <th scope="col">Before</th>
              <th scope="col">After</th>
            </tr>
          </thead>
          <tbody>
            {study.tools.map((t) => (
              <tr key={t.name}>
                <th scope="row">{t.name}</th>
                <td>{t.what}</td>
                <td className={styles.toolBefore}>{t.before}</td>
                <td className={styles.toolAfter}>{t.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.caseFoot}>
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
        <p className={styles.cert}>
          <span className={styles.certDot} aria-hidden="true" />
          {certification.name} <span className={styles.certCode}>{certification.code}</span>
        </p>
        <nav className={styles.heroLinks} aria-label="Jump to">
          <a href="#work">Work</a>
          <a href="#method">Method</a>
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

      {/* --- Data flow --- */}
      <section className={styles.flowSection} aria-labelledby="flow-heading">
        <p className={`${styles.eyebrow} ${styles.reveal}`}>{dataFlow.eyebrow}</p>
        <h2 id="flow-heading" className={`${styles.flowHeading} ${styles.reveal}`}>
          {dataFlow.heading.map((l) => <span key={l}>{l}</span>)}
        </h2>
        <p className={`${styles.flowLede} ${styles.reveal}`}>{dataFlow.lede}</p>
        <DataFlow className={styles.flowDiagram} />
        <div className={`${styles.flowStats} ${styles.reveal}`}>
          {dataFlow.stats.map((st) => (
            <div key={st.label}>
              <CountUp className={styles.flowStatValue} value={st.value} />
              <span className={styles.flowStatLabel}>{st.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- Method --- */}
      <section className={styles.section} id="method">
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Method</h2>
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
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Work</h2>
        {caseStudies.map((s, i) => (
          <CaseRow key={s.id} study={s} index={i} />
        ))}
      </section>

      {/* --- Toolbox --- */}
      <section className={styles.section}>
        <h2 className={`${styles.sectionHeading} ${styles.reveal}`}>Stack</h2>
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
        <h2 className={styles.contactHeading}>Hours to win back?</h2>
        <div className={styles.contactLinks}>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <Link href="/">Full portfolio →</Link>
        </div>
        <ContactForm />
      </footer>
    </main>
  )
}
