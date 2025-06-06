'use client';

import React, { useEffect, useState } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";
import Brain from '@/components/Brain'

export default function MentalHealth() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mentalHealth, setMentalHealth] = useState(7);

  useEffect(() => {
    localStorage.setItem("mentalHealth", mentalHealth.toString());
  }, [mentalHealth]);

  return (


    <div className="relative w-full h-screen overflow-hidden flex">

  {/* Sidebar */}
  <Sidebar
    isOpen={!isSidebarOpen}
    toggle={() => setSidebarOpen(!isSidebarOpen)}
  />

  {/* Blobs fondo */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-0 left-20 w-72 h-72 bg-[#355C7D] rounded-full opacity-70 mix-blend-multiply filter blur-3xl scale-150" />
    <div className="absolute top-5 right-40 w-72 h-72 bg-[#A8E6CF] rounded-full opacity-70 mix-blend-multiply filter blur-3xl scale-150" />
    <div className="absolute bottom-10 left-[30%] w-72 h-72 bg-[#a9b1e0] rounded-full opacity-70 mix-blend-multiply filter blur-3xl scale-150" />
    <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A8E6CF] rounded-full opacity-70 mix-blend-multiply filter blur-3xl scale-150" />
    <div className="absolute top-32 right-10 w-72 h-72 bg-[#a9b1e0] rounded-full opacity-70 mix-blend-multiply filter blur-3xl scale-150" />
  </div>

  {/* Contenido principal centrado */}
  <div className="flex flex-col items-center justify-center flex-1 z-10 px-6 py-12 space-y-6">

    {/* Header */}
    <header className="bg-gradient-to-r from-[#355C7D] via-[#C5CAE9] to-[#A8E6CF] text-white py-4 px-8 rounded-xl shadow-md w-full max-w-3xl">
      <h1 className="text-3xl font-bold text-center font-mono drop-shadow-md text-shadow-lg">
        Estado de salud mental
      </h1>
    </header>

    {/* Modelo 3D o contenedor */}
    <div className="w-full max-w-4xl bg-gray-800/30 rounded-xl shadow-xl backdrop-blur-md p-6 min-h-[60vh] flex items-center justify-center ring-2 ring-[#333333]/70">
      <Brain mentalHealth={mentalHealth} />
    </div>

    {/* Slider + botón */}
    <div className="flex items-center justify-between w-full max-w-4xl px-4">
      
      {/* Spacer izquierda */}
      <div className="w-1/3" />
      
      {/* Slider centered */}
      <div className="w-1/3 flex justify-center">
            <NumericSlider
              label="Puntuación de salud mental" 
              min={0}
              max={10}
              value={mentalHealth}
              onChange={setMentalHealth}
            />
          </div>

      {/* Botón derecha */}
      <div className="w-1/3 flex justify-end">
        <BotonSiguiente respondido={true} />
      </div>
    </div>
  </div>
</div>

  );
  
}

