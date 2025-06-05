// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";

// Mismo secret key que usas en Express (asegúrate de que coincida exactamente)
const secretKey = "FCO7403AR0704SM2104SA0704";

// Para usarlo con jose, lo convertimos a Uint8Array:
const encoder = new TextEncoder();
const secretBuffer = encoder.encode(secretKey);

export async function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const pathname = nextUrl.pathname;
  console.log("🔐 [MW] Request a:", pathname);

  // 1) Rutas públicas que NO requieren token
  const publicPaths = [
    "/signin",
    "/signup",
    "/api/auth/signin",
    "/api/auth/signup",
    "/api/auth/logout",
    "/favicon.ico",
    "/lightBG.jpg",
    "/darkBG.jpg",
  ];

  // Si la ruta solicitada es exactamente alguna pública, o empieza con ella, dejamos pasar:
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p))) {
    console.log("🔐 [MW] Ruta pública detectada, dejo pasar:", pathname);
    return NextResponse.next();
  }

  // 2) Para el resto, requerimos la cookie "token"
  const token = cookies.get("token")?.value;
  console.log("🔐 [MW] Cookie token encontrada:", token ?? "<no existe>");

  if (!token) {
    console.log("🔐 [MW] No hay token → redirijo a /signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

}

// Matcher: todo lo que NO empiece con /_next, /favicon.ico ni /api/auth
export const config = {
  matcher: ["/((?!_next|favicon\\.ico|api/auth).*)"],
};
