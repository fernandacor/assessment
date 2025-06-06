'use client';

import React, { useState, useEffect, use } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function SleepHours() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [sleepHours, setSleepHours] = useState(7);

  const respuesta = { sleepHours: sleepHours };
  console.log("Respuesta de horas de sueño:", respuesta);
  useEffect(() => {
  localStorage.setItem("sleepHours", sleepHours.toString());
  }
  , [sleepHours]);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-[#333333] p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Average nightly sleep hours</h1>

        <NumericSlider
          label="Sleep Hours"
          step={0.1}
          min={0}
          max={24}
          value={sleepHours}
          onChange={setSleepHours}
        />
        <div className="mt-auto self-end">
          <BotonSiguiente respondido={true} />
            </div>
      </div>
    </div>
  );
}