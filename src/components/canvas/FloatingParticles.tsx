import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  area?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ count = 90, area = 15 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * area;
      pos[i * 3 + 1] = (Math.random() - 0.5) * (area * 0.8);
      pos[i * 3 + 2] = (Math.random() - 0.5) * area;

      spd[i * 3] = (Math.random() - 0.5) * 0.002;
      spd[i * 3 + 1] = 0.003 + Math.random() * 0.006; // gentle upward drift like embers
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, spd];
  }, [count, area]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      array[i * 3] += speeds[i * 3] * (delta * 60);
      array[i * 3 + 1] += speeds[i * 3 + 1] * (delta * 60);
      array[i * 3 + 2] += speeds[i * 3 + 2] * (delta * 60);

      // Wrap around bounds
      if (array[i * 3 + 1] > area * 0.4) {
        array[i * 3 + 1] = -area * 0.4;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#d4af37"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
