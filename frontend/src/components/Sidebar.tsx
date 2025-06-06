// src/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  Settings,
  LogIn,
  LogOut,
  BrainCircuit,
  Grape,
  User,
  Home,
  ClipboardList
} from "lucide-react";

export default function Sidebar({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    // 1) Borra el JWT y datos guardados
    localStorage.removeItem("token");
    router.push("/signin");
    router.refresh();
  };

  return (
    <div
      className={`bg-[#355C7D] text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } h-full flex flex-col`}
    >
      <div className="flex justify-end p-2">
        <button onClick={toggle} className="text-slate-300 hover:text-white">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex flex-col space-y-4 mt-4 px-2">
        <SidebarItem
          icon={<Home />}
          label="Home"
          isOpen={isOpen}
          href="/landing"
        />
        <SidebarItem
          icon={<User />}
          label="Profile"
          isOpen={isOpen}
          href="/profile"
        />
        <SidebarItem
          icon={<ClipboardList />}
          label="Log Out"
          isOpen={isOpen}
          href="/userSurvey"
        />
        <SidebarItem
          icon={<LogOut />}
          label="Log Out"
          isOpen={isOpen}
          onClick={handleLogout}
        />
      </nav>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  href?: string;
  onClick?: () => void;
};

function SidebarItem({
  icon,
  label,
  isOpen,
  href,
  onClick,
}: SidebarItemProps) {
  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center space-x-4 p-2 rounded hover:bg-slate-700"
      >
        <div className="text-slate-300">{icon}</div>
        {isOpen && <span className="text-sm">{label}</span>}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex w-full items-center space-x-4 p-2 rounded hover:bg-slate-700 text-left"
      >
        <div className="text-slate-300">{icon}</div>
        {isOpen && <span className="text-sm">{label}</span>}
      </button>
    );
  }

  // Si no hay ni href ni onClick, solo mostramos ícono y label sin acción
  return (
    <div className="flex items-center space-x-4 p-2 rounded hover:bg-slate-700 cursor-default">
      <div className="text-slate-300">{icon}</div>
      {isOpen && <span className="text-sm">{label}</span>}
    </div>
  );
}
