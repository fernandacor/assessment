// src/app/api/auth/signin/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log("🔐 [API] POST /api/auth/signin con body:", { email, password });

    // Llamamos a tu Express para validar credenciales
    const expressRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    console.log("🔐 [API] Express respondió con status:", expressRes.status);
    if (!expressRes.ok) {
      const text = await expressRes.text();
      console.log("🔐 [API] Error de Express:", text);
      return NextResponse.json(
        { error: text || "Credenciales inválidas" },
        { status: expressRes.status }
      );
    }

    // Extraemos el token que nos devolvió Express
    const { token } = await expressRes.json();
    console.log("🔐 [API] Express devolvió token:", token);

    // Creamos la respuesta Next y seteamos la cookie HttpOnly
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,  // Importante: middleware sí podrá leerla en el servidor
      secure: false,   // Pon true en producción si tienes HTTPS
      sameSite: "lax",
      path: "/",       // disponible en todo el dominio
      maxAge: 60 * 60 * 24, // 1 día
    });
    console.log("🔐 [API] Set-Cookie enviado por Next:", response.headers.get("set-cookie"));
    return response;
  } catch (err) {
    console.error("🔐 [API] Error en /api/auth/signin:", err);
    return NextResponse.json(
      { error: "Error interno al iniciar sesión" },
      { status: 500 }
    );
  }
}
