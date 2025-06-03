'use client'

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {Play} from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-col h-auto w-full bg-blue-800">
          <button className="ml-auto mr-3 text-purple-200 hover:text-purple-200 hover:bg-purple-800 rounded-md p-2"> 
            <Play /> 
          </button>
          <div className="w-auto h-screen p-4 bg-blue-400 justify-center items-center flex flex-col">
            <img src="/globe.svg" alt="Logo" className="w-35 h-35 mb-4" />
            <h1 className="text-4xl font-bold mb-4">Welcome to the App</h1>
            <p className="text-gray-300">This is a simple layout with a sidebar and a main content area.</p>
          </div>
        </div>
    </div>
  );
}