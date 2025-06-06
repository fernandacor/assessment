'use client'
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface LucecitaProps {
  sleepHours: number;
}

export function Lucecita({ sleepHours }: LucecitaProps) {
//   const maxSleep = 12;
//   const lightIntensity = Math.max(0, Math.min(10, (maxSleep - sleepHours) * (10 / maxSleep)));
const maxIntensity = 30;
const lightIntensity = maxIntensity * (1 - sleepHours / 24);

  return (
    <div className="w-full h-full rounded-xl">
      <Canvas camera={{ position: [0, 0, 17], fov: 50 }}>
        <Suspense fallback={null}>
          <Model intensity={lightIntensity} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function Model({ intensity }: { intensity: number }) {
  const { scene } = useGLTF('/models/sleep.glb');
  const lightRef = useRef<THREE.SpotLight | null>(null);

  React.useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.SpotLight && child.name === 'Spot') {
        child.angle = Math.PI / 5;
        child.penumbra = 0.4;
        child.distance = 25;
        child.decay = 1;
        child.intensity = intensity; // 🔥 Setea el valor inicial para que no empiece en 0
        lightRef.current = child;
      }
    });
  }, [scene, intensity]);

  useFrame(() => {
    if (lightRef.current) {
        lightRef.current.intensity += (intensity - lightRef.current.intensity) * 0.1;
    }
  });

  return <primitive object={scene} />;
}