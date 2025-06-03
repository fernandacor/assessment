'use client'

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@monaco-editor/react"
import { Play } from "lucide-react";

type FileTab= {
  id: string;
  name: string;
  content: string;
};

export default function CodeEditor() {

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<FileTab[]>([
    { id: 'main.py', name: 'main.py', 
      content: 
        '# Código inicial:'
        + '\nprint("Hola, mundo!")\n\n'},
    { id: 'prueba1.py', name: 'prueba1.py', 
      content: '# Prueba de tabbing jiji'
        + '\nprint("Esto es una prueba")\n\n'},
            { id: 'prueba2.py', name: 'prueba2.py', 
      content: '# Prueba de tabbing jiji'
        + '\nprint("Esto es una prueba")\n\n'},
            { id: 'prueba3.py', name: 'prueba3.py', 
      content: '# Prueba de tabbing jiji'
        + '\nprint("Esto es una prueba")\n\n'},    { id: 'prueba.py', name: 'prueba.py', 
      content: '# Prueba de tabbing jiji'
        + '\nprint("Esto es una prueba")\n\n'}
  ]);
  const [activeTabId, setActiveTabId] = useState('main.ts');

  const handleTabClick = (id: string) => setActiveTabId(id);
  
  const handleTabClose = (id: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== id));
    if (id === activeTabId && tabs.length > 1) {
      const newActive = tabs.find((t) => t.id !== id);
      setActiveTabId(newActive?.id || '');
    }
  };
  
  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex h-screen w-full bg-yellow-900 text-white">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)} />
      
      {/* Tabs */}
      <div className="flex flex-col h-auto w-full">
        {/* Tabs arriba */}

        <div className="flex gap-x-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-3 py-1 rounded-t cursor-pointer ${
                tab.id === activeTabId ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="mr-2">{tab.name}</span>
              <button
                className="text-sm text-red-400 hover:text-red-600 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTabClose(tab.id);
                }}
              >
                ×
              </button>
            </div>
          ))}

          <button className="ml-auto mr-3 text-purple-200 hover:text-purple-200 hover:bg-purple-800 rounded-md p-2"> 
            <Play /> 
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-0.5 bg-purple-300">
          {activeTab && (
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={activeTab.content}
              onChange={(value) =>
                setTabs((prev) =>
                  prev.map((tab) =>
                    tab.id === activeTab.id ? { ...tab, content: value || '' } : tab
                  )
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}