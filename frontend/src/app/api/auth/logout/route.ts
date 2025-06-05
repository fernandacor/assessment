// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Creamos una respuesta vacía que devolverá JSON
  const response = NextResponse.json({ success: true });

  // Expiramos (borramos) la cookie "token"
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0,    // maxAge=0 hace que el navegador elimine la cookie
  });

  return response;
}
