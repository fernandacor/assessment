// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Creamos la respuesta que redirige a /signin
  const response = NextResponse.redirect(new URL("/signin", request.url));

  // Borramos la cookie "token" en el path "/"
  response.cookies.delete("token", { path: "/" });

  return response;
}
