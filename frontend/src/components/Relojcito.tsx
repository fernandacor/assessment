'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import NumericSlider from './NumericSlider'; // asegúrate de que el path esté correcto

export default function Relojcito() {
  const [hour, setHour] = useState(0);

  return (
    <div className="w-full h-screen bg-black text-white relative">
      <div className="absolute top-4 left-4 z-10 w-80">
        <NumericSlider
          label="Selecciona la hora"
          min={0}
          max={24}
          value={hour}
          onChange={setHour}
        />
      </div>
      <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model hour={hour} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Model({ hour }: { hour: number }) {
  const gltf = useGLTF('/models/relojcito.glb');
  const relojRef = React.useRef<THREE.Object3D | null>(null);
  const manecillaRef = React.useRef<THREE.Object3D | null>(null);

  React.useEffect(() => {
    const reloj = gltf.scene.getObjectByName('Reloj');
    const manecilla = gltf.scene.getObjectByName('Manecilla');
    if (reloj && manecilla) {
      relojRef.current = reloj.clone();
      manecillaRef.current = manecilla.clone();
    }
  }, [gltf]);

  // Actualizar rotación de manecilla cuando cambia la hora
  React.useEffect(() => {
    if (manecillaRef.current) {
      const angle = -Math.PI / 2 + (hour * (Math.PI / 6)); // empieza en 12h (arriba)
      manecillaRef.current.rotation.z = angle;
    }
  }, [hour]);

  return (
    <>
      {relojRef.current && <primitive object={relojRef.current} />}
      {manecillaRef.current && <primitive object={manecillaRef.current} />}
    </>
  );
}