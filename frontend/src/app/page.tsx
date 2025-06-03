import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
        <main className="flex flex-col items-center justify-center h-screen w-full text-white bg-slate-900 p-6">
      <h1 className="text-4xl font-bold mb-4">Compilacompi</h1>
      <p className="mb-6 text-slate-400">Tu mejor compi para compilar.</p>
      <CodeEditor />
    </main>
  );
}