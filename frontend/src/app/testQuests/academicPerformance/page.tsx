'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function AcademicPerformance() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [academicPerformance, setAcademicPerformance] = useState("");

    const respuesta = { academicPerformance: academicPerformance };
    console.log("Respuesta de rendimiento académico:", respuesta);
    localStorage.setItem("academicPerformance", academicPerformance);

    return (
    <div className="flex h-screen w-full text-white">
        <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-col h-auto w-full bg-yellow-700 p-8">
            <h1 className="text-2xl font-bold mb-6">¿Does it affect academic performance?</h1>
            <div className="flex flex-1">
          <button className="flex-1 bg-red-300 text-black text-2xl font-semibold hover:bg-red-500 transition-all duration-200"
            onClick={() => setAcademicPerformance("Yes")}>
            Yes
          </button>
          <button className="flex-1 bg-green-300 text-black text-2xl font-semibold hover:bg-green-500 transition-all duration-200"
            onClick={() => setAcademicPerformance("No")}>
            No
          </button>
        </div>
        </div>
      <div>
        <BotonSiguiente respondido={true} />
      </div>
    </div>
    );
}