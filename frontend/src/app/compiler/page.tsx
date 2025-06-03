'use client'
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function Compiler() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
        <div className="flex h-screen w-full bg-blue-50">
            <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-col items-center justify-center h-full w-full text-white bg-pink-500 p-6">
                <p> AST </p>
                <p> Tabla de símbolos</p>
            </div>
        </div>

    </div>
  );
}