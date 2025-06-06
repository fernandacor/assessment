'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface TermometroProps {
  conflictos: number;
}

export default function Termometro({ conflictos }: TermometroProps) {
  return (
      <div className="w-full h-full rounded-xl">
        <Canvas camera={{ position: [0, 0, 8], fov: 25}}>
          <ambientLight intensity={2} />
          <directionalLight position={[2, 2, 2]} />
          <Suspense fallback={null}>
            <Model conflictos={conflictos} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
  );
}

function Model({ conflictos }: TermometroProps) {
  const gltf = useGLTF('/models/termometro.glb');
  const liquidoRef = useRef<THREE.Object3D | null>(null);

  // Buscar y guardar referencia al objeto "Liquido"
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.name === 'Liquido') {
        liquidoRef.current = child;
      }
    });
  }, [gltf]);

  // Aplicar escalado cuando cambie `conflictos`
  useEffect(() => {
    const scale = Math.max(0.01, conflictos / 5);
    const obj = liquidoRef.current;
    if (obj) {
      obj.scale.y = scale;
      // obj.position.z = -1 + scale * 2; // ajusta según el modelo
    }
  }, [conflictos]);

  return <primitive object={gltf.scene} />;
}