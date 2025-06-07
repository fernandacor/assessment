"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib"; // si quieres tiparlo
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function Model({ age }: { age: number }) {
  const gltf = useGLTF("/models/age.glb") as GLTF;

  //   const { camera, gl, scene } = useThree();
  const [reloj, setReloj] = useState<THREE.Object3D | null>(null);
  const [manecilla, setManecilla] = useState<THREE.Object3D | null>(null);
  const [hombre, setHombre] = useState<THREE.Object3D | null>(null);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const { scene } = useThree();

  // 4) Efecto para añadir la escena al canvas
  useEffect(() => {
    scene.add(gltf.scene);
  }, [gltf, scene]);

  // 5) Efecto separado para extraer y clonar partes
  useEffect(() => {
    const relojObj = gltf.scene.getObjectByName("Reloj")?.clone();
    const manecillaObj = gltf.scene.getObjectByName("Manecilla")?.clone();
    const guessHombre = gltf.scene.children
      .find(
        (obj) =>
          obj.name.toLowerCase().includes("hombre") ||
          obj.name.toLowerCase().includes("body") ||
          obj.name.includes("Plane")
      )
      ?.clone();

    if (relojObj) setReloj(relojObj);
    if (manecillaObj) setManecilla(manecillaObj);
    if (guessHombre) setHombre(guessHombre);
  }, [gltf]);

  // 6) Efecto para actualizar rotación y escala
  useEffect(() => {
    if (manecilla) {
      const angle = -Math.PI / 2 + ((age - 0) / (25 - 16)) * Math.PI;
      manecilla.rotation.z = angle;
    }
    if (hombre) {
      const t = (age - 16) / (25 - 16);
      const newZ = 1 + t * (2.5 - 1);
      hombre.scale.set(1, newZ, 1);
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
