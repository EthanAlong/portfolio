'use client';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import { referenceLevels } from '@/app/preview/lax/referenceGeometry';

function Members({ boxes, color, opacity, focus, head }) {
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
    <StudyMaterial color={color} opacity={opacity} focus={focus} head={head} />
  </instancedMesh>;
}

const neutral = new THREE.Color('#89939b');
const accent = new THREE.Color('#76909c');

function StudyMaterial({ color, opacity, focus, head, floor = false }) {
  const material = useRef();
  useFrame(() => {
    const amount = focus.current;
    material.current.opacity = opacity * (head ? 1 : 1 - amount * .87);
    if (head && !floor) material.current.color.copy(neutral).lerp(accent, amount);
    material.current.depthWrite = !floor && material.current.opacity > .5;
  });
  return <meshStandardMaterial ref={material} color={color} roughness={floor ? .8 : .55} metalness={floor ? 0 : .2} side={floor ? THREE.DoubleSide : THREE.FrontSide} transparent opacity={opacity} depthWrite={!floor} />;
}

const cameraPositions = [[37, 26, 36], [37, 31, 36], [36, 23, 31], [37, 26, 36]];
const cameraAims = [[0, 2.5, 0], [0, 5.5, 0], [5.5, 3, 0], [0, 2.5, 0]];
const spreads = [0, 1, .38, 0];
const focuses = [0, 0, 1, 0];
const smoothstep = t => t * t * (3 - 2 * t);

export default function Structure({ chapter, motion, orbit, progress }) {
  const levels = useRef([]);
  const focus = useRef(0);
  const smooth = useRef(progress?.current ?? chapter / 3);
  const scratch = useRef({ position: new THREE.Vector3(), aim: new THREE.Vector3() });
  useFrame((state, dt) => {
    // Scroll drives a single continuous timeline; no chapter-triggered tweens.
    const desired = progress?.current ?? chapter / 3;
    const blend = motion ? 1 - Math.exp(-Math.min(dt, .05) * 12) : 1;
    smooth.current = THREE.MathUtils.lerp(smooth.current, desired, blend);
    const timeline = Math.min(3, Math.max(0, smooth.current * 3));
    const segment = Math.min(2, Math.floor(timeline));
    const t = smoothstep(timeline - segment);
    const spread = THREE.MathUtils.lerp(spreads[segment], spreads[segment + 1], t);
    focus.current = THREE.MathUtils.lerp(focuses[segment], focuses[segment + 1], t);
    levels.current.forEach((level, i) => { if (level) level.position.y = referenceLevels[i].height + i * spread * 2.1; });
    // Once dragged, retain the visitor's view while the structure keeps following scroll.
    if (orbit.current) return;
    const { position, aim } = scratch.current;
    for (let axis = 0; axis < 3; axis++) {
      position.setComponent(axis, THREE.MathUtils.lerp(cameraPositions[segment][axis], cameraPositions[segment + 1][axis], t));
      aim.setComponent(axis, THREE.MathUtils.lerp(cameraAims[segment][axis], cameraAims[segment + 1][axis], t));
    }
    position.multiplyScalar(Math.max(1, 1 / state.viewport.aspect));
    state.camera.position.lerp(position, blend);
    state.controls?.target.lerp(aim, blend);
    state.camera.lookAt(state.controls?.target ?? aim);
  });
  return <group>
    {referenceLevels.map((level, index) => <group key={index} ref={el => { levels.current[index] = el; }}>
      {level.parts.map((part, i) => {
        return <group key={i}>
          <Members boxes={part.beams} color="#89939b" opacity={1} focus={focus} head={part.head} />
          <Members boxes={part.columns} color="#a3a9ae" opacity={.85} focus={focus} head={part.head} />
          <mesh position={[0, .035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <shapeGeometry args={[part.shape, 64]} />
            <StudyMaterial color="#dce7ea" opacity={.18} focus={focus} head={part.head} floor />
          </mesh>
        </group>;
      })}
    </group>)}
    <ContactShadows position={[0, -.05, 0]} opacity={.2} scale={65} blur={3} far={18} resolution={256} frames={1} />
  </group>;
}
