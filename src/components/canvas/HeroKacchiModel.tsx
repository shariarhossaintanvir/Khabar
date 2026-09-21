import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroKacchiModelProps {
  explosionProgress?: number; // 0 = assembled, 1 = fully exploded
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  interactiveRotation?: boolean;
}

export const HeroKacchiModel: React.FC<HeroKacchiModelProps> = ({
  explosionProgress = 0,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  interactiveRotation = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Layer Refs for smooth vertical separation
  const berestaRef = useRef<THREE.Group>(null);
  const topRiceRef = useRef<THREE.Group>(null);
  const spicesRef = useRef<THREE.Group>(null);
  const potatoRef = useRef<THREE.Group>(null);
  const muttonRef = useRef<THREE.Group>(null);
  const baseRiceRef = useRef<THREE.Group>(null);
  const platterRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Points>(null);

  // Procedural Basmati Rice Grains Distribution
  const riceGrains = useMemo(() => {
    const grains: { pos: [number, number, number]; rot: [number, number, number]; color: string; size: number }[] = [];
    const colors = ['#fdfaf3', '#fef4dc', '#ffd269', '#fca311', '#fff8e7'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 1.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.max(0, 0.4 - (radius * 0.22) + (Math.random() - 0.5) * 0.15);
      grains.push({
        pos: [x, y, z],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        color: colors[i % colors.length],
        size: 0.05 + Math.random() * 0.03,
      });
    }
    return grains;
  }, []);

  // Fried Onion Beresta Ribbons
  const berestaRibbons = useMemo(() => {
    const ribbons: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.1;
      ribbons.push({
        pos: [Math.cos(angle) * radius, 0.05 + Math.random() * 0.15, Math.sin(angle) * radius],
        rot: [Math.random() * 0.6, Math.random() * Math.PI, Math.random() * 0.6],
      });
    }
    return ribbons;
  }, []);

  // Steam Particles Setup
  const [steamPositions, steamSpeeds] = useMemo(() => {
    const count = 45;
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.4;
      pos[i * 3 + 1] = 0.5 + Math.random() * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      spd[i] = 0.008 + Math.random() * 0.012;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();

    // Subtle breathing float motion
    if (!interactiveRotation) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.06;
      groupRef.current.rotation.y += delta * 0.22;
    }

    // Animate steam particles rising
    if (steamRef.current) {
      const attr = steamRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = attr.array as Float32Array;
      for (let i = 0; i < 45; i++) {
        array[i * 3 + 1] += steamSpeeds[i] * (delta * 60);
        array[i * 3] += Math.sin(t * 2 + i) * 0.003;
        if (array[i * 3 + 1] > 2.8) {
          array[i * 3 + 1] = 0.5;
          array[i * 3] = (Math.random() - 0.5) * 1.2;
          array[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        }
      }
      attr.needsUpdate = true;
    }

    // Smooth Lerp Separation for Exploded View
    const factor = THREE.MathUtils.lerp(0, 1, explosionProgress);

    // 1. Beresta (+2.2)
    if (berestaRef.current) {
      berestaRef.current.position.y = THREE.MathUtils.lerp(0.55, 2.4, factor);
      berestaRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.4, factor);
    }
    // 2. Top Basmati Rice (+1.65)
    if (topRiceRef.current) {
      topRiceRef.current.position.y = THREE.MathUtils.lerp(0.4, 1.75, factor);
    }
    // 3. Whole Shahi Spices (+1.2)
    if (spicesRef.current) {
      spicesRef.current.position.y = THREE.MathUtils.lerp(0.3, 1.25, factor);
      spicesRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.15, factor);
    }
    // 4. Desi Aloor Dum Potato (+0.7)
    if (potatoRef.current) {
      potatoRef.current.position.y = THREE.MathUtils.lerp(0.2, 0.75, factor);
      potatoRef.current.position.x = THREE.MathUtils.lerp(0.45, 0.75, factor);
      potatoRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.25, factor);
    }
    // 5. Tender Mutton Core (+0.1)
    if (muttonRef.current) {
      muttonRef.current.position.y = THREE.MathUtils.lerp(0.12, 0.15, factor);
      muttonRef.current.position.x = THREE.MathUtils.lerp(-0.35, -0.65, factor);
    }
    // 6. Base Basmati Rice Bed (-0.65)
    if (baseRiceRef.current) {
      baseRiceRef.current.position.y = THREE.MathUtils.lerp(0, -0.65, factor);
    }
    // 7. Shahi Brass Platter (-1.4)
    if (platterRef.current) {
      platterRef.current.position.y = THREE.MathUtils.lerp(-0.15, -1.45, factor);
      platterRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.05, factor);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* 1. CRISPY BERESTA LAYER */}
      <group ref={berestaRef}>
        {berestaRibbons.map((b, i) => (
          <mesh key={i} position={b.pos} rotation={b.rot} castShadow>
            <boxGeometry args={[0.22, 0.02, 0.04]} />
            <meshStandardMaterial
              color="#54250e"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* 2. TOP BASMATI RICE MOUND WITH SAFFRON VEINS */}
      <group ref={topRiceRef}>
        <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
          <coneGeometry args={[1.45, 0.45, 32, 2]} />
          <meshStandardMaterial
            color="#fef7e6"
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>
        {/* Individual Basmati grains scattered */}
        {riceGrains.slice(0, 45).map((grain, idx) => (
          <mesh key={idx} position={grain.pos} rotation={grain.rot}>
            <capsuleGeometry args={[grain.size * 0.5, grain.size * 2.2, 4, 8]} />
            <meshStandardMaterial color={grain.color} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* 3. WHOLE SHAHI SPICES (Cinnamon, Green Cardamom, Cloves) */}
      <group ref={spicesRef}>
        {/* Cinnamon Quill Stick */}
        <mesh position={[0.2, 0.1, -0.3]} rotation={[0.2, 0.8, 0.4]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.65, 12]} />
          <meshStandardMaterial color="#6a3516" roughness={0.8} />
        </mesh>
        {/* Green Cardamom Pods */}
        {[-0.3, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0.15, (i === 0 ? 0.35 : -0.2)]} rotation={[0.4, i * 2, 0.1]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#66824a" roughness={0.7} />
          </mesh>
        ))}
        {/* Cloves */}
        {[-0.1, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0.18, 0.2]} rotation={[0.1, i, 0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
            <meshStandardMaterial color="#2c150c" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 4. DESI ALOOR DUM POTATO (Signature Golden Spiced Potato) */}
      <group ref={potatoRef} position={[0.45, 0.2, 0.25]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.42, 28, 24]} />
          <meshStandardMaterial
            color="#e0952d"
            roughness={0.38}
            metalness={0.08}
            envMapIntensity={1.2}
          />
        </mesh>
        {/* Subtle roasted marks on the potato */}
        {[-0.2, 0.15].map((off, i) => (
          <mesh key={i} position={[off, 0.18, 0.25]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#88420e" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 5. SLOW-COOKED MUTTON PIECES (Tender Bone-in chunks) */}
      <group ref={muttonRef} position={[-0.35, 0.15, -0.15]}>
        {/* Main Braised Meat Chunk */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.52, 0.65, 0.48, 18]} />
          <meshStandardMaterial
            color="#3a1c11"
            roughness={0.75}
            metalness={0.12}
          />
        </mesh>
        {/* Bone marrow cross-section */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
          <meshStandardMaterial color="#ede3cb" roughness={0.5} />
        </mesh>
        {/* Caramelized spiced crust glaze */}
        <mesh position={[0, -0.05, 0.2]}>
          <boxGeometry args={[0.65, 0.35, 0.3]} />
          <meshStandardMaterial color="#271007" roughness={0.65} metalness={0.2} />
        </mesh>
      </group>

      {/* 6. BASE BASMATI RICE BED */}
      <group ref={baseRiceRef}>
        <mesh receiveShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.75, 1.85, 0.32, 36]} />
          <meshStandardMaterial
            color="#fdf6e2"
            roughness={0.6}
            metalness={0.05}
          />
        </mesh>
        {/* Bottom Rice Grains */}
        {riceGrains.slice(45).map((grain, idx) => (
          <mesh key={idx} position={grain.pos} rotation={grain.rot}>
            <capsuleGeometry args={[grain.size * 0.5, grain.size * 2, 4, 8]} />
            <meshStandardMaterial color={grain.color} roughness={0.55} />
          </mesh>
        ))}
      </group>

      {/* 7. HAND-HAMMERED SHAHI BRASS PLATTER (Thali) */}
      <group ref={platterRef}>
        {/* Platter Base */}
        <mesh receiveShadow position={[0, -0.14, 0]}>
          <cylinderGeometry args={[2.1, 1.95, 0.14, 48]} />
          <meshStandardMaterial
            color="#c5a059"
            roughness={0.22}
            metalness={0.92}
            envMapIntensity={2.2}
          />
        </mesh>
        {/* Platter Etched Traditional Decorative Rim */}
        <mesh position={[0, -0.06, 0]}>
          <ringGeometry args={[1.98, 2.12, 48]} />
          <meshStandardMaterial
            color="#d4af37"
            roughness={0.18}
            metalness={0.96}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Under-rim Depth Shadow */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[1.9, 1.9, 0.05, 36]} />
          <meshStandardMaterial color="#6a5223" roughness={0.6} />
        </mesh>
      </group>

      {/* 8. SUBTLE REALISTIC STEAM PARTICLES */}
      <points ref={steamRef} visible={explosionProgress < 0.4}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={45}
            array={steamPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#fbf8f2"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
