// mapamundi
'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function Mapamundi() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-full rounded-xl">
      <Canvas shadows camera={{position: [-2, 0, 15], fov: 10 }}>
        <ambientLight intensity={1} />
        <directionalLight castShadow position={[10,10,10]} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function Model() {
  const { scene, camera, gl } = useThree();
  const gltf = useGLTF('/models/mapamundi.glb');
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const handleClick = (event: { clientX: number; clientY: number; }) => {
      // Normaliza coordenadas del mouse
      const bounds = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked:', clickedObject.name);
        // if (clickedObject.name === 'app1') {
        //   console.log('App 1 clicked');
        // }
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, scene]);

  return <primitive object={gltf.scene} scale={1} />;
}