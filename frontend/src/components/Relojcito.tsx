'use client';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function Relojcito() {
  const [angle, setAngle] = useState(0);

  return (
    <div className="w-full h-screen bg-white text-black relative">
      <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded shadow">
        Hora: {angle} h
      </div>
      <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Model onAngleChange={setAngle} />
        </Suspense>
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}

function Model({ onAngleChange }: { onAngleChange: (a: number) => void }) {
  const gltf = useGLTF('/models/relojcito.glb');
  const { camera, gl } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const dragging = useRef(false);
  const manecillaRef = useRef<THREE.Object3D | null>(null);
  const totalRotation = useRef(0);

  // Encuentra y guarda referencia a la manecilla
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.name.includes('Manecilla')) {
        manecillaRef.current = child;
        console.log('Manecilla encontrada:', child);
      }
    });
  }, [gltf]);

  // Lógica para arrastrar la manecilla
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!manecillaRef.current) return;

      const bounds = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(manecillaRef.current, true);
      if (intersects.length > 0) {
        dragging.current = true;
        gl.domElement.style.cursor = 'grabbing';
      }
    };

    const stepSize = Math.PI / 6; // 1 hora = 30°
    const minRotation = -Math.PI / 2; // 12 hrs posición inicial
    const maxRotation = minRotation + (24 * stepSize); // hasta 24 pasos

    const onPointerMove = (event: MouseEvent) => {
    if (!dragging.current || !manecillaRef.current) return;

    const delta = -event.movementX * 0.005; // invertido para dirección

    // Acumulamos la rotación
    totalRotation.current += delta;

    // Snap al múltiplo de 30° más cercano
    let steppedRotation = Math.round(totalRotation.current / stepSize) * stepSize;

    // Clamp entre -π/2 y maxRotation
    steppedRotation = Math.max(minRotation, Math.min(maxRotation, steppedRotation));

    totalRotation.current = steppedRotation;
    manecillaRef.current.rotation.z = steppedRotation;

    const hour = Math.round((steppedRotation - minRotation) / stepSize);
    onAngleChange(hour); // ahora angle será un entero de 0 a 24
    };

    const onPointerUp = () => {
      dragging.current = false;
      gl.domElement.style.cursor = 'default';
    };

    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointermove', onPointerMove);
    gl.domElement.addEventListener('pointerup', onPointerUp);

    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
    };
  }, [camera, gl, onAngleChange]);

  return <primitive object={gltf.scene} />;
}