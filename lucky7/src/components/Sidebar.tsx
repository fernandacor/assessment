'use client'

import React from "react";
import { ChevronLeft, ChevronRight, Code, FileText, Settings, LogIn} from "lucide-react";

// Sidebar component
export default function Sidebar({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"} h-full flex flex-col`}>
      <div className="flex justify-end p-2">
        <button onClick={toggle} className="text-slate-300 hover:text-white">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex flex-col space-y-4 mt-4 px-2">
        <SidebarItem icon={<Code />} label="Editor" isOpen={isOpen} />
        <SidebarItem icon={<FileText />} label="Archivos" isOpen={isOpen} />
        <SidebarItem icon={<Settings />} label="Configuración" isOpen={isOpen} />
        <SidebarItem icon={<LogIn />} label="Sign In" isOpen={isOpen} />
        <SidebarItem icon={<Code />} label="Sign Up" isOpen={isOpen} />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, isOpen }: { icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <div className="flex items-center space-x-4 p-2 rounded hover:bg-slate-700 cursor-pointer">
      <div className="text-slate-300">{icon}</div>
      {isOpen && <span className="text-sm">{label}</span>}
    </div>
  );
}