// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1) Leemos el JSON que envía el cliente (tu SignUpForm)
    const body = await request.json();
    const {
      email,
      password,
      confirmPassword,
      username,
    } = body as {
      email: string;
      password: string;
      confirmPassword: string;
      username: string;
    };
    console.log(body);
    // 2) Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios en el body." },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "La contraseña y su confirmación no coinciden." },
        { status: 400 }
      );
    }

    // 3) Hacemos POST a tu backend Express para crear el usuario
    //    (supongo que tu variable de entorno NEXT_PUBLIC_BACKEND_URL = "http://localhost:4000")
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const createRes = await fetch(`${backendUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const createData = await createRes.json();
    if (!createRes.ok) {
      // Si Express devolvió error en el signup (409, 400, etc.), lo reenviamos al cliente
      return NextResponse.json(createData, { status: createRes.status });
    }
  } catch (err) {
    console.error("Error en /api/auth/signup:", err);
    return NextResponse.json(
      { error: "Error interno en proxy de signup" },
      { status: 500 }
    );
  }
}
