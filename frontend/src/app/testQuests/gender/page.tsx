'use client';

import React, { useState, useEffect, use } from "react";
import Sidebar from "@/components/Sidebar";
import HumanModel from "@/components/HumanModel";
import BotonSiguiente from "@/components/TestButton";

export default function Gender() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedGender, setSelectedGender] = useState("");

  // Guardar respuesta en localStorage
  const respuesta = {selectedGender: selectedGender};
  console.log("Respuesta de género:", respuesta);
  useEffect(() => {
  localStorage.setItem("gender", selectedGender);
  }
  , [selectedGender]);

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
                              Género
                            </h1>
                          </header>

        <div className="flex flex-1 gap-4">
          <button
            onClick={() => setSelectedGender("male")}
            className={`flex-1 text-black text-2xl font-semibold transition-all duration-200 rounded-xl
              ${selectedGender === "male" ? "bg-blue-500" : "bg-blue-300 hover:bg-blue-500"}
            `}
          >
            <HumanModel gender="male" age={16} />
          </button>

          <button
            onClick={() => setSelectedGender("female")}
            className={`flex-1 text-black text-2xl font-semibold transition-all duration-200 rounded-xl
              ${selectedGender === "female" ? "bg-pink-500" : "bg-pink-300 hover:bg-pink-500"}
            `}
          >
            <HumanModel gender="female" age={16} />
          </button>
        </div>

        <div className="mt-auto self-end">
            <BotonSiguiente respondido={true} />
              </div>
      </div>
    </div>
  );
}