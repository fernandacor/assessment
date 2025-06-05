'use client';

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import HumanModel from "@/components/HumanModel";
import BotonSiguiente from "@/components/TestButton";

export default function Gender() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedGender, setSelectedGender] = useState("");

  // Guardar respuesta en localStorage
  const respuesta = {selectedGender: selectedGender};
  console.log("Respuesta de género:", respuesta);
  localStorage.setItem("gender", selectedGender);

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar
        isOpen={!isSidebarOpen}
        toggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-col h-full w-full bg-yellow-700 p-8 overflow-hidden">
        <h1 className="text-2xl font-bold mb-6">Gender</h1>

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

        <div className="mt-6">
          <BotonSiguiente respondido={selectedGender !== ""} />
        </div>
      </div>
    </div>
  );
}