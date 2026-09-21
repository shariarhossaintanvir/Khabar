import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RestaurantEnvironmentProps {
  opacity?: number;
  tableLit?: boolean;
}

export const RestaurantEnvironment: React.FC<RestaurantEnvironmentProps> = ({
  opacity = 1,
  tableLit = false,
}) => {
  const pradipLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (pradipLightRef.current) {
      // Natural gentle oil lamp flame flicker
      const t = state.clock.getElapsedTime();
      const flicker = Math.sin(t * 7) * 0.12 + Math.cos(t * 11) * 0.08;
      pradipLightRef.current.intensity = (tableLit ? 4.8 : 2.2) + flicker;
    }
  });

  return (
    <group position={[0, -2.2, 0]} visible={opacity > 0.05}>
      {/* 1. CHITTAGONG TEAK WOOD & BRASS DINING TABLE */}
      <group position={[0, 0, 0]}>
        {/* Table Top (Warm polished teak) */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[3.2, 3.2, 0.16, 64]} />
          <meshStandardMaterial
            color="#2a170f"
            roughness={0.28}
            metalness={0.2}
            envMapIntensity={1.8}
          />
        </mesh>
        {/* Traditional Hand-Cut Brass Inlay Ring */}
        <mesh position={[0, 0.09, 0]}>
          <ringGeometry args={[2.92, 3.02, 64]} />
          <meshStandardMaterial
            color="#c5a059"
            roughness={0.25}
            metalness={0.92}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Outer Brass Bevel Lip */}
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[3.22, 3.22, 0.14, 64]} />
          <meshStandardMaterial
            color="#947833"
            roughness={0.3}
            metalness={0.88}
          />
        </mesh>
        {/* Heavy Teak Pedestal */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[0.35, 0.65, 3.6, 32]} />
          <meshStandardMaterial
            color="#1b0e09"
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
        {/* Table Brass Foot Base */}
        <mesh position={[0, -3.5, 0]}>
          <cylinderGeometry args={[1.85, 1.85, 0.16, 32]} />
          <meshStandardMaterial
            color="#2a170f"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
      </group>

      {/* 2. TRADITIONAL BRASS OIL LAMP (Pradip) */}
      <group position={[1.4, 0.28, -0.8]}>
        {/* Brass Tiered Lamp Base */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.18, 24]} />
          <meshStandardMaterial color="#c5a059" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Pradip Oil Bowl */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.24, 0.15, 0.12, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Warm Golden Flame */}
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshBasicMaterial color="#ffaa11" />
        </mesh>
        {/* Point Light from Flame */}
        <pointLight
          ref={pradipLightRef}
          color={tableLit ? "#ffaa33" : "#ff7700"}
          distance={6.5}
          decay={2}
          intensity={tableLit ? 4.8 : 2.2}
        />
      </group>

      {/* 3. WOVEN BRASS & BAMBOO PENDANT LIGHTS */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={i} position={[x, 5.5, -1]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 3, 8]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh>
            <coneGeometry args={[0.75, 0.65, 32, 1, true]} />
            <meshStandardMaterial
              color="#3a2216"
              roughness={0.65}
              metalness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <coneGeometry args={[0.7, 0.55, 32, 1, true]} />
            <meshStandardMaterial
              color="#c5a059"
              roughness={0.2}
              metalness={0.92}
              side={THREE.DoubleSide}
            />
          </mesh>
          <spotLight
            color="#ff9922"
            intensity={tableLit ? 3.8 : 2.4}
            angle={0.68}
            penumbra={0.7}
            distance={9.5}
            position={[0, 0, 0]}
            target-position={[x * 0.4, -2.5, 0]}
          />
        </group>
      ))}

      {/* 4. TROPICAL FIDDLE-LEAF / PALM ACCENT GREENERY */}
      {[-4.8, 4.8].map((x, idx) => (
        <group key={idx} position={[x, -0.5, -3]}>
          {/* Terracotta Plant Planter Pot */}
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[0.55, 0.4, 1.2, 24]} />
            <meshStandardMaterial color="#884224" roughness={0.88} />
          </mesh>
          {/* Lush Bengal Green Leaves */}
          {[0, 1.2, 2.4, 3.6, 4.8].map((rot, lIdx) => (
            <mesh key={lIdx} position={[0, -0.4 + lIdx * 0.25, 0]} rotation={[0.4, rot, 0.25]}>
              <boxGeometry args={[0.35, 0.02, 0.75]} />
              <meshStandardMaterial color="#1b3b2b" roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 5. TERRACOTTA BRICK & ACCENT WALL */}
      <mesh position={[0, 2, -6]} receiveShadow>
        <planeGeometry args={[24, 14]} />
        <meshStandardMaterial
          color="#140f0d"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
};
