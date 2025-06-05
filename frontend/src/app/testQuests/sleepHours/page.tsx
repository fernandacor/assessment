'use client';

import React, { useState } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function SleepHours() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [sleepHours, setSleepHours] = useState(7);

  const respuesta = { sleepHours: sleepHours };
  console.log("Respuesta de horas de sueño:", respuesta);
  localStorage.setItem("sleepHours", sleepHours.toString());

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-purple-800 p-8">
        <h1 className="text-2xl font-bold mb-6">Sleep Hours</h1>

        <NumericSlider
          label="Sleep Hours"
          step={0.1}
          min={0}
          max={24}
          value={sleepHours}
          onChange={setSleepHours}
        />
      </div>
      <div>
        <BotonSiguiente respondido={true} />
      </div>
    </div>
  );
}