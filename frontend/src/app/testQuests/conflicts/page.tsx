'use client';

import React, { useState, useEffect } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function Conflicts() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [conflictos, setConflictos] = useState(7);

  const respuesta = { conflicts: conflictos };
  console.log("Conflictos:", respuesta);
  useEffect (() => {
    localStorage.setItem("conflicts", conflictos.toString());
  }
  , [conflictos]);

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-purple-800 p-8">
        <h1 className="text-2xl font-bold mb-6">Conflicts</h1>

        <NumericSlider
          label="Conflicts"
          step={0.5}
          min={0}
          max={5}
          value={conflictos}
          onChange={setConflictos}
        />
      </div>
      <div>
        <BotonSiguiente respondido={true} />
      </div>
    </div>
  );
}