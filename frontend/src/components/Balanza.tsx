'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

export default function Balanza() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  return (
    <div className="w-full h-[500px] bg-white text-black relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <BalanzaModel onAnswer={setAnswer} />
        </Suspense>
      </Canvas>

      {answer && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded">
          Respuesta: {answer.toUpperCase()}
        </div>
      )}
    </div>
  );
}

function BalanzaModel({ onAnswer }: { onAnswer: (res: 'yes' | 'no') => void }) {
  const { nodes } = useGLTF('/balanza.glb');
  const travesanoRef = useRef<THREE.Mesh>(null);

  const handleHover = (side: 'left' | 'right') => {
    const angle = side === 'left' ? -0.2 : 0.2;
    gsap.to(travesanoRef.current!.rotation, { z: angle, duration: 0.4 });
  };

  const handleOut = () => {
    gsap.to(travesanoRef.current!.rotation, { z: 0, duration: 0.4 });
  };

  const handleClick = (side: 'yes' | 'no') => {
    onAnswer(side);
    const angle = side === 'yes' ? -0.3 : 0.3;
    gsap.to(travesanoRef.current!.rotation, { z: angle, duration: 0.8 });
  };

  return (
    <group>
      <primitive object={nodes.Base} />
      <primitive object={nodes.Columna} />
      <primitive object={nodes.Travesano} ref={travesanoRef} />

      {/* Platillo Izquierdo */}
      <primitive
        object={nodes.PlatilloIzq}
        name="PlatilloIzq"
        onPointerOver={() => handleHover('left')}
        onPointerOut={handleOut}
        onClick={() => handleClick('yes')}
      />

      {/* Platillo Derecho */}
      <primitive
        object={nodes.PlatilloDer}
        name="PlatilloDer"
        onPointerOver={() => handleHover('right')}
        onPointerOut={handleOut}
        onClick={() => handleClick('no')}
      />
    </group>
  );
}