// src/hooks/useAuthGuard.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Decodifica el payload de un JWT
function parseJwt(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function useAuthGuard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Si no hay token, redirigir a /auth/signin
      router.push("/signin"); // fíjate que tu ruta es /auth/signin
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded || typeof decoded.exp !== "number") {
      // Token mal formado
      localStorage.removeItem("token");
      router.push("/signin");
      return;
    }

    // Verificar expiración
    const ahora = Math.floor(Date.now() / 1000);
    if (decoded.exp < ahora) {
      // Token expirado
      localStorage.removeItem("token");
      router.push("/signin");
      return;
    }

    // Token válido → podemos dejar renderizar
    setLoading(false);
  }, [router]);

  return { loading };
}
