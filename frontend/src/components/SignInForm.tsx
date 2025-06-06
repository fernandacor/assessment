// src/components/SignInForm.tsx
"use client";

import React, { useState } from "react";

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      return;
    }

    try {
      // 1) Enviar credenciales a /api/auth/signin
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      if (res.ok) {
        // 2) El servidor Next habrá creado la cookie "token" (HttpOnly).
        setError("");

        // 3) Forzar recarga completa para que la cookie quede registrada
        window.location.href = "/";
      } else {
        // 4) En caso de error, mostrar mensaje
        const errData = await res.json();
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
