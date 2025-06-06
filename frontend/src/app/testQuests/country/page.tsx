'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Mapamundi from "@/components/Mapamundi";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import BotonSiguiente from "@/components/TestButton";

export default function Country() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-pink-900 text-[#C5CAE9]">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 items-center justify-center bg-[#333333]">
        <h1 className="text-2xl font-bold mb-6 text-center">Country of Residence</h1>
        <Mapamundi />
        <div className="mt-auto self-end">
          <BotonSiguiente respondido={true} />
            </div>
      </div>
    </div>
  );
}