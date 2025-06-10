'use client'
import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Brain 3D model component

interface BrainProps {
  mentalHealth: number; // de 0 a 10
}

export default function Brain({ mentalHealth }: BrainProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Model mentalHealth={mentalHealth} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

function Model({ mentalHealth }: BrainProps) {
  const { scene } = useGLTF('/models/brain.glb');
  const groupRef = useRef<THREE.Group>(null);

  const normalized = THREE.MathUtils.clamp(mentalHealth / 10, 0, 1);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        const color = new THREE.Color().lerpColors(
          new THREE.Color('#3d262c'), // rojo
          new THREE.Color('#e98da1'), // verde
          normalized
        );

        material.color = color;
        material.emissive = color.clone().multiplyScalar(0.5);
        material.emissiveIntensity = normalized * 0.8;
      }
    });
  });

  return <primitive ref={groupRef} object={scene} />;
}
