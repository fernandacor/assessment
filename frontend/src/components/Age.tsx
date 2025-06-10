'use client';

//  Age 3D model component

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AgeProps {
  age: number;
}

export default function Growth({ age }: AgeProps) {
  return (
    <div className="w-full h-full rounded-xl">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model age={age} />
        </Suspense>
        <OrbitControls/>
      </Canvas>
    </div>
  );
}

function Model({ age }: { age: number }) {
  const gltf = useGLTF('/models/age.glb');
  const { camera, gl, scene } = useThree();
  const [reloj, setReloj] = useState<THREE.Object3D | null>(null);
  const [manecilla, setManecilla] = useState<THREE.Object3D | null>(null);
  const [hombre, setHombre] = useState<THREE.Object3D | null>(null);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.name) {
        console.log('🧩 Model part:', child.name);
      }
    });

    const relojObj = gltf.scene.getObjectByName('Reloj')?.clone();
    const manecillaObj = gltf.scene.getObjectByName('Manecilla')?.clone();

    const guessHombre = gltf.scene.children.find(
      (obj) => obj.name.toLowerCase().includes('hombre') || obj.name.toLowerCase().includes('body') || obj.name.includes('Plane')
    )?.clone();

    if (relojObj) setReloj(relojObj);
    if (manecillaObj) setManecilla(manecillaObj);
    if (guessHombre) {
      console.log('👨‍🦱 Hombre encontrado:', guessHombre.name);
      setHombre(guessHombre);
    }
  }, [gltf]);

  useEffect(() => {
    if (manecilla) {
      const angle = -Math.PI / 2 + ((age - 0) / (25 - 16)) * Math.PI;
      manecilla.rotation.z = angle;
    }

    if (hombre) {
        const minAge = 16;
        const maxAge = 25;
        const minScaleY = 1;      // Escala normal
        const maxScaleY = 2.5;    // Escala deseada a los 25 años

        const t = (age - minAge) / (maxAge - minAge); // normaliza a [0,1]
        const newZ = minScaleY + t * (maxScaleY - minScaleY);

        hombre.scale.set(1, newZ, 1); // Solo crece en Z, mantiene X e Y
        }
        }, [age, manecilla, hombre]);

  return (
    <>
      {reloj && <primitive object={reloj} />}
      {manecilla && <primitive object={manecilla} />}
      {hombre && <primitive object={hombre} />}
    </>
  );
}