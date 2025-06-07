// app/testQuests/age/page.tsx
'use client';

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

// Aquí cargas el componente que monta el Canvas + Model,
// sin SSR, y con fallback mientras carga el chunk.
const Growth = dynamic<{ age: number }>(
  () => import('@/components/Age'),
  {
    ssr: false,
    loading: () => <span className="text-white">Cargando 3D…</span>,
  }
);

export default function AgePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [age, setAge] = useState(16);

  useEffect(() => {
    localStorage.setItem("age", age.toString());
  }, [age]);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
      <Sidebar
        isOpen={!isSidebarOpen}
        toggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-col flex-1 bg-[#333333] p-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-center">Age in Years</h1>

        <div className="flex justify-center mt-4 flex-1">
          <div className="w-full max-w-4xl bg-[#444] rounded-2xl shadow-lg p-6 min-h-[65vh] flex items-center justify-center">
            {/* Ya no usas Suspense aquí */}
            <Growth age={age} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 px-8">
          <div className="w-1/3" />
          <div className="w-1/3 flex justify-center">
            <NumericSlider
              label="Age"
              min={16}
              max={25}
              value={age}
              onChange={setAge}
            />
          </div>
          <div className="w-1/3 flex justify-end">
            <BotonSiguiente respondido={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
