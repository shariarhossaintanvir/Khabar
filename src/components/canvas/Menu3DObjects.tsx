import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. CHITTAGONG BEEF KALA BHUNA MODEL
export const KalaBhunaModel: React.FC<{ scale?: number; rotation?: [number, number, number] }> = ({
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* Traditional Clay Handi Vessel */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.4, 1.0, 0.5, 32]} />
        <meshStandardMaterial color="#3d2319" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Handi Lip Rim */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[1.4, 0.1, 16, 36]} />
        <meshStandardMaterial color="#4a2a1e" roughness={0.8} />
      </mesh>

      {/* Dark Caramelized Beef Chunks */}
      {[-0.45, 0, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.2, (i % 2 === 0 ? 0.25 : -0.2)]} rotation={[0.2, i * 1.2, 0.1]} castShadow>
          <boxGeometry args={[0.55, 0.35, 0.45]} />
          <meshStandardMaterial color="#1a0c06" roughness={0.7} metalness={0.2} />
        </mesh>
      ))}

      {/* Whole Roasted Garlic Cloves */}
      {[-0.2, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.35, (i === 0 ? -0.3 : 0.3)]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#e5c898" roughness={0.4} />
        </mesh>
      ))}

      {/* Whole Dried Fried Red Chilies */}
      {[-0.1, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.38, 0]} rotation={[0.4, i * 2, 0.3]}>
          <cylinderGeometry args={[0.03, 0.04, 0.55, 8]} />
          <meshStandardMaterial color="#881515" roughness={0.35} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// 2. PADMA SHORSHE ILISH FISH MODEL
export const ShorsheIlishModel: React.FC<{ scale?: number; rotation?: [number, number, number] }> = ({
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* Traditional Oval Brass Fish Dish */}
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.7, 1.5, 0.16, 36]} />
        <meshStandardMaterial color="#c5a059" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Stone-Ground Yellow Mustard Gravy Base */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.06, 32]} />
        <meshStandardMaterial color="#d4b02a" roughness={0.45} metalness={0.08} />
      </mesh>

      {/* Hilsa Fish Cut Steak (Silvery with dark center line) */}
      <group position={[0, 0.16, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.95, 0.95, 0.22, 24]} />
          <meshStandardMaterial color="#d6dde5" roughness={0.25} metalness={0.65} envMapIntensity={2} />
        </mesh>
        {/* Fish Central Bone Opening */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#f0e9d5" roughness={0.5} />
        </mesh>
      </group>

      {/* Slit Fresh Green Chilies */}
      {[-0.6, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.24, (i === 0 ? 0.35 : -0.35)]} rotation={[0, i * 1.5, 0.2]}>
          <cylinderGeometry args={[0.035, 0.045, 0.65, 8]} />
          <meshStandardMaterial color="#2d8819" roughness={0.3} />
        </mesh>
      ))}

      {/* Mustard Oil Droplet Sheen */}
      <mesh position={[0.4, 0.1, 0.4]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#cca010" roughness={0.1} metalness={0.2} transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// 3. GOLDA CHINGRI MALAI CURRY MODEL
export const ChingriMalaiModel: React.FC<{ scale?: number; rotation?: [number, number, number] }> = ({
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* Terracotta Serving Bowl */}
      <mesh receiveShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[1.55, 1.1, 0.35, 32]} />
        <meshStandardMaterial color="#7a3821" roughness={0.8} />
      </mesh>

      {/* Creamy Coconut Milk & Turmeric Gravy */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.06, 32]} />
        <meshStandardMaterial color="#e59835" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Jumbo Golda Tiger Prawn Body (Curved) */}
      <group position={[0, 0.22, 0]} rotation={[0.4, 0, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.65, 0.22, 16, 28, Math.PI * 1.2]} />
          <meshStandardMaterial color="#e25822" roughness={0.4} metalness={0.15} />
        </mesh>
        {/* Prawn Head Cluster */}
        <mesh position={[0.6, 0.1, 0]}>
          <coneGeometry args={[0.26, 0.55, 12]} />
          <meshStandardMaterial color="#b3360b" roughness={0.45} />
        </mesh>
        {/* Antennae */}
        <mesh position={[0.8, 0.25, 0.1]} rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
          <meshStandardMaterial color="#cc4410" />
        </mesh>
      </group>
    </group>
  );
};

// 4. TRADITIONAL CLAY CUP BORHANI MODEL
export const ClayBorhaniModel: React.FC<{ scale?: number; rotation?: [number, number, number] }> = ({
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.32;
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* Traditional Matir Cup / Bati */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.55, 1.35, 32, 1, true]} />
        <meshStandardMaterial color="#8b4526" roughness={0.9} />
      </mesh>
      {/* Cup Base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.54, 0.54, 0.15, 32]} />
        <meshStandardMaterial color="#6a3219" roughness={0.9} />
      </mesh>

      {/* Spiced Green-Tinted Borhani Curd Drink */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.71, 0.54, 1.15, 32]} />
        <meshStandardMaterial color="#bccca3" roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Roasted Cumin & Black Salt Flecks on surface */}
      {[-0.2, 0.15, -0.1, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 1.03, (i % 2 === 0 ? 0.2 : -0.2)]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#3a2214" roughness={0.8} />
        </mesh>
      ))}

      {/* Fresh Green Mint Leaf Garnish */}
      <mesh position={[0.1, 1.08, 0]} rotation={[0.4, 0.2, 0.6]}>
        <coneGeometry args={[0.18, 0.06, 5]} />
        <meshStandardMaterial color="#2d8819" roughness={0.4} />
      </mesh>
    </group>
  );
};

// 5. SHAHI FIRNI IN CLAY POT (Matir Shora)
export const ShahiFirniModel: React.FC<{ scale?: number; rotation?: [number, number, number] }> = ({
  scale = 1,
  rotation = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.32;
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      {/* Earthen Clay Shora Dish */}
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.45, 1.25, 0.28, 36]} />
        <meshStandardMaterial color="#824227" roughness={0.92} />
      </mesh>

      {/* Thick Creamy Saffron Rice Pudding */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.08, 36]} />
        <meshStandardMaterial color="#fff6dd" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Pure Silver Leaf (Vark) Accent */}
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[0.45, 0.45]} />
        <meshStandardMaterial color="#e6edf2" metalness={0.98} roughness={0.12} envMapIntensity={2.5} />
      </mesh>

      {/* Chopped Emerald Pistachio & Almond Dust */}
      {[-0.4, 0.35, -0.2, 0.45, 0.1].map((x, idx) => (
        <mesh key={idx} position={[x, 0.1, (idx % 2 === 0 ? 0.3 : -0.35)]}>
          <boxGeometry args={[0.08, 0.02, 0.08]} />
          <meshStandardMaterial color={idx % 2 === 0 ? "#5a8c3d" : "#e8c89b"} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};
