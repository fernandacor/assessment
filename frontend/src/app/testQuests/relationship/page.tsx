'use client';

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";

export default function Relationship() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [relationshipStatus, setRelationshipStatus] = useState("");

  useEffect(() => {
    localStorage.setItem("relationshipStatus", relationshipStatus);
  }, [relationshipStatus]);

  return (
    <div className="flex h-screen w-full text-[#C5CAE9]">
      <Sidebar
        isOpen={!isSidebarOpen}
        toggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-col h-full w-full bg-[#333333] p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          Relationship Status
        </h1>

        {/* Big buttons row */}
        <div className="flex flex-1 gap-4">
          <button
            className="flex-1 bg-green-300 text-black text-2xl font-semibold hover:bg-green-500 transition-all duration-200 rounded-xl py-6"
            onClick={() => setRelationshipStatus("Single")}
          >
            Single
          </button>
          <button
            className="flex-1 bg-red-300 text-black text-2xl font-semibold hover:bg-red-500 transition-all duration-200 rounded-xl py-6"
            onClick={() => setRelationshipStatus("Complicated")}
          >
            Complicated
          </button>
          <button
            className="flex-1 bg-red-300 text-black text-2xl font-semibold hover:bg-red-500 transition-all duration-200 rounded-xl py-6"
            onClick={() => setRelationshipStatus("In a Relationship")}
          >
            In a Relationship
          </button>
        </div>

        {/* Next button at bottom-right */}
        <div className="mt-4 flex justify-end">
          <BotonSiguiente respondido={true} />
        </div>
      </div>
    </div>
  );
}
