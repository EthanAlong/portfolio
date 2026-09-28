'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import styles from './WorkflowDemo.module.css';

const INTERVAL = 4500;
const subscribeMotion = (notify) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const readMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const subscribeVisibility = (notify) => {
  document.addEventListener('visibilitychange', notify);
  return () => document.removeEventListener('visibilitychange', notify);
};
const readVisibility = () => !document.hidden;

export default function WorkflowDemo({ title, steps }) {
  const root = useRef(null);
  const headingId = useId();
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  // null follows the visitor's motion preference; an explicit click overrides it.
  const [playChoice, setPlayChoice] = useState(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, () => true);
  const pageVisible = useSyncExternalStore(subscribeVisibility, readVisibility, () => false);
  const wantsPlayback = playChoice ?? !reducedMotion;
  const playing = wantsPlayback && inView && pageVisible;
  const step = steps[index];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 }
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || steps.length < 2) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % steps.length), INTERVAL);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const select = (i) => { setIndex(i); setPlayChoice(false); };

  return (
    <section ref={root} className={styles.demo} aria-labelledby={headingId} data-workflow-demo>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Workflow / Rhino 8</p>
          <h2 id={headingId}>{title}</h2>
        </div>
        <span className={styles.counter}>{String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
      </div>

      <div className={styles.stage}>
        {steps.map((item, i) => (
          <div key={item.image} className={`${styles.frame} ${i === index ? styles.active : ''}`} aria-hidden={i !== index}>
            <Image src={item.image} alt={item.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 62vw" className={styles.image} />
          </div>
        ))}
      </div>

      <div className={styles.caption} aria-live={wantsPlayback ? 'off' : 'polite'} aria-atomic="true">
        <h3>{step.label}</h3>
        <p>{step.description}</p>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.play} onClick={() => setPlayChoice(!wantsPlayback)} aria-label={wantsPlayback ? 'Pause workflow' : 'Play workflow'}>
          <span aria-hidden="true">{wantsPlayback ? 'Ⅱ' : '▶'}</span> {wantsPlayback ? 'Pause' : 'Play'}
        </button>
        <div className={styles.steps} role="group" aria-label="Workflow steps">
          {steps.map((item, i) => (
            <button type="button" key={item.label} onClick={() => select(i)} className={i === index ? styles.selected : ''} aria-pressed={i === index} aria-label={`Step ${i + 1}: ${item.label}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.stepLabel}>{item.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
      <p className={styles.note}>A walkthrough of actual Rhino captures. Select a step to inspect it.</p>
    </section>
  );
}
