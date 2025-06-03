'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // <--- ¡Esto faltaba!

  return (
    <div className="min-h-screen bg-blue-800 from-slate-900 to-slate-800 text-white">
      {/* <Navbar /> */}
      {/* <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Compilacompi</h1>
        <p className="text-lg text-slate-400">Tu mejor compi para compilar.</p>
      </header> */}
      <div className="flex h-screen bg-red-700">
        <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 p-6 overflow-auto">

          <div className="text-green">
            <input type="text" placeholder="Escribe tu código aquí..." className="w-full h-full p-2 mb-4 bg-slate-800 text-white rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}