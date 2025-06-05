'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
// import Mapamundi from "@/components/Mapamundi";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import BotonSiguiente from "@/components/TestButton";

export default function Country() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-pink-900 text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 items-center justify-center bg-yellow-600">
        {/* <Mapamundi /> */}
      </div>
      <div>
        <BotonSiguiente respondido={true} />
      </div>
    </div>
  );
}