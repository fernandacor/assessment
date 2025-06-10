import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Coraoznes 3D model component

export default function Corazoncito() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-full rounded-xl">
      <Canvas shadows camera={{position: [0, 0, 20], fov: 23 }}>
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
  const path = '/models/corazones.glb';
  const gltf = useGLTF(path);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const handleClick = (event: { clientX: number; clientY: number; }) => {
      const bounds = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked object:', clickedObject.name);
        if (clickedObject.name === 'single_1' || clickedObject.name === 'single_2') {
          console.log('Clicked: single');
          localStorage.setItem('relationshipStatus', 'Single');
        } else if (clickedObject.name === 'complicated_1' || clickedObject.name === 'complicated_2') {
          console.log('Clicked: complicated');
          localStorage.setItem('relationshipStatus', 'Complicated');
        } else if (clickedObject.name === 'relationship_1' || clickedObject.name === 'relationship_2') {
          console.log('Clicked: relationship');
          localStorage.setItem('relationshipStatus', 'In Relationship');
        } }
}

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, scene]);

  return <primitive object={gltf.scene} scale={1} />;
}