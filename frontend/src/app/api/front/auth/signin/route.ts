// src/app/api/auth/signin/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1) Leemos el JSON que envía el cliente Next (email + password)
    const { email, password } = await request.json();

    // 2) Hacemos proxy a tu Express (http://localhost:4000/login)
    const expressRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // IMPORTANTE: tu Express espera { username, password } si así lo definiste
      // Aquí asumo que Express recibe { username: email, password }
      body: JSON.stringify({ username: email, password }),
    });

    // 3) Si el status NO es 200, no tratamos de parsear JSON. Leemos texto/crudo.
    if (!expressRes.ok) {
      // Intentamos leer el cuerpo como texto (puede ser “Unauthorized” u otro mensaje)
      const errorText = await expressRes.text();

      // Devolvemos status y texto de error al cliente Next
      return NextResponse.json({ error: errorText || "Error al hacer login" }, { status: expressRes.status });
    }

    // 4) Si expressRes.ok es true, parseamos el JSON normalmente
    const expressData = await expressRes.json();
    // expressData debería ser algo como: { token: "...", id: "...", nombre: "..." }

    // 5) Devolvemos el JSON al cliente Next
    return NextResponse.json(expressData, { status: 200 });
  } catch (err) {
    console.error("Error en /api/auth/signin:", err);
    return NextResponse.json({ error: (err as Error).message || "Error interno" }, { status: 500 });
  }
}