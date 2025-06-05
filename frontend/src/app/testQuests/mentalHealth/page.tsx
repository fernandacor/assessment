'use client';

import React, { useState } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function MentalHealth() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mentalHealth, setMentalHealth] = useState(7);

  const respuesta = { mentalHealth: mentalHealth };
  console.log("Respuesta de salud mental:", respuesta);
  localStorage.setItem("mentalHealth", mentalHealth.toString());

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-purple-800 p-8">
        <h1 className="text-2xl font-bold mb-6">Mental Health Score</h1>

        <NumericSlider
          label="Self-rated Mental Health Score"
          min={0}
          max={10}
          value={mentalHealth}
          onChange={setMentalHealth}
        />
        <BotonSiguiente respondido={true} />
      </div>
    </div>
  );
}