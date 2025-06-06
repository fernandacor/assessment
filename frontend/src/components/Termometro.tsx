'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface TermometroProps {
  conflictos: number;
}

export default function Termometro({ conflictos }: TermometroProps) {
  return (
    <div className="w-full h-[600px] flex flex-col items-center gap-4">
      <div className="w-full h-[500px] rounded-xl">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={2} />
          <directionalLight position={[2, 2, 2]} />
          <Suspense fallback={null}>
            <Model conflictos={conflictos} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

function Model({ conflictos }: TermometroProps) {
  const { scene } = useThree();
  const gltf = useGLTF('/models/termometro.glb');
  const [liquido, setLiquido] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const liquidoObj = gltf.scene.getObjectByName('Liquido')?.clone();
    if (liquidoObj) {
      setLiquido(liquidoObj);
    }
  }, [gltf]);

  // Escalado del líquido basado en conflictos (de 0 a 5 → altura 0 a 1)
  const scaleY = conflictos / 5;

  return (
    <group>
      {/* Todo el modelo base */}
      <primitive object={gltf.scene} />

      {/* Líquido separado con escala modificada */}
      {liquido && (
        <primitive
          object={liquido}
          scale={[1, scaleY, 1]}
        />
      )}
    </group>
  );
}