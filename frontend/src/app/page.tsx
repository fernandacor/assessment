"use client";

import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import UserSurveyForm from "@/components/UserSurveyForm";
import { Play } from "lucide-react";
import React, { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthGuard>
      <div className="flex h-screen w-full">
        <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-col h-auto w-full bg-blue-800">
          {/* <div className="w-auto h-screen p-4 bg-blue-400 justify-center items-center flex flex-col"> */}
            <UserSurveyForm />
            {/* <img src="/LogoCompilaCompi.png" alt="Logo" className="w-90 h-auto bg-purple-800" />
              <h1 className="text-4xl font-bold mb-4">Welcome to the App</h1>
              <p className="text-gray-300">This is a simple layout with a sidebar and a main content area.</p> */}
          {/* </div> */}
        </div>
      </div>
    </AuthGuard>
  );
}
