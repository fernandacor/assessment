'use client'
import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';


export default function CelSinApps() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-full rounded-xl">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
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
  const gltf = useGLTF('/models/celConApps.glb');
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
        if (clickedObject.name === 'Cube014_1') {
          console.log('Facebook clicked');
          localStorage.setItem('favPlatform', 'Facebook');
        } else if (clickedObject.name === 'Cube013_1') {
          console.log('TikTok clicked');
          localStorage.setItem('favPlatform', 'TikTok');
        } else if (clickedObject.name === 'Instagram_icon') {
          console.log('Instagram clicked');
          localStorage.setItem('favPlatform', 'Instagram');
        } else if (clickedObject.name === 'logosnapchat') {
          console.log('Snapchat clicked');
          localStorage.setItem('favPlatform', 'Snapchat');
        } else if (clickedObject.name === 'Cube010_1') {
          console.log('Whatsapp clicked');
          localStorage.setItem('favPlatform', 'Whatsapp');
        } else if (clickedObject.name === 'Cube009_1') {
          console.log('Twitter clicked');
          localStorage.setItem('favPlatform', 'Twitter');
        } else if (clickedObject.name === 'Cube007_1') {
          console.log('Linkedin clicked');
          localStorage.setItem('favPlatform', 'Linkedin');
        } else if (clickedObject.name === 'logoyoutubecropped') {
          console.log('Youtube clicked');
          localStorage.setItem('favPlatform', 'Youtube');
        } else if (clickedObject.name === 'Cube004_1') {
          console.log('Kakaotalk clicked'); 
          localStorage.setItem('favPlatform', 'Kakaotalk');
        } else if (clickedObject.name === 'Cube006_1') {
          console.log('Line clicked');
          localStorage.setItem('favPlatform', 'Line');
        } else if (clickedObject.name === 'Cube005_1') {
          console.log('VKontakte clicked');
          localStorage.setItem('favPlatform', 'VKontakte');
        } else if (clickedObject.name === 'Cube003_1') {
          console.log('Wechat clicked');
          localStorage.setItem('favPlatform', 'Wechat');
        }
    };
}
    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, scene]);

  return <primitive object={gltf.scene} scale={1} />;
};