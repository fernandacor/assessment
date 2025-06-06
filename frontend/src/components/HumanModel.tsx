// // components/HumanModel.tsx
// 'use client';

// import React, { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';

// interface HumanModelProps {
//   gender: "male" | "female";
//   age: number;
// }

// export default function HumanModel({ gender, age}: HumanModelProps) {
//   console.log('Rendering HumanModel');

//   const minScale = 1;
//   const maxScale = 5;
//   const scale = minScale + ((age - 1) / 99) * (maxScale - minScale);

//   return (
//     <div className="w-full h-[500px] rounded-xl">
//       <Canvas camera={{ position: [20,5,5] }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[-2, -2, -2]} />
//         <Suspense fallback={null}>
//           <Model gender={gender} scale={scale} />
//         </Suspense>
//         <OrbitControls />
//       </Canvas>
//     </div>
//   );
// }

// interface ModelProps {
//   scale: number;
//   gender: "male" | "female";
// }

// function Model({ scale, gender }: ModelProps) {
//   const path = gender === 'male' ? '/models/man.glb' : '/models/woman.glb';
//   const gltf = useGLTF(path);
//   return (
//     <primitive
//       object={gltf.scene}
//       scale={[1, scale, 1]}
//       position={[0, (scale - 1) / 2, 0]} // mantiene los pies en y = 0
//     />
//   );
// }