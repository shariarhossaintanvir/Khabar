import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroBurgerModelProps {
  explosionProgress?: number; // 0 = assembled, 1 = fully exploded
  isHovered?: boolean;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  interactiveRotation?: boolean;
}

export const HeroBurgerModel: React.FC<HeroBurgerModelProps> = ({
  explosionProgress = 0,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  interactiveRotation = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Individual layer refs for smooth animated separation
  const topBunRef = useRef<THREE.Group>(null);
  const microgreensRef = useRef<THREE.Group>(null);
  const truffleRef = useRef<THREE.Group>(null);
  const cheeseRef = useRef<THREE.Group>(null);
  const pattyRef = useRef<THREE.Group>(null);
  const tomatoRef = useRef<THREE.Group>(null);
  const onionRef = useRef<THREE.Group>(null);
  const bottomBunRef = useRef<THREE.Group>(null);

  // Generate sesame seeds positions on top bun
  const sesameSeeds = useMemo(() => {
    const seeds: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 48; i++) {
      const phi = Math.acos(1 - Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.32;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi) * 0.58;
      const z = r * Math.sin(phi) * Math.sin(theta);
      seeds.push({
        pos: [x, y, z],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      });
    }
    return seeds;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Subtle breathing float motion
    const t = state.clock.getElapsedTime();
    if (!interactiveRotation) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y += delta * 0.25;
    }

    // Smoothly apply explosion offsets based on explosionProgress (0 to 1)
    const factor = THREE.MathUtils.lerp(0, 1, explosionProgress);

    // Layer 1: Top Bun (explodes up +1.9)
    if (topBunRef.current) {
      topBunRef.current.position.y = THREE.MathUtils.lerp(0.85, 2.5, factor);
      topBunRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.12, factor);
      topBunRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.08, factor);
    }

    // Layer 2: Microgreens & Truffle Drizzle (+1.35)
    if (microgreensRef.current) {
      microgreensRef.current.position.y = THREE.MathUtils.lerp(0.68, 1.85, factor);
      microgreensRef.current.rotation.y = THREE.MathUtils.lerp(0, 0.2, factor);
    }

    // Layer 3: Truffle Aioli (+1.0)
    if (truffleRef.current) {
      truffleRef.current.position.y = THREE.MathUtils.lerp(0.55, 1.35, factor);
    }

    // Layer 4: Melted Aged Cheddar (+0.55)
    if (cheeseRef.current) {
      cheeseRef.current.position.y = THREE.MathUtils.lerp(0.38, 0.8, factor);
      cheeseRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.06, factor);
    }

    // Layer 5: Wagyu Patty (stays near center 0)
    if (pattyRef.current) {
      pattyRef.current.position.y = THREE.MathUtils.lerp(0.12, 0.15, factor);
    }

    // Layer 6: Heirloom Tomato (-0.45)
    if (tomatoRef.current) {
      tomatoRef.current.position.y = THREE.MathUtils.lerp(-0.15, -0.55, factor);
      tomatoRef.current.rotation.x = THREE.MathUtils.lerp(0, -0.09, factor);
    }

    // Layer 7: Caramelized Onion Jam (-0.85)
    if (onionRef.current) {
      onionRef.current.position.y = THREE.MathUtils.lerp(-0.32, -1.05, factor);
    }

    // Layer 8: Bottom Bun (-1.5)
    if (bottomBunRef.current) {
      bottomBunRef.current.position.y = THREE.MathUtils.lerp(-0.55, -1.65, factor);
      bottomBunRef.current.rotation.z = THREE.MathUtils.lerp(0, 0.05, factor);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* 1. TOP BRIOCHE BUN */}
      <group ref={topBunRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.35, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshStandardMaterial
            color="#8a4b16"
            roughness={0.42}
            metalness={0.08}
            envMapIntensity={1.2}
          />
        </mesh>
        {/* Bun Glaze Under-rim */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.34, 1.34, 0.1, 36]} />
          <meshStandardMaterial color="#6a380e" roughness={0.5} />
        </mesh>

        {/* Golden Sesame Seeds & 24k Gold Flakes */}
        {sesameSeeds.map((seed, i) => (
          <mesh key={i} position={seed.pos} rotation={seed.rot}>
            <sphereGeometry args={[i % 4 === 0 ? 0.038 : 0.024, 8, 8]} />
            <meshStandardMaterial
              color={i % 4 === 0 ? "#ffd700" : "#f4ebd0"}
              metalness={i % 4 === 0 ? 0.95 : 0.1}
              roughness={i % 4 === 0 ? 0.15 : 0.6}
            />
          </mesh>
        ))}
      </group>

      {/* 2. MICROGREENS & HERBS */}
      <group ref={microgreensRef}>
        {[-0.5, 0, 0.5].map((x, idx) => (
          <mesh key={idx} position={[x * 1.4, 0, (idx % 2 === 0 ? 0.3 : -0.3)]} rotation={[0.2, idx * 1.5, 0.1]}>
            <coneGeometry args={[0.28, 0.06, 5]} />
            <meshStandardMaterial color="#2d5a27" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* 3. BLACK TRUFFLE DRIZZLE */}
      <group ref={truffleRef}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.85, 0.08, 12, 28]} />
          <meshStandardMaterial
            color="#1a1410"
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* 4. MELTED AGED CHEDDAR */}
      <group ref={cheeseRef}>
        <mesh position={[0, 0, 0]} rotation={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.9, 0.08, 1.9]} />
          <meshStandardMaterial
            color="#ffaa00"
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
        {/* Drooping Corners */}
        {[-0.85, 0.85].map((x, i) => (
          <mesh key={i} position={[x, -0.12, 0]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
            <boxGeometry args={[0.35, 0.18, 0.9]} />
            <meshStandardMaterial color="#f09b00" roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* 5. A5 WAGYU BEEF PATTY */}
      <group ref={pattyRef}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.42, 1.42, 0.45, 36]} />
          <meshStandardMaterial
            color="#2a140d"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
        {/* Caramelized Sear Lines */}
        {[-0.6, -0.2, 0.2, 0.6].map((offset, idx) => (
          <mesh key={idx} position={[offset, 0.23, 0]} rotation={[0, 0.4, 0]}>
            <boxGeometry args={[0.08, 0.02, 2.2]} />
            <meshStandardMaterial color="#110704" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 6. CHARRED HEIRLOOM TOMATO */}
      <group ref={tomatoRef}>
        <mesh castShadow>
          <cylinderGeometry args={[1.35, 1.35, 0.18, 32]} />
          <meshStandardMaterial
            color="#b22222"
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>
      </group>

      {/* 7. CARAMELIZED ONION JAM */}
      <group ref={onionRef}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.28, 1.3, 0.1, 24]} />
          <meshStandardMaterial
            color="#3d1f14"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
      </group>

      {/* 8. BOTTOM BRIOCHE BUN */}
      <group ref={bottomBunRef}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.32, 1.25, 0.38, 36]} />
          <meshStandardMaterial
            color="#7a4214"
            roughness={0.48}
            metalness={0.06}
          />
        </mesh>
      </group>
    </group>
  );
};
