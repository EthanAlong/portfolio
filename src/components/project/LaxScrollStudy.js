'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Structure from './LaxStructure';
import styles from './LaxScrollStudy.module.css';

const stages = [
  ['Overview', 'Structure. In perspective.'],
  ['By level', 'Every level. A little clearer.'],
  ['By segment', 'One system. Distinct parts.'],
  ['Together', 'Back together. Built to connect.'],
];

export default function LaxScrollStudy({ scrollRootRef }) {
  const track = useRef(null);
  const panel = useRef(null);
  const orbit = useRef(false);
  const progressRef = useRef(0);
  const currentStage = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [motion, setMotion] = useState(true);
  const [active, setActive] = useState(false);


  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = scrollRootRef?.current;
    const scroller = root || window;
    const update = () => {
      const rect = track.current.getBoundingClientRect();
      const top = root ? root.getBoundingClientRect().top : 50;
      const distance = Math.max(1, rect.height - panel.current.offsetHeight);
      const progress = Math.max(0, Math.min(1, (top - rect.top) / distance));
      progressRef.current = progress;
      const next = Math.min(3, Math.floor(progress * 4));
      if (next !== currentStage.current) {
        currentStage.current = next;
        setChapter(next);
      }
    };
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { root, rootMargin: '250px' });
    observer.observe(track.current);
    const resize = new ResizeObserver(update);
    resize.observe(track.current);
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      observer.disconnect(); resize.disconnect();
      scroller.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [scrollRootRef]);

  return <section ref={track} className={styles.track} aria-label="LAX interactive structural study" data-stage={chapter}>
    <div ref={panel} className={styles.panel}>
      <header className={styles.heading}>
        <p>STRUCTURE IN MOTION <span>0{chapter + 1} / 04</span></p>
        <h2>{stages[chapter][1]}</h2>
      </header>
      <div className={styles.scene}>
        {active && <Canvas style={{ touchAction: 'pan-y' }} dpr={[1, 1.5]} camera={{ position: [37, 26, 36], fov: 39, near: .1, far: 200 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[8, 20, 12]} intensity={2.4} />
          <directionalLight position={[-10, 8, -10]} intensity={1} />
          <Suspense fallback={null}><Structure chapter={chapter} motion={motion} orbit={orbit} progress={progressRef} /></Suspense>
          <OrbitControls makeDefault enableZoom={false} enablePan={false} enableDamping dampingFactor={.1} rotateSpeed={.65} minPolarAngle={.25} maxPolarAngle={Math.PI / 2.1} onStart={() => { orbit.current = true; }} />
        </Canvas>}
        <button className={styles.reset} onClick={() => { orbit.current = false; }} aria-label="Reset structural view">Reset view</button>
      </div>
      <footer className={styles.footer}>
        <ol aria-label="Structural sequence">
          {stages.map(([label], i) => <li key={label} aria-current={chapter === i ? 'step' : undefined}>{label}</li>)}
        </ol>
        <p>Scroll to explore <span aria-hidden="true">&darr;</span><span className={styles.dragHint}>Drag to rotate</span></p>
        <small>Drawing-based study &middot; Approximate heights &amp; framing</small>
      </footer>
    </div>
  </section>;
}
