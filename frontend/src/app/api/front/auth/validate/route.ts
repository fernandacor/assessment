// src/app/api/front/auth/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  // 1) Leemos el token del header "Authentication"
  const token = request.headers.get("Authentication");
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    // 2) Verificamos la firma y expiración usando tu SECRET_KEY
    jwt.verify(token, process.env.SECRET_KEY!);
    // 3) Si todo OK, devolvemos 200
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (err) {
    // 4) Si jwt.verify falla (firma inválida o expirado), devolvemos 401
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
