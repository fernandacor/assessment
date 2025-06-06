'use client';

import React, { useState, useEffect, use } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";
import { Lucecita } from "@/components/Lucecita";

export default function SleepHours() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [sleepHours, setSleepHours] = useState(0);

  const respuesta = { sleepHours: sleepHours };
  console.log("Respuesta de horas de sueño:", respuesta);
  useEffect(() => {
  localStorage.setItem("sleepHours", sleepHours.toString());
  }
  , [sleepHours]);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
              {/* Sidebar */}
              <Sidebar
                isOpen={!isSidebarOpen}
                toggle={() => setSidebarOpen(!isSidebarOpen)}
              />
        
              {/* Main content */}
              <div className="flex flex-col flex-1 bg-[#333333] p-8 relative">
                <h1 className="text-2xl font-bold mb-6 text-center">Average nightly sleep hours</h1>
        
                <div className="flex justify-center mt-4 flex-1">
                  <div className="w-full max-w-4xl bg-[#444] rounded-2xl shadow-lg p-6 min-h-[65vh] flex items-center justify-center">
                    <Lucecita sleepHours={sleepHours} />
                  </div>
                </div>
        
                {/* Bottom bar with slider centered and button right */}
                <div className="flex items-center justify-between mt-6 px-8">
                  {/* Left spacer */}
                  <div className="w-1/3"></div>
        
                  {/* Slider centered */}
                  <div className="w-1/3 flex justify-center">
                  <NumericSlider
                      label="Sleep Hours"
                      step={0.1}
                      min={0}
                      max={24}
                      value={sleepHours}
                      onChange={setSleepHours}
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