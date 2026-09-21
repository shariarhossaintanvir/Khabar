import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../context/StoreContext';

export const CameraController: React.FC = () => {
  const { scrollProgress, inspectingItem } = useStore();
  const currentPos = useRef(new THREE.Vector3(0, 0.4, 5.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // If user is currently inspecting a product in 3D modal, let modal handle it
    if (inspectingItem) return;

    // Pointer parallax offsets (subtle)
    const px = state.pointer.x * 0.35;
    const py = state.pointer.y * 0.25;

    // Determine target position based on scrollProgress (0 to 1)
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3(0, 0, 0);

    if (scrollProgress < 0.12) {
      // Scene 01: The Awakening (Push in from darkness)
      const p = scrollProgress / 0.12;
      targetPos.set(px * 0.4, THREE.MathUtils.lerp(0.5, 0.2, p) + py * 0.3, THREE.MathUtils.lerp(6.2, 4.2, p));
      targetLook.set(0, THREE.MathUtils.lerp(0.2, 0, p), 0);
    } else if (scrollProgress < 0.25) {
      // Scene 02: Food Reveal (Orbiting around hero dish)
      const p = (scrollProgress - 0.12) / 0.13;
      const angle = p * Math.PI * 0.65;
      const radius = THREE.MathUtils.lerp(4.2, 3.6, p);
      targetPos.set(Math.sin(angle) * radius + px, 0.4 + py * 0.4, Math.cos(angle) * radius);
      targetLook.set(0, 0.1, 0);
    } else if (scrollProgress < 0.40) {
      // Scene 03: Ingredient Explosion (Camera pulls back slightly to frame layers)
      const p = (scrollProgress - 0.25) / 0.15;
      targetPos.set(px * 0.6, THREE.MathUtils.lerp(0.4, 0.7, p) + py, THREE.MathUtils.lerp(3.6, 5.0, p));
      targetLook.set(0, THREE.MathUtils.lerp(0.1, 0.3, p), 0);
    } else if (scrollProgress < 0.55) {
      // Scene 04 & 05: Morph & Enter Restaurant Interior
      const p = (scrollProgress - 0.40) / 0.15;
      targetPos.set(
        THREE.MathUtils.lerp(0, -1.2, p) + px,
        THREE.MathUtils.lerp(0.7, 1.4, p) + py,
        THREE.MathUtils.lerp(5.0, 5.8, p)
      );
      targetLook.set(0, THREE.MathUtils.lerp(0.3, -0.2, p), 0);
    } else if (scrollProgress < 0.72) {
      // Scene 06 & 08: 3D Menu Showcase & Categories
      const p = (scrollProgress - 0.55) / 0.17;
      targetPos.set(THREE.MathUtils.lerp(-1.2, 0.8, p) + px, 1.1 + py, 4.6);
      targetLook.set(0, 0, 0);
    } else if (scrollProgress < 0.85) {
      // Scene 09: Kinetic Storytelling (Swooping camera)
      const p = (scrollProgress - 0.72) / 0.13;
      targetPos.set(
        THREE.MathUtils.lerp(0.8, -1.5, p) + px * 0.8,
        THREE.MathUtils.lerp(1.1, 1.8, p) + py,
        THREE.MathUtils.lerp(4.6, 5.4, p)
      );
      targetLook.set(0, -0.1, 0);
    } else {
      // Scene 10 & 15: Table Reservation & Grand Finale
      const p = (scrollProgress - 0.85) / 0.15;
      targetPos.set(
        THREE.MathUtils.lerp(-1.5, 0, p) + px * 0.5,
        THREE.MathUtils.lerp(1.8, 1.5, p) + py * 0.5,
        THREE.MathUtils.lerp(5.4, 6.2, p)
      );
      targetLook.set(0, -0.4, 0);
    }

    // Smooth dampening interpolation
    currentPos.current.lerp(targetPos, delta * 2.8);
    currentLookAt.current.lerp(targetLook, delta * 2.8);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
};
