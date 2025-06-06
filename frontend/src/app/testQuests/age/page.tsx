'use client';

import React, { use, useEffect, useState } from "react";
import NumericSlider from "@/components/NumericSlider";
import Sidebar from "@/components/Sidebar";
// import HumanModel from "@/components/HumanModel";
import BotonSiguiente from "@/components/TestButton";

export default function Age() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [age, setAge] = useState(16);

  const respuesta = {age: age};
  console.log("Respuesta de edad:", respuesta);
  useEffect(() => {
  localStorage.setItem("age", age.toString());
  }
  , [age]);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-full w-full bg-[#333333] p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Age in Years</h1>

        {/* <HumanModel gender="male" age={age} /> */}

        <NumericSlider
          label="Age"
          min={16}
          max={25}
          value={age}
          onChange={setAge}
        />
        <div className="mt-auto self-end">
          <BotonSiguiente respondido={true} />
            </div>
      </div>
    </div>
  );
}