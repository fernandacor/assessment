'use client';

import React, { useEffect, useState } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function MentalHealth() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [mentalHealth, setMentalHealth] = useState(7);

  useEffect(() => {
    localStorage.setItem("mentalHealth", mentalHealth.toString());
  }, [mentalHealth]);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
      {/* Sidebar */}
      <Sidebar
        isOpen={!isSidebarOpen}
        toggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 bg-[#333333] p-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-center">Self-rated Mental Health Score</h1>

        <div className="flex justify-center mt-4 flex-1">
          <div className="w-full max-w-4xl bg-[#444] rounded-2xl shadow-lg p-6 min-h-[65vh] flex items-center justify-center">
            {/* 3D Model placeholder */}
          </div>
        </div>

        {/* Bottom bar with slider centered and button right */}
        <div className="flex items-center justify-between mt-6 px-8">
          {/* Left spacer */}
          <div className="w-1/3"></div>

          {/* Slider centered */}
          <div className="w-1/3 flex justify-center">
            <NumericSlider
              label="Self-rated Mental Health Score"
              min={0}
              max={10}
              value={mentalHealth}
              onChange={setMentalHealth}
            />
          </div>

          {/* Button right */}
          <div className="w-1/3 flex justify-end">
            <BotonSiguiente respondido={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
