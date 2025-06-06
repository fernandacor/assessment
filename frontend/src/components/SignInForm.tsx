// src/components/SignInForm.tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validación HTML5 básica: si falta un campo "required", no seguimos
    if (!event.currentTarget.checkValidity()) {
      return;
    }

    try {
      // 1) Llamamos a nuestra ruta Next: /api/auth/signin
      const res = await fetch("/api/front/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Enviamos exactamente { email, password } 
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (res.ok) {
        // 2) Login exitoso: recibimos JSON { token, id, nombre }
        const data = await res.json();
        // 3) Guardamos el JWT en localStorage para usarlo luego
        localStorage.setItem("token", data.token);

        // Opcional: guardar algo de info de usuario (nombre) para mostrar en UI
        localStorage.setItem("nombreUsuario", data.nombre);

        setError("");
        // 4) Redirigir a la página protegida (ej. /dashboard)
        router.push("/");
        router.refresh();
      } else {
        // Si no es OK, extraemos el JSON con el mensaje de error
        const errData = await res.json();
        // Podrías mostrar distintos mensajes según el status
        if (res.status === 401 || res.status === 403) {
          setError("Usuario o contraseña incorrectos.");
        } else if (errData.error) {
          setError(errData.error);
        } else {
          setError("Ocurrió un error. Intenta de nuevo más tarde.");
        }
      }
    } catch (err) {
      console.error("Error en SignInForm:", err);
      setError("Error de red. Revisa tu conexión e intenta de nuevo.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Input: Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          E-mail address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={formValues.email}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, email: e.target.value }))
          }
          className="peer bg-neutral-100/50 mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
        />
        <p className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please provide a valid email address.
        </p>
      </div>

      {/* Input: Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder=" "
          required
          value={formValues.password}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, password: e.target.value }))
          }
          className="peer bg-neutral-100/50 mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
        />
        <p className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please input your password.
        </p>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="rounded-md bg-red-50 p-2">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Botón de Submit */}
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-[#355C7D] px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-[#C5CAE9] hover:text-[#253c51] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
