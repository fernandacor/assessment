'use client';

import React, { useEffect, useState } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function DailyUsage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [usage, setUsage] = useState(7);

  const respuesta = { dailyUsage: usage };
  console.log("Respuesta de uso diario:", respuesta);
  useEffect(() => {
    localStorage.setItem("dailyUsage", usage.toString());
  }
  , [usage]);

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-purple-800 p-8">
        <h1 className="text-2xl font-bold mb-6">Daily Usage</h1>

        <NumericSlider
          label="Daily Usage (hours)"
          step={0.5}
          min={0}
          max={24}
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