'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

const questions = [
  "age",
  "gender",
  "academicLevel",
  "country",
  "dailyUsage",
  "favPlatform",
  "academicPerformance",
  "sleepHours",
  "mentalHealth",
  "relationship",
  "conflicts",
];

export default function WineRecs() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar isOpen={!isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col h-auto w-full bg-blue-800 p-8">
        <h1 className="text-2xl font-bold mb-6">Selecciona una pregunta</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {questions.map((question) => (
            <Link
              key={question}
              href={`/testQuests/${question}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-center transition-colors duration-200"
            >
              {question}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}