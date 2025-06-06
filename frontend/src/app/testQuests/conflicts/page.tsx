'use client';

import React, { useState, useEffect } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function Conflicts() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [conflictos, setConflictos] = useState(0);

  const respuesta = { conflicts: conflictos };
  console.log("Conflictos:", respuesta);
  useEffect (() => {
    localStorage.setItem("conflicts", conflictos.toString());
  }
  , [conflictos]);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-[#333333] p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Number of relationship conflicts due to social media</h1>

        <NumericSlider
          label="Conflicts"
          step={0.5}
          min={0}
          max={5}
          value={conflictos}
          onChange={setConflictos}
        />
        <div className="mt-auto self-end">
    <BotonSiguiente respondido={true} />
      </div>
      </div>
    </div>
  );
}