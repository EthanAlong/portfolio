'use client';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { referenceLevels } from '@/app/preview/lax/referenceGeometry';

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

export default function Structure({ chapter, motion, orbit }) {
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
    position.multiplyScalar(Math.max(1, 1 / state.viewport.aspect));
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

