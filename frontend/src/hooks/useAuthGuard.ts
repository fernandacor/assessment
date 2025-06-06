// src/hooks/useAuthGuard.ts
"use client";

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
  const [loading, setLoading] = useState(true);

  // 1) Chequeo inicial de existencia/expiración
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/signin");
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded || typeof decoded.exp !== "number") {
      localStorage.removeItem("token");
      window.location.replace("/signin");
      return;
    }

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem("token");
      window.location.replace("/signin");
      return;
    }

    setLoading(false);
  }, []);

  // 2) Listener para cambios desde OTRA pestaña
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "token" && e.newValue === null) {
        window.location.replace("/signin");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 3) Polling ligero en ESTA pestaña
  useEffect(() => {
    const interval = setInterval(() => {
      if (!localStorage.getItem("token")) {
        clearInterval(interval);
        window.location.replace("/signin");
      }
    }, 200); // cada 0.5 segundos

    return () => clearInterval(interval);
  }, []);

  return { loading };
}
