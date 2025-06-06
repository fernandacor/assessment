'use client';

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";
import Relojcito from "@/components/Relojcito";
import NumericSlider from "@/components/NumericSlider";

export default function DailyUsage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    localStorage.setItem("dailyUsage", usage.toString());
  }, [usage]);

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-purple-800 p-8">
        <h1 className="text-2xl font-bold mb-6">Daily Usage</h1>

        <div className="mt-8">
          <Relojcito hour={usage} />
        </div>
        
        <NumericSlider
          label="Daily Usage (hours)"
          min={0}
          max={24}
          step={1}
          value={usage}
          onChange={setUsage}
        />

      </div>

      <div>
        <BotonSiguiente respondido={true} />
      </div>
    </div>
  );
}