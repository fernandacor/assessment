'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import CelSinApps from "@/components/CelConApps";
import BotonSiguiente from "@/components/TestButton";

export default function FavPlatform() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
              {/* Sidebar */}
              <Sidebar
                isOpen={!isSidebarOpen}
                toggle={() => setSidebarOpen(!isSidebarOpen)}
              />
        
              {/* Main content */}
              <div className="flex flex-col flex-1 bg-[#333333] p-8 relative">
                <h1 className="text-2xl font-bold mb-6 text-center">Favorite Platfrom</h1>
        
                <div className="flex justify-center mt-4 flex-1">
                  <div className="w-full max-w-4xl bg-[#444] rounded-2xl shadow-lg p-6 min-h-[65vh] flex items-center justify-center">
                    <CelSinApps />
                  </div>
                </div>
    
            {/* Button at the bottom-right corner of the page */}
            <div className="absolute bottom-6 right-6">
              <BotonSiguiente respondido={true} />
            </div>
          </div>
        </div>
  );
}
