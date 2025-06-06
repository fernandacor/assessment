'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Universidad from "@/components/Universidad";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import BotonSiguiente from "@/components/TestButton";

export default function AcademicLevel() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-pink-900 text-[#C5CAE9]">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 items-center justify-center bg-[#333333]">
      <h1 className="text-2xl font-bold mb-6 text-center">Academic Level</h1>
        <Universidad />
      <div className="mt-auto self-end">
          <BotonSiguiente respondido={true} />
            </div>
      </div>
    </div>
  );
}