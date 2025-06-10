'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Relojcito 3D model component

interface RelojcitoProps {
  hour: number;
}

export default function Relojcito({ hour }: RelojcitoProps) {
  return (
    <div className="w-full h-full rounded-xl">
      <Canvas camera={{ position: [0, 0, 10], fov: 25 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model hour={hour} />
        </Suspense>
        <OrbitControls/>
      </Canvas>
    </div>
  );
}

function Model({ hour }: { hour: number }) {
  const gltf = useGLTF('/models/relojcito.glb');
  const [reloj, setReloj] = useState<THREE.Object3D | null>(null);
  const [manecilla, setManecilla] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    const relojObj = gltf.scene.getObjectByName('Reloj')?.clone();
    const manecillaObj = gltf.scene.getObjectByName('Manecilla')?.clone();
    if (relojObj && manecillaObj) {
      setReloj(relojObj);
      setManecilla(manecillaObj);
    }
  }, [gltf]);

  useEffect(() => {
    if (manecilla) {
      const angle = -Math.PI / 2 + hour * (Math.PI / 12); // 0h = 12h en punto
      manecilla.rotation.z = angle;
    }
  }, [hour, manecilla]);

  return (
    <>
      {reloj && <primitive object={reloj} />}
      {manecilla && <primitive object={manecilla} />}
    </>
  );
}