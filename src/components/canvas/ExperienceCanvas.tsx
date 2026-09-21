import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './CameraController';
import { HeroKacchiModel } from './HeroKacchiModel';
import { RestaurantEnvironment } from './RestaurantEnvironment';
import { FloatingParticles } from './FloatingParticles';
import { useStore } from '../../context/StoreContext';

export const ExperienceCanvas: React.FC = () => {
  const { scrollProgress, activeReservation, isLowPerformance } = useStore();

  // Kacchi explosion calculation (Scene 03)
  const explosionProgress = useMemo(() => {
    if (scrollProgress < 0.20) return 0;
    if (scrollProgress >= 0.20 && scrollProgress <= 0.32) {
      return (scrollProgress - 0.20) / 0.12;
    }
    if (scrollProgress > 0.32 && scrollProgress <= 0.44) {
      return 1 - (scrollProgress - 0.32) / 0.12;
    }
    return 0;
  }, [scrollProgress]);

  // Kacchi platter glide onto teak dining table
  const kacchiTransform = useMemo(() => {
    if (scrollProgress < 0.42) {
      return {
        pos: [0, 0, 0] as [number, number, number],
        scale: 1.15,
      };
    }
    if (scrollProgress >= 0.42 && scrollProgress <= 0.58) {
      const p = (scrollProgress - 0.42) / 0.16;
      return {
        pos: [0, -2.15 + (1 - p) * 2.15, 0] as [number, number, number],
        scale: 1.15 - p * 0.42,
      };
    }
    return {
      pos: [0, -2.05, 0] as [number, number, number],
      scale: 0.73,
    };
  }, [scrollProgress]);

  // Environment visibility
  const envOpacity = useMemo(() => {
    if (scrollProgress < 0.38) return 0;
    if (scrollProgress >= 0.38 && scrollProgress <= 0.50) {
      return (scrollProgress - 0.38) / 0.12;
    }
    return 1;
  }, [scrollProgress]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0.4, 5.5], fov: 42, near: 0.1, far: 50 }}
        dpr={isLowPerformance ? 1 : [1, 1.8]}
        gl={{
          antialias: !isLowPerformance,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <CameraController />

          {/* WARM CINEMATIC LIGHTING */}
          {/* Warm Ambient Foundation */}
          <ambientLight intensity={0.5} color="#f4ede2" />

          {/* Key Spotlight (Warm amber focus on Kacchi Biryani) */}
          <spotLight
            position={[4.5, 7.5, 4.5]}
            angle={0.48}
            penumbra={0.75}
            intensity={2.8}
            color="#fff2db"
            castShadow={!isLowPerformance}
          />

          {/* Terracotta/Brass Rim Light */}
          <directionalLight
            position={[-5, 3, -3]}
            intensity={2.2}
            color="#e27a52"
          />

          {/* Warm Brass Up-Glow */}
          <pointLight
            position={[0, -2.5, 2]}
            intensity={1.4}
            color="#c5a059"
            distance={8}
          />

          {/* ATMOSPHERIC GOLDEN EMBER PARTICLES */}
          <FloatingParticles count={isLowPerformance ? 35 : 100} />

          {/* HERO KACCHI BIRYANI 3D MODEL */}
          <HeroKacchiModel
            position={kacchiTransform.pos}
            scale={kacchiTransform.scale}
            explosionProgress={explosionProgress}
          />

          {/* 3D RESTAURANT ENVIRONMENT */}
          <RestaurantEnvironment
            opacity={envOpacity}
            tableLit={!!activeReservation || scrollProgress > 0.82}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
