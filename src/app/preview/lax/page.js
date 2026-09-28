'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './preview.module.css';
import Structure from '@/components/project/LaxStructure';

const chapters = [
  { label: 'Overview', title: ['Structure.', 'In perspective.'], text: 'A quiet first look at the terminal. Scroll to reveal the structure, one layer at a time.' },
  { label: 'By level', title: ['Every level.', 'A little clearer.'], text: 'The floors separate in space. Follow the rhythm of the columns, beams, and roof framing.' },
  { label: 'By segment', title: ['One system.', 'Distinct parts.'], text: 'The headhouse comes into focus. The concourse stays visible as a quiet spatial reference.' },
  { label: 'Together', title: ['Back together.', 'Built to connect.'], text: 'The layers return to one coordinated whole. Drag the model to explore another point of view.' },
];


export default function LaxPreview() {
  const scroll = useRef();
  const orbit = useRef(false);
  const [chapter, setChapter] = useState(0);
  const [motion, setMotion] = useState(true);
  const [ready, setReady] = useState(false);
  const [viewKey, setViewKey] = useState(0);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const choose = i => {
    orbit.current = false;
    const el = scroll.current;
    el.scrollTo({ top: i * (el.scrollHeight - el.clientHeight) / 3, behavior: motion ? 'smooth' : 'instant' });
  };
  return <main className={styles.shell}>
    <header className={styles.header}>
      <a href="/">ETHANDIGITAL</a>
      <span>LAX / Motion study <i>INTERACTIVE STUDY</i></span>
      <a className={styles.original} href="/project/lax-structural">Original project ↗</a>
    </header>
    <div ref={scroll} className={styles.scroll} onScroll={e => {
      const el = e.currentTarget;
      const next = Math.min(3, Math.round(el.scrollTop / (el.scrollHeight - el.clientHeight) * 3));
      if (next !== chapter) { orbit.current = false; setChapter(next); }
    }}>
      <div className={styles.track}>
        <section className={styles.sticky}>
          <div className={styles.copy} key={chapter}>
            <p className={styles.kicker}>LOS ANGELES INTERNATIONAL AIRPORT</p>
            <h1>{chapters[chapter].title.map(line => <span key={line}>{line}</span>)}</h1>
            <p className={styles.description}>{chapters[chapter].text}</p>
            <div className={styles.chapter}><span>0{chapter + 1}</span><div /><span>04</span></div>
          </div>
          <div className={styles.scene}>
            {!ready && <div className={styles.loading}>Preparing the model…</div>}
            <Canvas key={viewKey} dpr={[1, 1.5]} camera={{ position: [31, 21, 30], fov: 39, near: .1, far: 200 }} onCreated={() => setReady(true)} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[8, 20, 12]} intensity={2.4} />
              <directionalLight position={[-10, 8, -10]} intensity={1} />
              <Suspense fallback={null}><Structure chapter={chapter} motion={motion} orbit={orbit} /></Suspense>
              <OrbitControls makeDefault enableZoom={false} enablePan={false} minPolarAngle={.25} maxPolarAngle={Math.PI / 2.1} onStart={() => { orbit.current = true; }} />
            </Canvas>
            <div className={styles.sceneNote}>Drawing-based study &middot; Approximate heights &amp; framing</div>
            <button className={styles.reset} onClick={() => { orbit.current = false; setViewKey(k => k + 1); }}>Reset view ↺</button>
          </div>
          <footer className={styles.footer}>
            <span className={styles.hint}>Scroll to explore <span>↓</span></span>
            <div className={styles.tabs} role="group" aria-label="Model stages">
              {chapters.map((item, i) => <button key={item.label} aria-pressed={chapter === i} onClick={() => choose(i)}>{item.label}</button>)}
            </div>
            <span className={styles.drag}>Drag to orbit</span>
          </footer>
        </section>
      </div>
    </div>
  </main>;
}
