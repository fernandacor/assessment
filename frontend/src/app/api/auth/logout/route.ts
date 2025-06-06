// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Creamos la respuesta que redirige a /signin
  const response = NextResponse.redirect(new URL("/signin", request.url));

  // Para borrar la cookie "token", la reescribimos con maxAge = 0
  // (en Next.js 13+, .delete() no recibe (name, opts), sino un solo objeto con "name", "path" y "maxAge")
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return response;
}