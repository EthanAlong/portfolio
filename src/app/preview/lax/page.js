'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import styles from './preview.module.css';
import { referenceLevels } from './referenceGeometry';

const chapters = [
  { label: 'Overview', title: ['Structure.', 'In perspective.'], text: 'A quiet first look at the terminal. Scroll to reveal the structure, one layer at a time.' },
  { label: 'By level', title: ['Every level.', 'A little clearer.'], text: 'The floors separate in space. Follow the rhythm of the columns, beams, and roof framing.' },
  { label: 'By segment', title: ['One system.', 'Distinct parts.'], text: 'The headhouse comes into focus. The concourse stays visible as a quiet spatial reference.' },
  { label: 'Together', title: ['Back together.', 'Built to connect.'], text: 'The layers return to one coordinated whole. Drag the model to explore another point of view.' },
];


function Members({ boxes, color, opacity }) {
  const ref = useRef();
  useEffect(() => {
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Quaternion();
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), b[6] || 0);
      matrix.compose(new THREE.Vector3(...b.slice(0, 3)), rotation, new THREE.Vector3(...b.slice(3, 6)));
      ref.current.setMatrixAt(i, matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [boxes]);
  return <instancedMesh ref={ref} args={[null, null, boxes.length]}>
    <boxGeometry />
    <meshStandardMaterial color={color} roughness={0.55} metalness={0.2} transparent opacity={opacity} depthWrite={opacity > 0.5} />
  </instancedMesh>;
}

function Structure({ chapter, motion, orbit }) {
  const levels = useRef([]);
  const target = useRef({ spread: 0 });
  const cameraTarget = useRef(new THREE.Vector3(0, 3, 0));
  const cameraMoving = useRef(true);
  useEffect(() => {
    cameraMoving.current = true;
    const tween = gsap.to(target.current, { spread: chapter === 1 ? 1 : chapter === 2 ? .38 : 0, duration: motion ? 1.5 : 0, ease: 'power3.inOut' });
    return () => tween.kill();
  }, [chapter, motion]);
  useFrame((state, dt) => {
    levels.current.forEach((level, i) => { if (level) level.position.y = referenceLevels[i].height + i * target.current.spread * 2.1; });
    if (!cameraMoving.current || orbit.current) return;
    const position = chapter === 2 ? new THREE.Vector3(36, 23, 31) : new THREE.Vector3(37, chapter === 1 ? 31 : 26, 36);
    const aim = chapter === 2 ? new THREE.Vector3(5.5, 3, 0) : new THREE.Vector3(0, chapter === 1 ? 5.5 : 2.5, 0);
    const blend = motion ? 1 - Math.exp(-dt * 2.7) : 1;
    state.camera.position.lerp(position, blend);
    cameraTarget.current.lerp(aim, blend);
    state.controls?.target.copy(cameraTarget.current);
    state.camera.lookAt(cameraTarget.current);
    if (state.camera.position.distanceTo(position) < .02) cameraMoving.current = false;
  });
  return <group>
    {referenceLevels.map((level, index) => <group key={index} ref={el => { levels.current[index] = el; }}>
      {level.parts.map((part, i) => {
        const ghost = chapter === 2 && !part.head;
        return <group key={i}>
          <Members boxes={part.beams} color={chapter === 2 && part.head ? '#76909c' : '#89939b'} opacity={ghost ? .13 : 1} />
          <Members boxes={part.columns} color="#a3a9ae" opacity={ghost ? .1 : .85} />
          <mesh position={[0, .035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <shapeGeometry args={[part.shape, 64]} />
            <meshStandardMaterial color="#dce7ea" side={THREE.DoubleSide} transparent opacity={ghost ? .025 : .18} depthWrite={false} roughness={.8} />
          </mesh>
        </group>;
      })}
    </group>)}
    <ContactShadows position={[0, -.05, 0]} opacity={.2} scale={65} blur={3} far={18} resolution={256} frames={1} />
  </group>;
}

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
