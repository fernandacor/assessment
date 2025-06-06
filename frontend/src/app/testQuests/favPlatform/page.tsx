'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CelSinApps from "@/components/CelConApps";
import BotonSiguiente from "@/components/TestButton";

export default function FavPlatform() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen w-full bg-pink-900 text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 items-center justify-center bg-yellow-600">
        <CelSinApps />
      </div>
      <div>
        <BotonSiguiente respondido={true} />
      </div>
    </div>
  );
}