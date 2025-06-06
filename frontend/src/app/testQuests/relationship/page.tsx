'use client';

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import BotonSiguiente from "@/components/TestButton";
import Corazoncito from "@/components/Corazoncito";

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

        <div className="flex justify-center mt-4 flex-1">
          <div className="w-full max-w-4xl bg-[#444] rounded-2xl shadow-lg p-6 min-h-[65vh] flex items-center justify-center">
            <Corazoncito/>
          </div>
        </div>

        {/* Next button at bottom-right */}
        <div className="mt-4 flex justify-end">
          <BotonSiguiente respondido={true} />
        </div>
      </div>
    </div>
  );
}
