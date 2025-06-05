// // universidad
// 'use client'
// import React, { Suspense, useEffect, useState } from 'react';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// export default function Universidad() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) return null;

//   return (
//     <div className="w-full h-full rounded-xl">
//       <Canvas shadows camera={{position: [-8, 5, 20], fov: 30 }}>
//         <ambientLight intensity={1} />
//         <directionalLight castShadow position={[10,10,10]} />
//         <Suspense fallback={null}>
//           <Model />
//         </Suspense>
//         <OrbitControls />
//       </Canvas>
//     </div>
//   );
// }

// function Model() {
//   const { scene, camera, gl } = useThree();
//   const gltf = useGLTF('/models/universidadPrueba2.glb');
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();

//   useEffect(() => {
//     const handleClick = (event: { clientX: number; clientY: number; }) => {
//       // Normaliza coordenadas del mouse
//       const bounds = gl.domElement.getBoundingClientRect();
//       mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
//       mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(scene.children, true);

//       if (intersects.length > 0) {
//         const clickedObject = intersects[0].object;
//         console.log('Clicked object:', clickedObject.name);
//         if (clickedObject.name === 'Cube001_3') {
//           console.log('Clicked: Highschool');
//           localStorage.setItem('academicLevel', 'High School');
//         } else if (clickedObject.name === 'Cube001') {
//           console.log('Clicked: Graduate');
//           localStorage.setItem('academicLevel', 'Graduate');
//         } else if (clickedObject.name === 'Cylinder') {
//           console.log('Clicked: Graduate');
//           localStorage.setItem('academicLevel', 'Graduate');
//         } else if (clickedObject.name === 'Cube002_1') {
//           console.log('Clicked: Undergraduate');
//           localStorage.setItem('academicLevel', 'Undergraduate');
//         } else if (clickedObject.name === 'Cube001_2') {
//           console.log('Clicked: HighSchool');
//           localStorage.setItem('academicLevel', 'High School');
//         };}
// }

//     gl.domElement.addEventListener('click', handleClick);
//     return () => gl.domElement.removeEventListener('click', handleClick);
//   }, [camera, gl, scene]);

//   return <primitive object={gltf.scene} scale={1} />;
// }