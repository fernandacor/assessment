// src/app/api/auth/signin/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Leemos el JSON que envía el SignInForm
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y password son obligatorios." },
        { status: 400 }
      );
    }

    // Hacemos POST a /login de tu backend Express
    const expressRes = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const expressData = await expressRes.json();

    if (!expressRes.ok) {
      // Reenviamos 401 o 500 según lo que haya devuelto Express
      return NextResponse.json(expressData, { status: expressRes.status });
    }

    // Si login OK: { token, email, name } por ejemplo
    return NextResponse.json(expressData, { status: 200 });
  } catch (err) {
    console.error("Error en /api/auth/signin:", err);
    return NextResponse.json(
      { error: "Error interno en proxy de signin" },
      { status: 500 }
    );
  }
}
