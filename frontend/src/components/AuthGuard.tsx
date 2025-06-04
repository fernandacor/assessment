// src/components/AuthGuard.tsx
"use client";

import React, { ReactNode } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { loading } = useAuthGuard();

  if (loading) {
    // Mientras validamos el token, mostramos lo que quieras:
    return <p className="text-center py-8">Verificando credenciales…</p>;
  }

  // Si loading = false, el token es válido
  return <>{children}</>;
}
