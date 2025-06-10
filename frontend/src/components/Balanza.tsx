'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Balanza 3D model component


export default function Balanza() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-full rounded-xl">
      <Canvas camera={{ position: [0, 0, 25], fov: 20 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} />
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
  const gltf = useGLTF('/models/balanza.glb');
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
        if (clickedObject.name === 'Sphere001_2' || 
          clickedObject.name === 'Sphere001' || 
          clickedObject.name === 'Sphere001_15' || 
          clickedObject.name === 'Sphere001_17' || 
          clickedObject.name === 'Text') {
          console.log('Yes clicked');
          localStorage.setItem('academicPerformance', 'Yes');
        } else if (clickedObject.name === 'Text001' || 
          clickedObject.name === 'Sphere' || 
          clickedObject.name === 'Sphere_2') {
          console.log('No clicked');
          localStorage.setItem('academicPerformance', 'No');
    };
  }
}
    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, scene]);

  return <primitive object={gltf.scene} scale={1} />;
};