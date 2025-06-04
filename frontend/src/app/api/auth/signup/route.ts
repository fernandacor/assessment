// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Leemos el JSON que nos envía el cliente (tu SignUpForm)
    const body = await request.json();
    const {
      email,
      password,
      confirmPassword,
      name,
      surname,
      address,
      birthdate,
    } = body as {
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
      surname: string;
      address: string;
      birthdate: string;
    };

    // Validaciones básicas:
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !name ||
      !surname ||
      !address ||
      !birthdate
    ) {
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

    // Hacemos POST a tu backend Express (por ejemplo, http://localhost:4000/users)
    const expressRes = await fetch("http://localhost:4000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
        name,
        surname,
        address,
        birthdate,
      }),
    });

    const expressData = await expressRes.json();

    if (!expressRes.ok) {
      // Si Express devolvió 4xx/5xx, devolvemos el mismo status y JSON al cliente Next
      return NextResponse.json(expressData, { status: expressRes.status });
    }

    // Si el registro fue exitoso:
    return NextResponse.json(expressData, { status: 200 });
  } catch (err) {
    console.error("Error en /api/auth/signup:", err);
    return NextResponse.json(
      { error: "Error interno en proxy de signup" },
      { status: 500 }
    );
  }
}
